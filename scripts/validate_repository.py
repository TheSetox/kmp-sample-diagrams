#!/usr/bin/env python3
"""Deterministic, dependency-free repository validation for local use and CI."""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ElementTree
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
DIAGRAMS_DIR = ROOT / "diagrams"
SAMPLES_DIR = ROOT / "samples"
EXPECTED_SCENARIO_IDS = tuple(range(1, 17)) + (18, 19)
EXPECTED_MANIFEST_KEYS = {"title", "category", "file", "image", "sample"}
IGNORED_DIRECTORY_NAMES = {
    ".git",
    ".gradle",
    ".idea",
    "__pycache__",
    "build",
    "Frameworks",
    "node_modules",
}
TEXT_SUFFIXES = {
    ".bat",
    ".css",
    ".html",
    ".js",
    ".json",
    ".kt",
    ".kts",
    ".md",
    ".mjs",
    ".pbxproj",
    ".properties",
    ".py",
    ".sh",
    ".swift",
    ".toml",
    ".xml",
    ".xcscheme",
    ".yaml",
    ".yml",
}

MERMAID_BLOCK = re.compile(
    r"^```mermaid[ \t]*\n(?P<body>.*?)^```[ \t]*$", re.MULTILINE | re.DOTALL
)
MERMAID_START = re.compile(
    r"^(?:"
    r"(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR)\b|"
    r"sequenceDiagram\b|"
    r"classDiagram(?:-v2)?\b|"
    r"stateDiagram(?:-v2)?\b|"
    r"erDiagram\b|"
    r"journey\b|gantt\b|pie\b|quadrantChart\b|mindmap\b|timeline\b|"
    r"gitGraph\b|requirementDiagram\b|block-beta\b|architecture-beta\b|"
    r"packet-beta\b|kanban\b|sankey-beta\b|xychart-beta\b"
    r")"
)
INLINE_MARKDOWN_LINK = re.compile(r"!?\[[^]\n]*\]\(([^)\n]+)\)")
REFERENCE_MARKDOWN_LINK = re.compile(r"^\s*\[[^]\n]+\]:\s*(\S+)", re.MULTILINE)
SOURCE_FILE_REFERENCE = re.compile(
    r"\b([A-Za-z_][A-Za-z0-9_]*\.(?:kt|swift))\b"
)


class Validator:
    def __init__(self) -> None:
        self.errors: list[str] = []

    def fail(self, section: str, message: str) -> None:
        self.errors.append(f"[{section}] {message}")

    def require(self, condition: bool, section: str, message: str) -> None:
        if not condition:
            self.fail(section, message)


def relative(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def is_safe_relative_path(value: object) -> bool:
    if not isinstance(value, str) or not value:
        return False
    path = Path(value)
    return not path.is_absolute() and ".." not in path.parts


def positive_svg_dimension(value: str | None) -> bool:
    if value is None:
        return False
    match = re.fullmatch(r"\s*([0-9]+(?:\.[0-9]+)?)(?:px|pt)?\s*", value)
    return match is not None and float(match.group(1)) > 0


def validate_svg(validator: Validator, path: Path) -> None:
    section = "images"
    try:
        root_element = ElementTree.parse(path).getroot()
    except (OSError, ElementTree.ParseError) as error:
        validator.fail(section, f"cannot parse {relative(path)} as XML: {error}")
        return

    local_tag = root_element.tag.rsplit("}", maxsplit=1)[-1]
    validator.require(
        local_tag == "svg", section, f"{relative(path)} XML root must be <svg>"
    )
    validator.require(
        positive_svg_dimension(root_element.get("width"))
        and positive_svg_dimension(root_element.get("height")),
        section,
        f"{relative(path)} must have positive numeric width and height",
    )

    view_box = root_element.get("viewBox", "").replace(",", " ").split()
    valid_view_box = False
    if len(view_box) == 4:
        try:
            values = [float(value) for value in view_box]
            valid_view_box = values[2] > 0 and values[3] > 0
        except ValueError:
            valid_view_box = False
    validator.require(
        valid_view_box,
        section,
        f"{relative(path)} must have a four-number viewBox with positive width and height",
    )
    validator.require(
        re.fullmatch(r"[a-f0-9]{64}", root_element.get("data-render-input-sha256", ""))
        is not None,
        section,
        f"{relative(path)} must identify the Mermaid render inputs used to generate it",
    )


def load_manifest(validator: Validator) -> list[dict[str, object]]:
    path = DIAGRAMS_DIR / "manifest.json"
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        validator.fail("manifest", f"cannot read valid JSON from {relative(path)}: {error}")
        return []

    if not isinstance(manifest, list):
        validator.fail("manifest", "top-level value must be a JSON array")
        return []

    entries: list[dict[str, object]] = []
    for index, entry in enumerate(manifest, start=1):
        if not isinstance(entry, dict):
            validator.fail("manifest", f"entry {index} must be an object")
            continue
        entries.append(entry)
        keys = set(entry)
        validator.require(
            keys == EXPECTED_MANIFEST_KEYS,
            "manifest",
            f"entry {index} keys must be {sorted(EXPECTED_MANIFEST_KEYS)}; found {sorted(keys)}",
        )
        for field in ("title", "category"):
            validator.require(
                isinstance(entry.get(field), str) and bool(str(entry.get(field)).strip()),
                "manifest",
                f"entry {index} field {field!r} must be a non-empty string",
            )
        for field in ("file", "image", "sample"):
            validator.require(
                is_safe_relative_path(entry.get(field)),
                "manifest",
                f"entry {index} field {field!r} must be a safe relative path",
            )

    validator.require(
        len(entries) == len(EXPECTED_SCENARIO_IDS),
        "manifest",
        f"expected {len(EXPECTED_SCENARIO_IDS)} entries, found {len(entries)}",
    )
    for field in ("title", "file", "image", "sample"):
        values = [entry.get(field) for entry in entries]
        if all(isinstance(value, str) for value in values):
            validator.require(
                len(values) == len(set(values)),
                "manifest",
                f"field {field!r} must be unique across entries",
            )
    return entries


def validate_inventory(validator: Validator, manifest: list[dict[str, object]]) -> None:
    section = "inventory"
    manifest_files: set[str] = set()
    manifest_images: set[str] = set()
    manifest_samples: set[str] = set()
    scenario_ids: list[int] = []

    for index, entry in enumerate(manifest, start=1):
        diagram_name = entry.get("file")
        image_name = entry.get("image")
        sample_name = entry.get("sample")
        if (
            not isinstance(diagram_name, str)
            or not isinstance(image_name, str)
            or not isinstance(sample_name, str)
        ):
            continue

        manifest_files.add(diagram_name)
        manifest_images.add(image_name)
        manifest_samples.add(sample_name)
        validator.require(
            Path(diagram_name).parent == Path("."),
            section,
            f"manifest entry {index} diagram must be directly under diagrams/: {diagram_name}",
        )
        validator.require(
            Path(sample_name).parent == Path("samples"),
            section,
            f"manifest entry {index} sample must be directly under samples/: {sample_name}",
        )

        diagram_match = re.fullmatch(r"(\d{2})-[a-z0-9-]+\.md", diagram_name)
        image_match = re.fullmatch(r"images/(\d{2}-[a-z0-9-]+)\.svg", image_name)
        sample_match = re.fullmatch(r"samples/(\d{2})_[a-z0-9-]+", sample_name)
        validator.require(
            diagram_match is not None,
            section,
            f"diagram filename has an invalid shape: {diagram_name}",
        )
        validator.require(
            image_match is not None,
            section,
            f"rendered image path has an invalid shape: {image_name}",
        )
        validator.require(
            sample_match is not None,
            section,
            f"sample directory has an invalid shape: {sample_name}",
        )
        if diagram_match and sample_match:
            diagram_id = int(diagram_match.group(1))
            sample_id = int(sample_match.group(1))
            scenario_ids.append(diagram_id)
            validator.require(
                diagram_id == sample_id,
                section,
                f"scenario id mismatch: diagrams/{diagram_name} vs {sample_name}",
            )
        if diagram_match and image_match:
            validator.require(
                Path(diagram_name).stem == image_match.group(1),
                section,
                f"rendered image does not match its diagram: {diagram_name} vs {image_name}",
            )

        diagram_path = DIAGRAMS_DIR / diagram_name
        image_path = DIAGRAMS_DIR / image_name
        sample_path = ROOT / sample_name
        validator.require(diagram_path.is_file(), section, f"missing {relative(diagram_path)}")
        validator.require(image_path.is_file(), section, f"missing {relative(image_path)}")
        if image_path.is_file():
            validate_svg(validator, image_path)
        validator.require(sample_path.is_dir(), section, f"missing {relative(sample_path)}")
        for required in (
            "README.md",
            "build.gradle.kts",
            "settings.gradle.kts",
            "gradle.properties",
            "androidApp/build.gradle.kts",
            "desktopApp/build.gradle.kts",
        ):
            required_path = sample_path / required
            validator.require(
                required_path.is_file(), section, f"missing {relative(required_path)}"
            )

    actual_files = {path.name for path in DIAGRAMS_DIR.glob("*.md") if path.is_file()}
    actual_images = {
        path.relative_to(DIAGRAMS_DIR).as_posix()
        for path in (DIAGRAMS_DIR / "images").glob("*.svg")
        if path.is_file()
    }
    actual_samples = (
        {
            path.relative_to(ROOT).as_posix()
            for path in SAMPLES_DIR.iterdir()
            if path.is_dir() and re.match(r"^\d{2}_", path.name)
        }
        if SAMPLES_DIR.is_dir()
        else set()
    )
    validator.require(
        actual_files == manifest_files,
        section,
        "diagram inventory differs from manifest; "
        f"unlisted={sorted(actual_files - manifest_files)}, missing={sorted(manifest_files - actual_files)}",
    )
    validator.require(
        actual_images == manifest_images,
        section,
        "rendered image inventory differs from manifest; "
        f"unlisted={sorted(actual_images - manifest_images)}, missing={sorted(manifest_images - actual_images)}",
    )
    validator.require(
        actual_samples == manifest_samples,
        section,
        "sample inventory differs from manifest; "
        f"unlisted={sorted(actual_samples - manifest_samples)}, missing={sorted(manifest_samples - actual_samples)}",
    )
    validator.require(
        tuple(scenario_ids) == EXPECTED_SCENARIO_IDS,
        section,
        f"scenario ids must be ordered as {EXPECTED_SCENARIO_IDS}; found {tuple(scenario_ids)}",
    )


def validate_bundle(validator: Validator, manifest: list[dict[str, object]]) -> None:
    section = "bundle"
    bundle_path = DIAGRAMS_DIR / "bundle.js"
    try:
        source = bundle_path.read_text(encoding="utf-8").strip()
    except OSError as error:
        validator.fail(section, f"cannot read {relative(bundle_path)}: {error}")
        return

    prefix = "window.KMP_DIAGRAM_BUNDLE ="
    if not source.startswith(prefix) or not source.endswith(";"):
        validator.fail(section, f"{relative(bundle_path)} must be one JSON assignment ending in ';'")
        return
    try:
        bundle = json.loads(source[len(prefix) : -1].strip())
    except json.JSONDecodeError as error:
        validator.fail(section, f"embedded bundle is not valid JSON: {error}")
        return
    if not isinstance(bundle, dict):
        validator.fail(section, "embedded bundle must be an object")
        return

    validator.require(
        set(bundle) == {"manifest", "diagrams"},
        section,
        "embedded bundle must contain exactly 'manifest' and 'diagrams'",
    )
    validator.require(
        bundle.get("manifest") == manifest,
        section,
        "embedded manifest is not synchronized with diagrams/manifest.json",
    )

    expected_diagrams: dict[str, str] = {}
    for entry in manifest:
        name = entry.get("file")
        if not isinstance(name, str):
            continue
        path = DIAGRAMS_DIR / name
        if path.is_file():
            expected_diagrams[name] = path.read_text(encoding="utf-8")
    bundled_diagrams = bundle.get("diagrams")
    if not isinstance(bundled_diagrams, dict):
        validator.fail(section, "embedded diagrams value must be an object")
        return
    expected_names = set(expected_diagrams)
    bundled_names = set(bundled_diagrams)
    validator.require(
        expected_names == bundled_names,
        section,
        "embedded diagram keys differ from the manifest; "
        f"extra={sorted(bundled_names - expected_names)}, missing={sorted(expected_names - bundled_names)}",
    )
    for name in sorted(expected_names & bundled_names):
        validator.require(
            bundled_diagrams[name] == expected_diagrams[name],
            section,
            f"embedded text is stale for diagrams/{name}",
        )


def validate_mermaid(validator: Validator, manifest: list[dict[str, object]]) -> None:
    section = "mermaid"
    for entry in manifest:
        name = entry.get("file")
        if not isinstance(name, str):
            continue
        path = DIAGRAMS_DIR / name
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        blocks = list(MERMAID_BLOCK.finditer(text))
        validator.require(
            len(blocks) == 1,
            section,
            f"{relative(path)} must contain exactly one complete ```mermaid fence; found {len(blocks)}",
        )
        if len(blocks) != 1:
            continue
        body = blocks[0].group("body")
        meaningful_lines = [
            line.strip()
            for line in body.splitlines()
            if line.strip() and not line.lstrip().startswith("%%")
        ]
        validator.require(
            bool(meaningful_lines), section, f"{relative(path)} has an empty Mermaid fence"
        )
        if meaningful_lines and meaningful_lines[0] == "---":
            try:
                frontmatter_end = meaningful_lines.index("---", 1)
            except ValueError:
                validator.require(
                    False,
                    section,
                    f"{relative(path)} has unterminated Mermaid front matter",
                )
                meaningful_lines = []
            else:
                meaningful_lines = meaningful_lines[frontmatter_end + 1 :]
                validator.require(
                    bool(meaningful_lines),
                    section,
                    f"{relative(path)} has no diagram after Mermaid front matter",
                )
        if meaningful_lines:
            validator.require(
                MERMAID_START.match(meaningful_lines[0]) is not None,
                section,
                f"{relative(path)} starts with an unsupported Mermaid diagram type: {meaningful_lines[0]!r}",
            )

        sample_name = entry.get("sample")
        if not isinstance(sample_name, str):
            continue
        sample_path = ROOT / sample_name
        source_names = {
            source.name
            for source in sample_path.rglob("*")
            if source.is_file()
            and source.suffix in {".kt", ".swift"}
            and not any(
                part in IGNORED_DIRECTORY_NAMES
                for part in source.relative_to(sample_path).parts
            )
        }
        normalized_body = body.replace(r"\n", "\n")
        referenced_names = set(SOURCE_FILE_REFERENCE.findall(normalized_body))
        for missing_name in sorted(referenced_names - source_names):
            validator.fail(
                section,
                f"{relative(path)} names {missing_name}, but it does not exist under {sample_name}",
            )


def validate_xcode(validator: Validator, manifest: list[dict[str, object]]) -> None:
    section = "xcode"
    for entry in manifest:
        sample_name = entry.get("sample")
        if not isinstance(sample_name, str):
            continue
        sample = ROOT / sample_name
        project = sample / "iosApp/iosApp.xcodeproj/project.pbxproj"
        workspace = sample / "iosApp/iosApp.xcodeproj/project.xcworkspace/contents.xcworkspacedata"
        scheme = sample / "iosApp/iosApp.xcodeproj/xcshareddata/xcschemes/iosApp.xcscheme"
        for required in (project, workspace, scheme):
            validator.require(required.is_file(), section, f"missing {relative(required)}")

        if project.is_file():
            project_text = project.read_text(encoding="utf-8")
            validator.require(
                "PBXProject" in project_text and "SampleApp.swift" in project_text,
                section,
                f"{relative(project)} does not look like the expected app project",
            )
        for xml_path, expected_root in ((workspace, "Workspace"), (scheme, "Scheme")):
            if not xml_path.is_file():
                continue
            try:
                root_element = ElementTree.parse(xml_path).getroot()
                validator.require(
                    root_element.tag == expected_root,
                    section,
                    f"{relative(xml_path)} root must be <{expected_root}>",
                )
            except (OSError, ElementTree.ParseError) as error:
                validator.fail(section, f"invalid XML in {relative(xml_path)}: {error}")


def markdown_destination(raw: str) -> str:
    destination = raw.strip()
    if destination.startswith("<") and ">" in destination:
        return destination[1 : destination.index(">")]
    title_match = re.match(r"(\S+)(?:\s+[\"'].*)?$", destination)
    return title_match.group(1) if title_match else destination


def validate_markdown_links(validator: Validator) -> None:
    section = "links"
    markdown_files = sorted(
        path
        for path in ROOT.rglob("*.md")
        if not any(part in IGNORED_DIRECTORY_NAMES for part in path.relative_to(ROOT).parts)
    )
    for markdown in markdown_files:
        text = markdown.read_text(encoding="utf-8")
        raw_destinations = [match.group(1) for match in INLINE_MARKDOWN_LINK.finditer(text)]
        raw_destinations.extend(match.group(1) for match in REFERENCE_MARKDOWN_LINK.finditer(text))
        for raw in raw_destinations:
            destination = markdown_destination(raw)
            if not destination or destination.startswith("#"):
                continue
            parsed = urlsplit(destination)
            if parsed.scheme or parsed.netloc:
                continue
            link_path = unquote(parsed.path)
            if not link_path:
                continue
            candidate = (ROOT / link_path.lstrip("/")) if link_path.startswith("/") else (markdown.parent / link_path)
            resolved = candidate.resolve()
            try:
                resolved.relative_to(ROOT)
            except ValueError:
                validator.fail(
                    section,
                    f"{relative(markdown)} link escapes the repository: {destination}",
                )
                continue
            validator.require(
                resolved.exists(),
                section,
                f"broken relative link in {relative(markdown)}: {destination}",
            )


def validate_placeholders(validator: Validator) -> None:
    section = "placeholders"
    markers = ("TO" + "DO", "FIX" + "ME")
    marker_pattern = re.compile(r"\b(?:" + "|".join(markers) + r")\b")
    paths = sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path.suffix.lower() in TEXT_SUFFIXES
        and not any(part in IGNORED_DIRECTORY_NAMES for part in path.relative_to(ROOT).parts)
    )
    for path in paths:
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except UnicodeDecodeError:
            validator.fail(section, f"expected UTF-8 text in {relative(path)}")
            continue
        for line_number, line in enumerate(lines, start=1):
            match = marker_pattern.search(line)
            if match:
                validator.fail(
                    section,
                    f"{relative(path)}:{line_number} contains {match.group(0)}",
                )


def main() -> int:
    validator = Validator()
    manifest = load_manifest(validator)
    validate_inventory(validator, manifest)
    validate_bundle(validator, manifest)
    validate_mermaid(validator, manifest)
    validate_xcode(validator, manifest)
    validate_markdown_links(validator)
    validate_placeholders(validator)

    if validator.errors:
        print(f"Repository validation failed with {len(validator.errors)} error(s):", file=sys.stderr)
        for error in validator.errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Repository validation passed: "
        f"{len(manifest)} synchronized diagrams, SVG images, samples, and shared iOS schemes."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
