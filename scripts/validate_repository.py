#!/usr/bin/env python3
"""Deterministic, dependency-free repository validation for local use and CI."""

from __future__ import annotations

import base64
import hashlib
import json
import math
import re
import struct
import sys
import xml.etree.ElementTree as ElementTree
import zlib
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
DIAGRAMS_DIR = ROOT / "diagrams"
SAMPLES_DIR = ROOT / "samples"
RENDERER_PATH = ROOT / "scripts/render-diagrams.mjs"

EXPECTED_IDS = (
    "01-normal-native",
    "02-kmp-native-ui",
    "03-kmp-compose-ui",
    "04-layered-native",
    "05-kmp-data-layer",
    "06-kmp-presentation-layer",
    "07-kmp-ui-layer",
    "08-kmp-presentation-data-layer",
    "09-modular-native",
    "10-modular-kmp-data-layer",
    "11-modular-kmp-presentation-layer",
    "12-modular-kmp-ui-layer",
    "13-modular-kmp-ui-data-layer",
    "14-modular-kmp-shared-feature",
    "15-three-layer-native",
    "16-three-layer-kmp-domain",
    "18-three-layer-kmp-domain-data",
    "19-three-layer-kmp-domain-presentation",
)
EXPECTED_PROFILES = {
    "01-normal-native": "baseline",
    "02-kmp-native-ui": "shared-stack",
    "03-kmp-compose-ui": "shared-stack",
    "04-layered-native": "baseline",
    "05-kmp-data-layer": "shared-stack",
    "06-kmp-presentation-layer": "shared-stack",
    "07-kmp-ui-layer": "shared-stack",
    "08-kmp-presentation-data-layer": "shared-stack",
    "09-modular-native": "modular",
    "10-modular-kmp-data-layer": "modular",
    "11-modular-kmp-presentation-layer": "modular",
    "12-modular-kmp-ui-layer": "modular",
    "13-modular-kmp-ui-data-layer": "modular",
    "14-modular-kmp-shared-feature": "modular",
    "15-three-layer-native": "three-layer",
    "16-three-layer-kmp-domain": "three-layer",
    "18-three-layer-kmp-domain-data": "three-layer",
    "19-three-layer-kmp-domain-presentation": "three-layer",
}
EXPECTED_MANIFEST_KEYS = {
    "id",
    "title",
    "category",
    "description",
    "file",
    "spec",
    "image",
    "preview",
    "png",
    "previewPng",
    "sample",
}
MANIFEST_PATH_FIELDS = ("file", "spec", "image", "preview", "png", "previewPng", "sample")
SPEC_KEYS = {
    "schemaVersion",
    "id",
    "number",
    "title",
    "subtitle",
    "category",
    "layout",
    "groups",
    "nodes",
    "edges",
}
GROUP_REQUIRED_KEYS = {"id", "title", "subtitle", "kind", "layout", "order"}
GROUP_ALLOWED_KEYS = GROUP_REQUIRED_KEYS | {"parent"}
NODE_KEYS = {"id", "parent", "title", "subtitle", "kind", "order", "sourceRefs"}
EDGE_REQUIRED_KEYS = {"id", "from", "to", "route"}
EDGE_ALLOWED_KEYS = EDGE_REQUIRED_KEYS | {"label", "fromAnchor", "toAnchor", "waypoints"}
GROUP_KINDS = {"application", "conceptual", "platform", "shared"}
NODE_KINDS = {"application", "conceptual", "platform", "shared"}
GROUP_LAYOUTS = {"vertical", "horizontal"}
EDGE_ROUTES = {"straight", "orthogonal"}
ANCHORS = {"top", "right", "bottom", "left"}
FULL_DESIGN = "engineering-doc-v3"
PREVIEW_DESIGN = "readme-preview-v3"

IGNORED_DIRECTORY_NAMES = {
    ".git",
    ".gradle",
    ".idea",
    "_site",
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

INLINE_MARKDOWN_LINK = re.compile(r"!?\[[^]\n]*\]\(([^)\n]+)\)")
REFERENCE_MARKDOWN_LINK = re.compile(r"^\s*\[[^]\n]+\]:\s*(\S+)", re.MULTILINE)
SOURCE_FILE_REFERENCE = re.compile(r"\b([A-Za-z_][A-Za-z0-9_]*\.(?:kt|swift))\b")
ITEM_ID = re.compile(r"[A-Za-z][A-Za-z0-9_]*")
EDGE_ID = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*")
SOURCE_REF = re.compile(r"[A-Za-z_][A-Za-z0-9_]*\.(?:kt|swift)")
NUMBER = r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?"
NUMBER_PATTERN = re.compile(NUMBER)
SVG_DIMENSION = re.compile(r"(?:0|[1-9]\d*)(?:\.\d+)?")
PATH_POINT = re.compile(rf"([ML])\s*({NUMBER})[\s,]+({NUMBER})")
URL_REFERENCE = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE | re.DOTALL)
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


class Validator:
    def __init__(self) -> None:
        self.errors: list[str] = []

    def fail(self, section: str, message: str) -> None:
        self.errors.append(f"[{section}] {message}")

    def require(self, condition: bool, section: str, message: str) -> None:
        if not condition:
            self.fail(section, message)


class HtmlAssetCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.destinations: list[str] = []

    def handle_starttag(
        self, tag: str, attributes: list[tuple[str, str | None]]
    ) -> None:
        target_attribute = "href" if tag in {"a", "link"} else "src" if tag in {"img", "script"} else None
        if target_attribute is None:
            return
        for name, value in attributes:
            if name == target_attribute and value:
                self.destinations.append(value)


def relative(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def local_name(tag: str) -> str:
    return tag.rsplit("}", maxsplit=1)[-1]


def is_non_empty_string(value: object) -> bool:
    return isinstance(value, str) and bool(value.strip())


def is_positive_integer(value: object) -> bool:
    return type(value) is int and value > 0


def is_safe_relative_path(value: object) -> bool:
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        return False
    path = Path(value)
    return (
        not path.is_absolute()
        and value == path.as_posix()
        and all(part not in {"", ".", ".."} for part in path.parts)
    )


def compact_json(value: object) -> bytes:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")


def load_manifest(validator: Validator) -> list[dict[str, Any]]:
    path = DIAGRAMS_DIR / "manifest.json"
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        validator.fail("manifest", f"cannot read valid JSON from {relative(path)}: {error}")
        return []

    if not isinstance(manifest, list):
        validator.fail("manifest", "top-level value must be a JSON array")
        return []

    entries: list[dict[str, Any]] = []
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
        for field in EXPECTED_MANIFEST_KEYS - set(MANIFEST_PATH_FIELDS):
            validator.require(
                is_non_empty_string(entry.get(field)),
                "manifest",
                f"entry {index} field {field!r} must be a non-empty string",
            )
        for field in MANIFEST_PATH_FIELDS:
            validator.require(
                is_safe_relative_path(entry.get(field)),
                "manifest",
                f"entry {index} field {field!r} must be a safe normalized relative path",
            )
            value = entry.get(field)
            if isinstance(value, str) and is_safe_relative_path(value):
                base = ROOT if field == "sample" else DIAGRAMS_DIR
                try:
                    (base / value).resolve().relative_to(base.resolve())
                except ValueError:
                    validator.fail(
                        "manifest",
                        f"entry {index} field {field!r} resolves outside {relative(base)}",
                    )

        scenario_id = entry.get("id")
        if isinstance(scenario_id, str):
            expected_paths = {
                "file": f"{scenario_id}.md",
                "spec": f"specs/{scenario_id}.json",
                "image": f"images/{scenario_id}.svg",
                "preview": f"previews/{scenario_id}.svg",
                "png": f"images/{scenario_id}@2x.png",
                "previewPng": f"previews/{scenario_id}@2x.png",
            }
            for field, expected in expected_paths.items():
                validator.require(
                    entry.get(field) == expected,
                    "manifest",
                    f"entry {index} field {field!r} must be {expected!r}",
                )
            sample = entry.get("sample")
            validator.require(
                isinstance(sample, str)
                and re.fullmatch(rf"samples/{re.escape(scenario_id[:2])}_[a-z0-9-]+", sample)
                is not None,
                "manifest",
                f"entry {index} sample path must use the {scenario_id[:2]}_ scenario prefix",
            )

    ids = tuple(entry.get("id") for entry in entries)
    validator.require(
        ids == EXPECTED_IDS,
        "manifest",
        f"scenario ids must be exactly {EXPECTED_IDS}; found {ids}",
    )
    validator.require(
        len(entries) == len(EXPECTED_IDS),
        "manifest",
        f"expected {len(EXPECTED_IDS)} entries, found {len(entries)}",
    )
    for field in ("id", "title", *MANIFEST_PATH_FIELDS):
        values = [entry.get(field) for entry in entries]
        if all(isinstance(value, str) for value in values):
            validator.require(
                len(values) == len(set(values)),
                "manifest",
                f"field {field!r} must be unique across manifest entries",
            )
    return entries


def validate_documentation(
    validator: Validator, entry: dict[str, Any], path: Path
) -> None:
    section = "documentation"
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as error:
        validator.fail(section, f"cannot read {relative(path)}: {error}")
        return

    scenario_id = entry.get("id")
    title = entry.get("title")
    description = entry.get("description")
    if isinstance(scenario_id, str) and isinstance(title, str):
        validator.require(
            text.startswith(f"# {scenario_id[:2]}. {title}\n\n"),
            section,
            f"{relative(path)} must start with its numbered manifest title",
        )
    if isinstance(description, str):
        validator.require(
            f"\n\n{description}\n\n" in text,
            section,
            f"{relative(path)} must include its manifest description",
        )
    for field in ("image", "preview", "png", "previewPng", "spec"):
        destination = entry.get(field)
        if isinstance(destination, str):
            validator.require(
                destination in text,
                section,
                f"{relative(path)} must link to {destination}",
            )
    sample = entry.get("sample")
    if isinstance(sample, str):
        validator.require(
            f"../{sample}/" in text,
            section,
            f"{relative(path)} must link to its runnable sample",
        )
    legacy_diagram_fence = "```" + "mer" + "maid"
    validator.require(
        legacy_diagram_fence not in text.lower()
        and re.search(r"^\s*(?:flowchart|graph|sequenceDiagram|subgraph)\b", text, re.MULTILINE)
        is None,
        section,
        f"{relative(path)} must not contain legacy diagram source",
    )


def source_basenames(sample_path: Path) -> set[str]:
    if not sample_path.is_dir():
        return set()
    return {
        source.name
        for source in sample_path.rglob("*")
        if source.is_file()
        and source.suffix in {".kt", ".swift"}
        and not any(
            part in IGNORED_DIRECTORY_NAMES
            for part in source.relative_to(sample_path).parts
        )
    }


def validate_unique_orders(
    validator: Validator,
    spec_name: str,
    items: list[dict[str, Any]],
    section_name: str,
) -> None:
    seen: set[tuple[object, object]] = set()
    for item in items:
        parent = item.get("parent")
        order = item.get("order")
        if parent is not None and not isinstance(parent, str):
            continue
        if not is_positive_integer(order):
            continue
        key = (parent, order)
        if key in seen:
            validator.fail(
                "specs",
                f"{spec_name} has duplicate {section_name} order {key[1]!r} under {key[0]!r}",
            )
        seen.add(key)


def validate_spec(
    validator: Validator, entry: dict[str, Any], path: Path
) -> dict[str, Any] | None:
    section = "specs"
    try:
        spec = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
        validator.fail(section, f"cannot read valid JSON from {relative(path)}: {error}")
        return None
    if not isinstance(spec, dict):
        validator.fail(section, f"{relative(path)} top-level value must be an object")
        return None

    validator.require(
        set(spec) == SPEC_KEYS,
        section,
        f"{relative(path)} keys must be {sorted(SPEC_KEYS)}; found {sorted(spec)}",
    )
    validator.require(
        spec.get("schemaVersion") == 1,
        section,
        f"{relative(path)} must use schemaVersion 1",
    )
    scenario_id = entry.get("id")
    validator.require(
        spec.get("id") == scenario_id,
        section,
        f"{relative(path)} id must match manifest id {scenario_id!r}",
    )
    expected_number = int(scenario_id[:2]) if isinstance(scenario_id, str) else None
    validator.require(
        type(spec.get("number")) is int and spec.get("number") == expected_number,
        section,
        f"{relative(path)} number must be {expected_number}",
    )
    for spec_field, manifest_field in (
        ("title", "title"),
        ("subtitle", "description"),
        ("category", "category"),
    ):
        validator.require(
            spec.get(spec_field) == entry.get(manifest_field),
            section,
            f"{relative(path)} {spec_field} must match manifest {manifest_field}",
        )

    layout = spec.get("layout")
    validator.require(
        isinstance(layout, dict) and set(layout) == {"profile"},
        section,
        f"{relative(path)} layout must contain exactly one profile",
    )
    profile = layout.get("profile") if isinstance(layout, dict) else None
    validator.require(
        profile == EXPECTED_PROFILES.get(str(scenario_id)),
        section,
        f"{relative(path)} profile must be {EXPECTED_PROFILES.get(str(scenario_id))!r}",
    )

    raw_groups = spec.get("groups")
    raw_nodes = spec.get("nodes")
    raw_edges = spec.get("edges")
    validator.require(isinstance(raw_groups, list), section, f"{relative(path)} groups must be an array")
    validator.require(isinstance(raw_nodes, list), section, f"{relative(path)} nodes must be an array")
    validator.require(isinstance(raw_edges, list), section, f"{relative(path)} edges must be an array")
    groups = [item for item in raw_groups or [] if isinstance(item, dict)] if isinstance(raw_groups, list) else []
    nodes = [item for item in raw_nodes or [] if isinstance(item, dict)] if isinstance(raw_nodes, list) else []
    edges = [item for item in raw_edges or [] if isinstance(item, dict)] if isinstance(raw_edges, list) else []
    if isinstance(raw_groups, list):
        validator.require(len(groups) == len(raw_groups), section, f"{relative(path)} groups must contain only objects")
    if isinstance(raw_nodes, list):
        validator.require(len(nodes) == len(raw_nodes), section, f"{relative(path)} nodes must contain only objects")
    if isinstance(raw_edges, list):
        validator.require(len(edges) == len(raw_edges), section, f"{relative(path)} edges must contain only objects")

    group_ids: set[str] = set()
    for index, group in enumerate(groups, start=1):
        keys = set(group)
        validator.require(
            GROUP_REQUIRED_KEYS <= keys <= GROUP_ALLOWED_KEYS,
            section,
            f"{relative(path)} group {index} keys must be {sorted(GROUP_REQUIRED_KEYS)} plus optional parent; found {sorted(keys)}",
        )
        group_id = group.get("id")
        validator.require(
            isinstance(group_id, str) and ITEM_ID.fullmatch(group_id) is not None,
            section,
            f"{relative(path)} group {index} has an invalid id",
        )
        if isinstance(group_id, str):
            validator.require(
                group_id not in group_ids,
                section,
                f"{relative(path)} has duplicate group id {group_id!r}",
            )
            group_ids.add(group_id)
        validator.require(is_non_empty_string(group.get("title")), section, f"{relative(path)} group {group_id!r} needs a title")
        validator.require(isinstance(group.get("subtitle"), str), section, f"{relative(path)} group {group_id!r} subtitle must be a string")
        validator.require(group.get("kind") in GROUP_KINDS, section, f"{relative(path)} group {group_id!r} has unsupported kind {group.get('kind')!r}")
        validator.require(group.get("layout") in GROUP_LAYOUTS, section, f"{relative(path)} group {group_id!r} has unsupported layout {group.get('layout')!r}")
        validator.require(is_positive_integer(group.get("order")), section, f"{relative(path)} group {group_id!r} order must be a positive integer")
        if "parent" in group:
            validator.require(is_non_empty_string(group.get("parent")), section, f"{relative(path)} group {group_id!r} parent must be a non-empty string")
    validate_unique_orders(validator, relative(path), groups, "group")

    group_by_id = {
        group["id"]: group
        for group in groups
        if isinstance(group.get("id"), str)
    }
    for group_id, group in group_by_id.items():
        parent = group.get("parent")
        if parent is not None:
            validator.require(
                isinstance(parent, str)
                and parent in group_by_id
                and parent != group_id,
                section,
                f"{relative(path)} group {group_id!r} has invalid parent {parent!r}",
            )

    visit_state: dict[str, int] = {}

    def visit_group(group_id: str) -> None:
        state = visit_state.get(group_id, 0)
        if state == 1:
            validator.fail(section, f"{relative(path)} contains a group-parent cycle at {group_id!r}")
            return
        if state == 2:
            return
        visit_state[group_id] = 1
        parent = group_by_id[group_id].get("parent")
        if isinstance(parent, str) and parent in group_by_id:
            visit_group(parent)
        visit_state[group_id] = 2

    for group_id in group_by_id:
        visit_group(group_id)

    item_ids = set(group_ids)
    sample = entry.get("sample")
    sample_path = ROOT / sample if isinstance(sample, str) else ROOT / "__invalid_sample__"
    available_sources = source_basenames(sample_path)
    for index, node in enumerate(nodes, start=1):
        validator.require(
            set(node) == NODE_KEYS,
            section,
            f"{relative(path)} node {index} keys must be {sorted(NODE_KEYS)}; found {sorted(node)}",
        )
        node_id = node.get("id")
        validator.require(
            isinstance(node_id, str) and ITEM_ID.fullmatch(node_id) is not None,
            section,
            f"{relative(path)} node {index} has an invalid id",
        )
        if isinstance(node_id, str):
            validator.require(
                node_id not in item_ids,
                section,
                f"{relative(path)} has duplicate item id {node_id!r}",
            )
            item_ids.add(node_id)
        node_parent = node.get("parent")
        validator.require(
            isinstance(node_parent, str) and node_parent in group_ids,
            section,
            f"{relative(path)} node {node_id!r} has unknown parent {node_parent!r}",
        )
        validator.require(is_non_empty_string(node.get("title")), section, f"{relative(path)} node {node_id!r} needs a title")
        validator.require(isinstance(node.get("subtitle"), str), section, f"{relative(path)} node {node_id!r} subtitle must be a string")
        validator.require(node.get("kind") in NODE_KINDS, section, f"{relative(path)} node {node_id!r} has unsupported kind {node.get('kind')!r}")
        validator.require(is_positive_integer(node.get("order")), section, f"{relative(path)} node {node_id!r} order must be a positive integer")
        source_refs = node.get("sourceRefs")
        validator.require(
            isinstance(source_refs, list) and bool(source_refs),
            section,
            f"{relative(path)} node {node_id!r} sourceRefs must be a non-empty array",
        )
        if isinstance(source_refs, list):
            validator.require(
                len(source_refs) == len(set(ref for ref in source_refs if isinstance(ref, str))),
                section,
                f"{relative(path)} node {node_id!r} sourceRefs must be unique",
            )
            for source_ref in source_refs:
                valid_ref = isinstance(source_ref, str) and SOURCE_REF.fullmatch(source_ref) is not None
                validator.require(
                    valid_ref,
                    section,
                    f"{relative(path)} node {node_id!r} has invalid sourceRef {source_ref!r}",
                )
                if valid_ref and sample_path.is_dir():
                    validator.require(
                        source_ref in available_sources,
                        section,
                        f"{relative(path)} node {node_id!r} references {source_ref}, but it does not exist under {sample}",
                    )
            literal_refs = set(
                SOURCE_FILE_REFERENCE.findall(
                    f"{node.get('title', '')} {node.get('subtitle', '')}"
                )
            )
            validator.require(
                literal_refs <= set(ref for ref in source_refs if isinstance(ref, str)),
                section,
                f"{relative(path)} node {node_id!r} must include every displayed Kotlin/Swift filename in sourceRefs",
            )
    validate_unique_orders(validator, relative(path), nodes, "node")

    edge_ids: set[str] = set()
    for index, edge in enumerate(edges, start=1):
        keys = set(edge)
        validator.require(
            EDGE_REQUIRED_KEYS <= keys <= EDGE_ALLOWED_KEYS,
            section,
            f"{relative(path)} edge {index} keys must be {sorted(EDGE_REQUIRED_KEYS)} plus optional label, anchors, and waypoints; found {sorted(keys)}",
        )
        edge_id = edge.get("id")
        validator.require(
            isinstance(edge_id, str) and EDGE_ID.fullmatch(edge_id) is not None,
            section,
            f"{relative(path)} edge {index} has an invalid id",
        )
        if isinstance(edge_id, str):
            validator.require(edge_id not in edge_ids, section, f"{relative(path)} has duplicate edge id {edge_id!r}")
            validator.require(edge_id not in item_ids, section, f"{relative(path)} edge id {edge_id!r} collides with an item id")
            edge_ids.add(edge_id)
        edge_from = edge.get("from")
        edge_to = edge.get("to")
        validator.require(
            isinstance(edge_from, str) and edge_from in item_ids,
            section,
            f"{relative(path)} edge {edge_id!r} has unknown source {edge_from!r}",
        )
        validator.require(
            isinstance(edge_to, str) and edge_to in item_ids,
            section,
            f"{relative(path)} edge {edge_id!r} has unknown target {edge_to!r}",
        )
        validator.require(
            edge_from != edge_to,
            section,
            f"{relative(path)} edge {edge_id!r} cannot be a self-edge",
        )
        validator.require(edge.get("route") in EDGE_ROUTES, section, f"{relative(path)} edge {edge_id!r} has unsupported route {edge.get('route')!r}")
        if "label" in edge:
            validator.require(is_non_empty_string(edge.get("label")), section, f"{relative(path)} edge {edge_id!r} label must be non-empty")
        for anchor_field in ("fromAnchor", "toAnchor"):
            if anchor_field in edge:
                validator.require(edge.get(anchor_field) in ANCHORS, section, f"{relative(path)} edge {edge_id!r} has unsupported {anchor_field} {edge.get(anchor_field)!r}")
        if "waypoints" in edge:
            waypoints = edge.get("waypoints")
            validator.require(
                isinstance(waypoints, list) and bool(waypoints),
                section,
                f"{relative(path)} edge {edge_id!r} waypoints must be a non-empty array",
            )
            if isinstance(waypoints, list):
                for waypoint_index, waypoint in enumerate(waypoints, start=1):
                    valid_waypoint = (
                        isinstance(waypoint, dict)
                        and set(waypoint) == {"x", "y"}
                        and all(
                            type(waypoint.get(axis)) in {int, float}
                            and math.isfinite(waypoint[axis])
                            for axis in ("x", "y")
                        )
                    )
                    validator.require(
                        valid_waypoint,
                        section,
                        f"{relative(path)} edge {edge_id!r} waypoint {waypoint_index} must contain exactly finite numeric x/y coordinates",
                    )
        if edge.get("route") == "straight":
            validator.require(
                edge.get("fromAnchor") in ANCHORS and edge.get("toAnchor") in ANCHORS,
                section,
                f"{relative(path)} straight edge {edge_id!r} must declare both anchors",
            )
            from_anchor = edge.get("fromAnchor")
            to_anchor = edge.get("toAnchor")
            same_axis = (
                from_anchor in {"top", "bottom"} and to_anchor in {"top", "bottom"}
            ) or (
                from_anchor in {"left", "right"} and to_anchor in {"left", "right"}
            )
            validator.require(same_axis, section, f"{relative(path)} straight edge {edge_id!r} anchors must share an axis")
    return spec


def validate_inventory(
    validator: Validator, manifest: list[dict[str, Any]]
) -> dict[str, dict[str, Any]]:
    section = "inventory"
    expected_docs = {entry.get("file") for entry in manifest if isinstance(entry.get("file"), str)}
    expected_specs = {entry.get("spec") for entry in manifest if isinstance(entry.get("spec"), str)}
    expected_images = {
        entry.get(field)
        for entry in manifest
        for field in ("image", "png")
        if isinstance(entry.get(field), str)
    }
    expected_previews = {
        entry.get(field)
        for entry in manifest
        for field in ("preview", "previewPng")
        if isinstance(entry.get(field), str)
    }
    expected_samples = {entry.get("sample") for entry in manifest if isinstance(entry.get("sample"), str)}

    actual_docs = {path.name for path in DIAGRAMS_DIR.glob("*.md") if path.is_file()}
    actual_specs = {
        path.relative_to(DIAGRAMS_DIR).as_posix()
        for path in (DIAGRAMS_DIR / "specs").glob("*.json")
        if path.is_file()
    }
    actual_images = {
        path.relative_to(DIAGRAMS_DIR).as_posix()
        for path in (DIAGRAMS_DIR / "images").iterdir()
        if path.is_file() and path.suffix.lower() in {".svg", ".png"}
    } if (DIAGRAMS_DIR / "images").is_dir() else set()
    actual_previews = {
        path.relative_to(DIAGRAMS_DIR).as_posix()
        for path in (DIAGRAMS_DIR / "previews").iterdir()
        if path.is_file() and path.suffix.lower() in {".svg", ".png"}
    } if (DIAGRAMS_DIR / "previews").is_dir() else set()
    actual_samples = {
        path.relative_to(ROOT).as_posix()
        for path in SAMPLES_DIR.iterdir()
        if path.is_dir() and re.fullmatch(r"\d{2}_.+", path.name)
    } if SAMPLES_DIR.is_dir() else set()

    for label, actual, expected in (
        ("diagram documentation", actual_docs, expected_docs),
        ("diagram specifications", actual_specs, expected_specs),
        ("full diagram SVG/PNG assets", actual_images, expected_images),
        ("preview SVG/PNG assets", actual_previews, expected_previews),
        ("sample directories", actual_samples, expected_samples),
    ):
        validator.require(
            actual == expected,
            section,
            f"{label} inventory differs from manifest; unlisted={sorted(actual - expected)}, missing={sorted(expected - actual)}",
        )

    specs: dict[str, dict[str, Any]] = {}
    for entry in manifest:
        scenario_id = entry.get("id")
        document = DIAGRAMS_DIR / str(entry.get("file", "__missing__"))
        spec_path = DIAGRAMS_DIR / str(entry.get("spec", "__missing__"))
        sample = ROOT / str(entry.get("sample", "__missing__"))
        validator.require(document.is_file(), section, f"missing {relative(document)}")
        validator.require(spec_path.is_file(), section, f"missing {relative(spec_path)}")
        validator.require(sample.is_dir(), section, f"missing {relative(sample)}")
        if document.is_file():
            validate_documentation(validator, entry, document)
        if spec_path.is_file():
            spec = validate_spec(validator, entry, spec_path)
            if spec is not None and isinstance(scenario_id, str):
                specs[scenario_id] = spec
        if sample.is_dir():
            for required in (
                "README.md",
                "build.gradle.kts",
                "settings.gradle.kts",
                "gradle.properties",
                "androidApp/build.gradle.kts",
                "desktopApp/build.gradle.kts",
            ):
                required_path = sample / required
                validator.require(required_path.is_file(), section, f"missing {relative(required_path)}")
    return specs


def parse_svg_numbers(value: str | None, count: int) -> list[float] | None:
    if value is None:
        return None
    pieces = value.replace(",", " ").split()
    if len(pieces) != count or any(NUMBER_PATTERN.fullmatch(piece) is None for piece in pieces):
        return None
    numbers = [float(piece) for piece in pieces]
    return numbers if all(math.isfinite(number) for number in numbers) else None


def parse_route_points(value: str | None) -> list[tuple[float, float]] | None:
    if not value:
        return None
    points: list[tuple[float, float]] = []
    for token in value.split():
        pieces = token.split(",")
        if len(pieces) != 2 or any(NUMBER_PATTERN.fullmatch(piece) is None for piece in pieces):
            return None
        point = (float(pieces[0]), float(pieces[1]))
        if not all(math.isfinite(coordinate) for coordinate in point):
            return None
        points.append(point)
    return points if len(points) >= 2 else None


def parse_path_points(value: str | None) -> list[tuple[float, float]] | None:
    if not value:
        return None
    points: list[tuple[float, float]] = []
    position = 0
    commands: list[str] = []
    for match in PATH_POINT.finditer(value):
        if value[position:match.start()].strip():
            return None
        commands.append(match.group(1))
        point = (float(match.group(2)), float(match.group(3)))
        if not all(math.isfinite(coordinate) for coordinate in point):
            return None
        points.append(point)
        position = match.end()
    if value[position:].strip() or len(points) < 2:
        return None
    return points if commands[0] == "M" and all(command == "L" for command in commands[1:]) else None


def points_are_collinear(points: list[tuple[float, float]], tolerance: float = 1e-6) -> bool:
    start = points[0]
    end = points[-1]
    delta_x = end[0] - start[0]
    delta_y = end[1] - start[1]
    if abs(delta_x) <= tolerance and abs(delta_y) <= tolerance:
        return False
    scale = max(1.0, abs(delta_x), abs(delta_y))
    return all(
        abs((point[0] - start[0]) * delta_y - (point[1] - start[1]) * delta_x)
        <= tolerance * scale
        for point in points[1:-1]
    )


def points_are_orthogonal(points: list[tuple[float, float]], tolerance: float = 1e-6) -> bool:
    for start, end in zip(points, points[1:]):
        delta_x = abs(end[0] - start[0])
        delta_y = abs(end[1] - start[1])
        if delta_x <= tolerance and delta_y <= tolerance:
            return False
        if delta_x > tolerance and delta_y > tolerance:
            return False
    return True


def validate_route_geometry(
    validator: Validator,
    section: str,
    path: Path,
    edge: dict[str, Any],
    points: list[tuple[float, float]],
) -> None:
    edge_id = edge.get("id")
    if edge.get("route") == "straight":
        validator.require(
            points_are_collinear(points),
            section,
            f"{relative(path)} straight edge {edge_id!r} route points must be collinear",
        )
        anchors = {edge.get("fromAnchor"), edge.get("toAnchor")}
        if anchors <= {"top", "bottom"}:
            validator.require(
                max(point[0] for point in points) - min(point[0] for point in points) <= 1e-6,
                section,
                f"{relative(path)} straight edge {edge_id!r} must be vertical for top/bottom anchors",
            )
        if anchors <= {"left", "right"}:
            validator.require(
                max(point[1] for point in points) - min(point[1] for point in points) <= 1e-6,
                section,
                f"{relative(path)} straight edge {edge_id!r} must be horizontal for left/right anchors",
            )
    else:
        validator.require(
            points_are_orthogonal(points),
            section,
            f"{relative(path)} orthogonal edge {edge_id!r} must contain only axis-aligned segments",
        )


def expected_render_fingerprint(
    validator: Validator,
    spec: dict[str, Any],
    entry: dict[str, Any],
) -> str | None:
    section = "fingerprint"
    font_paths = (
        DIAGRAMS_DIR / "fonts/Inter-Regular.ttf",
        DIAGRAMS_DIR / "fonts/Inter-SemiBold.ttf",
        DIAGRAMS_DIR / "fonts/Inter-Regular.woff2",
        DIAGRAMS_DIR / "fonts/Inter-SemiBold.woff2",
    )
    required_paths = (RENDERER_PATH, *font_paths)
    missing = [relative(path) for path in required_paths if not path.is_file()]
    if missing:
        validator.fail(section, f"cannot calculate render fingerprint; missing {missing}")
        return None
    try:
        font_hash = hashlib.sha256()
        font_hash.update(font_paths[0].read_bytes())
        font_hash.update(font_paths[1].read_bytes())
        font_hash.update(base64.b64encode(font_paths[2].read_bytes()))
        font_hash.update(base64.b64encode(font_paths[3].read_bytes()))
        fingerprint = hashlib.sha256()
        fingerprint.update(compact_json(spec))
        fingerprint.update(compact_json(entry))
        fingerprint.update(RENDERER_PATH.read_bytes())
        fingerprint.update(font_hash.hexdigest().encode("ascii"))
        fingerprint.update(FULL_DESIGN.encode("ascii"))
        fingerprint.update(PREVIEW_DESIGN.encode("ascii"))
        return fingerprint.hexdigest()
    except OSError as error:
        validator.fail(section, f"cannot calculate render fingerprint: {error}")
        return None


def validate_url_target(
    validator: Validator, section: str, path: Path, target: str
) -> None:
    normalized = target.strip().strip("\"'").lower()
    validator.require(
        normalized.startswith("#") or normalized.startswith("data:"),
        section,
        f"{relative(path)} contains an external SVG reference: {target[:80]!r}",
    )


def validate_bounds(
    validator: Validator,
    section: str,
    path: Path,
    label: str,
    bounds: list[float] | None,
    view_box: list[float],
) -> None:
    if bounds is None:
        validator.fail(section, f"{relative(path)} {label} has invalid data-bounds")
        return
    x, y, width, height = bounds
    view_x, view_y, view_width, view_height = view_box
    tolerance = 0.11
    validator.require(
        width > 0
        and height > 0
        and x >= view_x - tolerance
        and y >= view_y - tolerance
        and x + width <= view_x + view_width + tolerance
        and y + height <= view_y + view_height + tolerance,
        section,
        f"{relative(path)} {label} bounds {bounds} must be inside viewBox {view_box}",
    )


def bounds_have_positive_area(bounds: list[float] | None) -> bool:
    return bounds is not None and bounds[2] > 0 and bounds[3] > 0


def rectangles_overlap_interior(
    first: list[float], second: list[float], tolerance: float = 0.25
) -> bool:
    """Return whether two rectangles overlap by more than a boundary contact."""
    first_x, first_y, first_width, first_height = first
    second_x, second_y, second_width, second_height = second
    overlap_width = min(first_x + first_width, second_x + second_width) - max(
        first_x, second_x
    )
    overlap_height = min(first_y + first_height, second_y + second_height) - max(
        first_y, second_y
    )
    return overlap_width > tolerance and overlap_height > tolerance


def segment_enters_bounds_interior(
    start: tuple[float, float],
    end: tuple[float, float],
    bounds: list[float],
    tolerance: float = 0.25,
) -> bool:
    """Clip a segment against a slightly inset rectangle to ignore edge touches."""
    x, y, width, height = bounds
    minimum_x = x + tolerance
    maximum_x = x + width - tolerance
    minimum_y = y + tolerance
    maximum_y = y + height - tolerance
    if minimum_x >= maximum_x or minimum_y >= maximum_y or start == end:
        return False

    delta_x = end[0] - start[0]
    delta_y = end[1] - start[1]
    minimum_parameter = 0.0
    maximum_parameter = 1.0
    for origin, delta, lower, upper in (
        (start[0], delta_x, minimum_x, maximum_x),
        (start[1], delta_y, minimum_y, maximum_y),
    ):
        if abs(delta) <= 1e-9:
            if origin < lower or origin > upper:
                return False
            continue
        first_parameter = (lower - origin) / delta
        second_parameter = (upper - origin) / delta
        entry = min(first_parameter, second_parameter)
        exit_ = max(first_parameter, second_parameter)
        minimum_parameter = max(minimum_parameter, entry)
        maximum_parameter = min(maximum_parameter, exit_)
        if minimum_parameter > maximum_parameter:
            return False
    return maximum_parameter >= 0.0 and minimum_parameter <= 1.0


def approximate_text_width(
    text: str, font_size: float, font_weight: str, letter_spacing: float
) -> float:
    """Estimate Inter advances closely enough to catch clipping without font tooling."""
    units = 0.0
    for character in text:
        if character.isspace():
            units += 0.28
        elif character in "ilI1.,:;!'`|":
            units += 0.30
        elif character in "frt()[]{}":
            units += 0.40
        elif character in "mwMW@%&QO":
            units += 0.86
        elif character.isupper():
            units += 0.66
        elif character.isdigit():
            units += 0.57
        elif character.islower():
            units += 0.54
        else:
            units += 0.62
    try:
        is_semibold = float(font_weight) >= 600
    except ValueError:
        is_semibold = font_weight.lower() in {"bold", "bolder"}
    weight_adjustment = 1.02 if is_semibold else 1.0
    return (
        units * font_size * weight_adjustment
        + max(0, len(text) - 1) * letter_spacing
    )


def validate_text_geometry(
    validator: Validator,
    section: str,
    path: Path,
    root_element: ElementTree.Element,
    view_box: list[float],
) -> None:
    """Approximate every rendered text run and reject likely viewBox clipping."""
    view_x, view_y, view_width, view_height = view_box
    view_right = view_x + view_width
    view_bottom = view_y + view_height
    tolerance = 0.75

    def number(attribute: str | None) -> float | None:
        parsed = parse_svg_numbers(attribute, 1)
        return parsed[0] if parsed is not None else None

    for text_element in (
        element for element in root_element.iter() if local_name(element.tag) == "text"
    ):
        validator.require(
            text_element.get("transform") is None,
            section,
            f"{relative(path)} text geometry cannot use transforms",
        )
        font_size = number(text_element.get("font-size"))
        if font_size is None or font_size <= 0:
            validator.fail(section, f"{relative(path)} text has an invalid font-size")
            continue
        letter_spacing_text = text_element.get("letter-spacing")
        letter_spacing = (
            number(letter_spacing_text) if letter_spacing_text is not None else 0.0
        )
        if letter_spacing is None:
            validator.fail(section, f"{relative(path)} text has invalid letter-spacing")
            continue
        text_anchor = text_element.get("text-anchor", "start")
        validator.require(
            text_anchor in {"start", "middle", "end"},
            section,
            f"{relative(path)} text has unsupported text-anchor {text_anchor!r}",
        )
        if text_anchor not in {"start", "middle", "end"}:
            continue

        current_x = number(text_element.get("x"))
        current_y = number(text_element.get("y"))
        tspans = [
            child for child in text_element if local_name(child.tag) == "tspan"
        ]
        runs = tspans if tspans else [text_element]
        for run in runs:
            content = "".join(run.itertext()).strip()
            if not content:
                continue
            explicit_x = number(run.get("x")) if run is not text_element else None
            explicit_y = number(run.get("y")) if run is not text_element else None
            delta_y = number(run.get("dy")) if run.get("dy") is not None else None
            if (
                run is not text_element
                and run.get("x") is not None
                and explicit_x is None
            ):
                validator.fail(section, f"{relative(path)} text has an invalid x coordinate")
                continue
            if (
                run is not text_element
                and run.get("y") is not None
                and explicit_y is None
            ):
                validator.fail(section, f"{relative(path)} text has an invalid y coordinate")
                continue
            if run.get("dy") is not None and delta_y is None:
                validator.fail(section, f"{relative(path)} text has an invalid dy coordinate")
                continue
            if explicit_x is not None:
                current_x = explicit_x
            if explicit_y is not None:
                current_y = explicit_y
            elif delta_y is not None and current_y is not None:
                current_y += delta_y
            if current_x is None or current_y is None:
                validator.fail(
                    section,
                    f"{relative(path)} text {content[:48]!r} has no absolute position",
                )
                continue

            run_anchor = run.get("text-anchor", text_anchor)
            validator.require(
                run_anchor in {"start", "middle", "end"},
                section,
                f"{relative(path)} text run has unsupported text-anchor {run_anchor!r}",
            )
            if run_anchor not in {"start", "middle", "end"}:
                continue
            run_width = approximate_text_width(
                content,
                font_size,
                text_element.get("font-weight", "400"),
                letter_spacing,
            )
            if run_anchor == "middle":
                left = current_x - run_width / 2
                right = current_x + run_width / 2
            elif run_anchor == "end":
                left = current_x - run_width
                right = current_x
            else:
                left = current_x
                right = current_x + run_width
            top = current_y - font_size * 0.93
            bottom = current_y + font_size * 0.25
            validator.require(
                left >= view_x - tolerance
                and top >= view_y - tolerance
                and right <= view_right + tolerance
                and bottom <= view_bottom + tolerance,
                section,
                f"{relative(path)} text {content[:48]!r} has approximate bounds "
                f"[{left:g}, {top:g}, {right - left:g}, {bottom - top:g}] "
                f"outside viewBox {view_box}",
            )
            current_x += run_width


def point_is_on_anchor(
    point: tuple[float, float], bounds: list[float], anchor: str
) -> bool:
    x, y, width, height = bounds
    point_x, point_y = point
    tolerance = 0.11
    within_x = x - tolerance <= point_x <= x + width + tolerance
    within_y = y - tolerance <= point_y <= y + height + tolerance
    if anchor == "top":
        return within_x and abs(point_y - y) <= tolerance
    if anchor == "right":
        return within_y and abs(point_x - (x + width)) <= tolerance
    if anchor == "bottom":
        return within_x and abs(point_y - (y + height)) <= tolerance
    if anchor == "left":
        return within_y and abs(point_x - x) <= tolerance
    return False


def point_anchor_sides(
    point: tuple[float, float], bounds: list[float]
) -> set[str]:
    return {
        anchor
        for anchor in ANCHORS
        if point_is_on_anchor(point, bounds, anchor)
    }


def point_is_outside_anchor(
    point: tuple[float, float], bounds: list[float], anchor: str
) -> bool:
    x, y, width, height = bounds
    point_x, point_y = point
    tolerance = 0.11
    if anchor == "top":
        return point_y < y - tolerance
    if anchor == "right":
        return point_x > x + width + tolerance
    if anchor == "bottom":
        return point_y > y + height + tolerance
    if anchor == "left":
        return point_x < x - tolerance
    return False


def validate_svg(
    validator: Validator,
    path: Path,
    spec: dict[str, Any],
    expected_design: str,
    expected_fingerprint: str | None,
    require_document_chrome: bool,
) -> tuple[float, float] | None:
    section = "images" if require_document_chrome else "previews"
    try:
        source = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as error:
        validator.fail(section, f"cannot read {relative(path)} as UTF-8: {error}")
        return None
    lowered = source.lower()
    validator.require("<!doctype" not in lowered and "<!entity" not in lowered, section, f"{relative(path)} must not contain a DTD or entity declaration")
    try:
        root_element = ElementTree.fromstring(source)
    except ElementTree.ParseError as error:
        validator.fail(section, f"cannot parse {relative(path)} as XML: {error}")
        return None

    validator.require(local_name(root_element.tag) == "svg", section, f"{relative(path)} XML root must be <svg>")
    width_text = root_element.get("width")
    height_text = root_element.get("height")
    valid_width = isinstance(width_text, str) and SVG_DIMENSION.fullmatch(width_text) is not None
    valid_height = isinstance(height_text, str) and SVG_DIMENSION.fullmatch(height_text) is not None
    width = float(width_text) if valid_width else 0.0
    height = float(height_text) if valid_height else 0.0
    validator.require(valid_width and width > 0 and valid_height and height > 0, section, f"{relative(path)} must have positive numeric width and height")
    view_box = parse_svg_numbers(root_element.get("viewBox"), 4)
    validator.require(view_box is not None and view_box[2] > 0 and view_box[3] > 0, section, f"{relative(path)} must have a four-number viewBox with positive dimensions")
    if view_box is None or view_box[2] <= 0 or view_box[3] <= 0:
        view_box = [0.0, 0.0, max(width, 1.0), max(height, 1.0)]
    validator.require(
        abs(view_box[0]) <= 1e-6
        and abs(view_box[1]) <= 1e-6
        and abs(view_box[2] - width) <= 1e-6
        and abs(view_box[3] - height) <= 1e-6,
        section,
        f"{relative(path)} width/height must match a zero-origin viewBox",
    )
    validator.require(root_element.get("role") == "img", section, f"{relative(path)} must declare role=img")
    validator.require(root_element.get("data-diagram-design") == expected_design, section, f"{relative(path)} must use the {expected_design} design")
    fingerprint = root_element.get("data-render-input-sha256", "")
    validator.require(re.fullmatch(r"[a-f0-9]{64}", fingerprint) is not None, section, f"{relative(path)} must contain a lowercase SHA-256 render fingerprint")
    if expected_fingerprint is not None:
        validator.require(fingerprint == expected_fingerprint, section, f"{relative(path)} render fingerprint is stale; expected {expected_fingerprint}")

    direct_titles = [child for child in root_element if local_name(child.tag) == "title"]
    direct_descriptions = [child for child in root_element if local_name(child.tag) == "desc"]
    validator.require(len(direct_titles) == 1 and len(direct_descriptions) == 1, section, f"{relative(path)} must contain exactly one direct title and description")
    if len(direct_titles) == 1 and len(direct_descriptions) == 1:
        title_id = direct_titles[0].get("id")
        description_id = direct_descriptions[0].get("id")
        validator.require(is_non_empty_string(title_id) and is_non_empty_string(description_id), section, f"{relative(path)} title and description need ids")
        validator.require(bool("".join(direct_titles[0].itertext()).strip()) and bool("".join(direct_descriptions[0].itertext()).strip()), section, f"{relative(path)} title and description cannot be empty")
        validator.require(root_element.get("aria-labelledby", "").split() == [title_id, description_id], section, f"{relative(path)} aria-labelledby must reference its title and description")

    document_header_count = sum(element.get("data-document-header") == "true" for element in root_element.iter())
    diagram_legend_count = sum(element.get("data-diagram-legend") == "true" for element in root_element.iter())
    if require_document_chrome:
        validator.require(document_header_count == 1 and diagram_legend_count == 1, section, f"{relative(path)} must contain exactly one document header and legend")
    else:
        validator.require(document_header_count == 0 and diagram_legend_count == 0, section, f"{relative(path)} preview must not contain document chrome")

    forbidden_tags: set[str] = set()
    for element in root_element.iter():
        tag = local_name(element.tag).lower()
        if tag in {"script", "foreignobject"}:
            forbidden_tags.add(tag)
        for attribute_name, value in element.attrib.items():
            attribute = local_name(attribute_name).lower()
            validator.require(
                not attribute.startswith("on")
                and "javascript:" not in value.lower()
                and "vbscript:" not in value.lower(),
                section,
                f"{relative(path)} contains an executable SVG attribute {attribute_name!r}",
            )
            if attribute in {"href", "src"}:
                validate_url_target(validator, section, path, value)
            for match in URL_REFERENCE.finditer(value):
                validate_url_target(validator, section, path, match.group(2))
        if tag == "style":
            style_text = "".join(element.itertext())
            validator.require(
                "@import" not in style_text.lower()
                and "expression(" not in style_text.lower()
                and "javascript:" not in style_text.lower(),
                section,
                f"{relative(path)} SVG styles must not import or execute external resources",
            )
            for match in URL_REFERENCE.finditer(style_text):
                validate_url_target(validator, section, path, match.group(2))
    validator.require(not forbidden_tags, section, f"{relative(path)} contains forbidden SVG tags {sorted(forbidden_tags)}")
    source_without_styles = re.sub(r"<style\b[^>]*>.*?</style>", "", source, flags=re.IGNORECASE | re.DOTALL).lower()
    legacy_renderer_signatures = ("mer" + "maid", "aria-roledescription", "flowchart-", 'class="edgepath', 'class="node default')
    validator.require(
        not any(signature in source_without_styles for signature in legacy_renderer_signatures),
        section,
        f"{relative(path)} contains a legacy renderer signature",
    )
    validate_text_geometry(validator, section, path, root_element, view_box)

    expected_group_ids = {
        group.get("id")
        for group in spec.get("groups", [])
        if isinstance(group, dict) and isinstance(group.get("id"), str)
    }
    group_elements = [element for element in root_element.iter() if element.get("data-group-id") is not None]
    group_ids = [element.get("data-group-id") for element in group_elements]
    validator.require(len(group_ids) == len(set(group_ids)) and set(group_ids) == expected_group_ids, section, f"{relative(path)} rendered group ids must match the specification")
    group_fills = [element for element in root_element.iter() if element.get("data-group-fill") is not None]
    group_fill_ids = [element.get("data-group-fill") for element in group_fills]
    validator.require(len(group_fill_ids) == len(set(group_fill_ids)) and set(group_fill_ids) == expected_group_ids, section, f"{relative(path)} group fill ids must match the specification")
    bounds_by_id: dict[str, list[float]] = {}
    for element in group_fills:
        bounds = parse_svg_numbers(element.get("data-bounds"), 4)
        validate_bounds(validator, section, path, f"group {element.get('data-group-fill')!r}", bounds, view_box)
        group_id = element.get("data-group-fill")
        if isinstance(group_id, str) and bounds is not None:
            bounds_by_id[group_id] = bounds

    expected_node_ids = {
        node.get("id")
        for node in spec.get("nodes", [])
        if isinstance(node, dict) and isinstance(node.get("id"), str)
    }
    node_elements = [element for element in root_element.iter() if element.get("data-node-id") is not None]
    node_ids = [element.get("data-node-id") for element in node_elements]
    validator.require(len(node_ids) == len(set(node_ids)) and set(node_ids) == expected_node_ids, section, f"{relative(path)} rendered node ids must match the specification")
    node_bounds_by_id: dict[str, list[float]] = {}
    for element in node_elements:
        bounds = parse_svg_numbers(element.get("data-bounds"), 4)
        validate_bounds(validator, section, path, f"node {element.get('data-node-id')!r}", bounds, view_box)
        node_id = element.get("data-node-id")
        if isinstance(node_id, str) and bounds is not None:
            bounds_by_id[node_id] = bounds
            if bounds_have_positive_area(bounds):
                node_bounds_by_id[node_id] = bounds

    ordered_node_bounds = sorted(node_bounds_by_id.items())
    for index, (first_id, first_bounds) in enumerate(ordered_node_bounds):
        for second_id, second_bounds in ordered_node_bounds[index + 1:]:
            validator.require(
                not rectangles_overlap_interior(first_bounds, second_bounds),
                section,
                f"{relative(path)} nodes {first_id!r} and {second_id!r} overlap: "
                f"{first_bounds} versus {second_bounds}",
            )

    expected_edges = {
        edge.get("id"): edge
        for edge in spec.get("edges", [])
        if isinstance(edge, dict) and isinstance(edge.get("id"), str)
    }
    edge_elements = [element for element in root_element.iter() if element.get("data-edge-id") is not None]
    rendered_edge_ids = [element.get("data-edge-id") for element in edge_elements]
    validator.require(len(rendered_edge_ids) == len(set(rendered_edge_ids)) and set(rendered_edge_ids) == set(expected_edges), section, f"{relative(path)} rendered edge ids must match the specification")
    edge_points_by_id: dict[str, list[tuple[float, float]]] = {}
    for element in edge_elements:
        edge_id = element.get("data-edge-id")
        edge = expected_edges.get(edge_id)
        if edge is None:
            continue
        validator.require(element.get("data-from") == edge.get("from") and element.get("data-to") == edge.get("to"), section, f"{relative(path)} edge {edge_id!r} endpoints must match the specification")
        validator.require(element.get("data-route") == edge.get("route"), section, f"{relative(path)} edge {edge_id!r} route must match the specification")
        route_points = parse_route_points(element.get("data-route-points"))
        if route_points is None:
            validator.fail(section, f"{relative(path)} edge {edge_id!r} has invalid data-route-points")
            continue
        validate_route_geometry(validator, section, path, edge, route_points)
        path_points = parse_path_points(element.get("d"))
        if path_points is None:
            validator.fail(section, f"{relative(path)} edge {edge_id!r} path must use only one M followed by L commands")
            continue
        edge_points_by_id[str(edge_id)] = path_points
        validate_route_geometry(validator, section, path, edge, path_points)
        source_bounds = bounds_by_id.get(str(edge.get("from")))
        target_bounds = bounds_by_id.get(str(edge.get("to")))
        from_anchor = edge.get("fromAnchor")
        to_anchor = edge.get("toAnchor")
        if source_bounds is not None and isinstance(from_anchor, str):
            validator.require(
                point_is_on_anchor(path_points[0], source_bounds, from_anchor),
                section,
                f"{relative(path)} edge {edge_id!r} must start on its {from_anchor} source anchor",
            )
        if target_bounds is not None and isinstance(to_anchor, str):
            validator.require(
                point_is_on_anchor(path_points[-1], target_bounds, to_anchor),
                section,
                f"{relative(path)} edge {edge_id!r} must end on its {to_anchor} target anchor",
            )
        if source_bounds is not None:
            source_anchor_sides = point_anchor_sides(path_points[0], source_bounds)
            validator.require(
                bool(source_anchor_sides),
                section,
                f"{relative(path)} edge {edge_id!r} must start on its source boundary",
            )
            if source_anchor_sides:
                validator.require(
                    any(
                        point_is_outside_anchor(path_points[1], source_bounds, anchor)
                        for anchor in source_anchor_sides
                    ),
                    section,
                    f"{relative(path)} edge {edge_id!r} first segment must leave the source box",
                )
        if target_bounds is not None:
            target_anchor_sides = point_anchor_sides(path_points[-1], target_bounds)
            validator.require(
                bool(target_anchor_sides),
                section,
                f"{relative(path)} edge {edge_id!r} must end on its target boundary",
            )
            if target_anchor_sides:
                validator.require(
                    any(
                        point_is_outside_anchor(path_points[-2], target_bounds, anchor)
                        for anchor in target_anchor_sides
                    ),
                    section,
                    f"{relative(path)} edge {edge_id!r} final segment must approach the target box from outside",
                )
        validator.require(len(path_points) == len(route_points), section, f"{relative(path)} edge {edge_id!r} path and route-point counts must match")
        if len(path_points) == len(route_points):
            offset_x = path_points[0][0] - route_points[0][0]
            offset_y = path_points[0][1] - route_points[0][1]
            validator.require(
                all(abs(path_point[0] - route_point[0] - offset_x) <= 1e-6 and abs(path_point[1] - route_point[1] - offset_y) <= 1e-6 for path_point, route_point in zip(path_points, route_points)),
                section,
                f"{relative(path)} edge {edge_id!r} path must be a consistent translation of data-route-points",
            )

        excluded_node_ids = {str(edge.get("from")), str(edge.get("to"))}
        for node_id, node_bounds in node_bounds_by_id.items():
            if node_id in excluded_node_ids:
                continue
            if any(
                segment_enters_bounds_interior(start, end, node_bounds)
                for start, end in zip(path_points, path_points[1:])
            ):
                validator.fail(
                    section,
                    f"{relative(path)} edge {edge_id!r} enters unrelated node "
                    f"{node_id!r} bounds {node_bounds}",
                )

    label_elements = [
        element
        for element in root_element.iter()
        if local_name(element.tag) == "text"
        and element.get("data-edge-label") is not None
    ]
    label_edge_ids = [element.get("data-edge-label") for element in label_elements]
    expected_label_groups: dict[tuple[object, object], list[str]] = {}
    for expected_edge_id, expected_edge in expected_edges.items():
        if not is_non_empty_string(expected_edge.get("label")):
            continue
        label_group = (
            expected_edge.get("to"),
            expected_edge.get("label"),
        )
        expected_label_groups.setdefault(label_group, []).append(expected_edge_id)
    use_last_label_representative = (
        isinstance(spec.get("layout"), dict)
        and spec["layout"].get("profile") == "modular"
    )
    expected_label_ids = {
        edge_ids[-1] if use_last_label_representative else edge_ids[len(edge_ids) // 2]
        for edge_ids in expected_label_groups.values()
    }
    validator.require(
        len(label_edge_ids) == len(set(label_edge_ids)),
        section,
        f"{relative(path)} relationship labels must have unique data-edge-label ids",
    )
    validator.require(
        set(label_edge_ids) == expected_label_ids,
        section,
        f"{relative(path)} relationship label ids must match the selected edge of each "
        f"target/text group; expected {sorted(expected_label_ids)}, found "
        f"{sorted(str(edge_id) for edge_id in label_edge_ids)}",
    )
    for label_element in label_elements:
        label_edge_id = label_element.get("data-edge-label")
        label_edge = expected_edges.get(label_edge_id)
        validator.require(
            label_edge is not None and is_non_empty_string(label_edge.get("label")),
            section,
            f"{relative(path)} relationship label {label_edge_id!r} must identify a labeled edge",
        )
        label_bounds = parse_svg_numbers(label_element.get("data-bounds"), 4)
        validate_bounds(
            validator,
            section,
            path,
            f"relationship label {label_edge_id!r}",
            label_bounds,
            view_box,
        )
        if label_edge is None or not bounds_have_positive_area(label_bounds):
            continue
        expected_label = label_edge.get("label")
        rendered_label = " ".join(
            part.strip() for part in label_element.itertext() if part.strip()
        )
        validator.require(
            rendered_label == expected_label,
            section,
            f"{relative(path)} relationship label {label_edge_id!r} text must match its specification",
        )
        for candidate_edge_id, candidate_points in edge_points_by_id.items():
            candidate_edge = expected_edges.get(candidate_edge_id)
            if candidate_edge is None:
                continue
            equivalent_label_group = (
                candidate_edge.get("to") == label_edge.get("to")
                and candidate_edge.get("label") == expected_label
            )
            if candidate_edge_id == label_edge_id or equivalent_label_group:
                continue
            if any(
                segment_enters_bounds_interior(start, end, label_bounds)
                for start, end in zip(candidate_points, candidate_points[1:])
            ):
                validator.fail(
                    section,
                    f"{relative(path)} edge {candidate_edge_id!r} crosses unrelated "
                    f"relationship label {label_edge_id!r} bounds {label_bounds}",
                )
    return (width, height) if width > 0 and height > 0 else None


def validate_png(
    validator: Validator,
    path: Path,
    svg_dimensions: tuple[float, float] | None,
) -> None:
    section = "png"
    try:
        data = path.read_bytes()
    except OSError as error:
        validator.fail(section, f"cannot read {relative(path)}: {error}")
        return
    if len(data) < 33:
        validator.fail(section, f"{relative(path)} is too short to contain a PNG IHDR chunk")
        return
    validator.require(data[:8] == PNG_SIGNATURE, section, f"{relative(path)} has an invalid PNG signature")
    chunk_length = struct.unpack(">I", data[8:12])[0]
    chunk_type = data[12:16]
    validator.require(chunk_length == 13 and chunk_type == b"IHDR", section, f"{relative(path)} must begin with a 13-byte IHDR chunk")
    width, height = struct.unpack(">II", data[16:24])
    validator.require(width > 0 and height > 0, section, f"{relative(path)} IHDR dimensions must be positive")
    expected_crc = zlib.crc32(data[12:29]) & 0xFFFFFFFF
    actual_crc = struct.unpack(">I", data[29:33])[0]
    validator.require(actual_crc == expected_crc, section, f"{relative(path)} has an invalid IHDR CRC")
    if svg_dimensions is not None:
        expected_width = svg_dimensions[0] * 2
        expected_height = svg_dimensions[1] * 2
        validator.require(
            abs(expected_width - round(expected_width)) <= 1e-6
            and abs(expected_height - round(expected_height)) <= 1e-6
            and width == round(expected_width)
            and height == round(expected_height),
            section,
            f"{relative(path)} must be exactly 2x its SVG dimensions; found {width}x{height}, expected {expected_width:g}x{expected_height:g}",
        )


def validate_assets(
    validator: Validator,
    manifest: list[dict[str, Any]],
    specs: dict[str, dict[str, Any]],
) -> None:
    section = "assets"
    for entry in manifest:
        scenario_id = entry.get("id")
        spec = specs.get(scenario_id) if isinstance(scenario_id, str) else None
        if spec is None:
            continue
        fingerprint = expected_render_fingerprint(validator, spec, entry)
        image_path = DIAGRAMS_DIR / str(entry.get("image", "__missing__"))
        preview_path = DIAGRAMS_DIR / str(entry.get("preview", "__missing__"))
        png_path = DIAGRAMS_DIR / str(entry.get("png", "__missing__"))
        preview_png_path = DIAGRAMS_DIR / str(entry.get("previewPng", "__missing__"))
        for path in (image_path, preview_path, png_path, preview_png_path):
            validator.require(path.is_file(), section, f"missing {relative(path)}")
        full_dimensions = validate_svg(validator, image_path, spec, FULL_DESIGN, fingerprint, True) if image_path.is_file() else None
        preview_dimensions = validate_svg(validator, preview_path, spec, PREVIEW_DESIGN, fingerprint, False) if preview_path.is_file() else None
        if image_path.is_file() and preview_path.is_file():
            try:
                full_root = ElementTree.parse(image_path).getroot()
                preview_root = ElementTree.parse(preview_path).getroot()
                validator.require(full_root.get("data-render-input-sha256") == preview_root.get("data-render-input-sha256"), section, f"{relative(image_path)} and {relative(preview_path)} fingerprints must match")
            except (OSError, ElementTree.ParseError):
                pass
        if png_path.is_file():
            validate_png(validator, png_path, full_dimensions)
        if preview_png_path.is_file():
            validate_png(validator, preview_png_path, preview_dimensions)


def validate_catalog(validator: Validator, manifest: list[dict[str, Any]]) -> None:
    section = "catalog"
    path = DIAGRAMS_DIR / "catalog.js"
    try:
        source = path.read_text(encoding="utf-8").strip()
    except (OSError, UnicodeDecodeError) as error:
        validator.fail(section, f"cannot read {relative(path)}: {error}")
        return
    prefix = "window.KMP_DIAGRAM_CATALOG ="
    if not source.startswith(prefix) or not source.endswith(";"):
        validator.fail(section, f"{relative(path)} must be one catalog JSON assignment ending in ';'")
        return
    try:
        catalog = json.loads(source[len(prefix):-1].strip())
    except json.JSONDecodeError as error:
        validator.fail(section, f"embedded catalog is not valid JSON: {error}")
        return
    validator.require(catalog == manifest, section, f"{relative(path)} is not synchronized with diagrams/manifest.json")


def validate_xcode(validator: Validator, manifest: list[dict[str, Any]]) -> None:
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
            validator.require("PBXProject" in project_text and "SampleApp.swift" in project_text, section, f"{relative(project)} does not look like the expected app project")
        for xml_path, expected_root in ((workspace, "Workspace"), (scheme, "Scheme")):
            if not xml_path.is_file():
                continue
            try:
                root_element = ElementTree.parse(xml_path).getroot()
                validator.require(root_element.tag == expected_root, section, f"{relative(xml_path)} root must be <{expected_root}>")
            except (OSError, ElementTree.ParseError) as error:
                validator.fail(section, f"invalid XML in {relative(xml_path)}: {error}")


def markdown_destination(raw: str) -> str:
    destination = raw.strip()
    if destination.startswith("<") and ">" in destination:
        return destination[1:destination.index(">")]
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
        try:
            text = markdown.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            validator.fail(section, f"expected UTF-8 text in {relative(markdown)}")
            continue
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
                validator.fail(section, f"{relative(markdown)} link escapes the repository: {destination}")
                continue
            validator.require(resolved.exists(), section, f"broken relative link in {relative(markdown)}: {destination}")


def validate_pages_links(
    validator: Validator, manifest: list[dict[str, Any]]
) -> None:
    section = "pages-links"
    index_path = ROOT / "index.html"
    try:
        source = index_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as error:
        validator.fail(section, f"cannot read {relative(index_path)}: {error}")
        return

    collector = HtmlAssetCollector()
    try:
        collector.feed(source)
        collector.close()
    except Exception as error:  # HTMLParser can surface malformed entity/input errors.
        validator.fail(section, f"cannot parse {relative(index_path)}: {error}")
        return

    for destination in collector.destinations:
        if destination.startswith("#"):
            continue
        parsed = urlsplit(destination)
        if parsed.scheme or parsed.netloc:
            continue
        link_path = unquote(parsed.path)
        if not link_path:
            continue
        candidate = (index_path.parent / link_path).resolve()
        try:
            candidate.relative_to(ROOT)
        except ValueError:
            validator.fail(section, f"{relative(index_path)} link escapes the repository: {destination}")
            continue
        validator.require(candidate.exists(), section, f"broken relative Pages link in {relative(index_path)}: {destination}")

    required_gallery_references = (
        'src="diagrams/catalog.js"',
        'fetch("diagrams/manifest.json"',
        "entry.image",
        "entry.png",
        "entry.file",
        "entry.sample",
    )
    for reference in required_gallery_references:
        validator.require(
            reference in source,
            section,
            f"{relative(index_path)} is missing required gallery reference {reference!r}",
        )

    for entry in manifest:
        scenario_id = entry.get("id", "unknown")
        for field in ("file", "spec", "image", "preview", "png", "previewPng"):
            destination = entry.get(field)
            if not isinstance(destination, str):
                continue
            page_target = (DIAGRAMS_DIR / destination).resolve()
            try:
                page_target.relative_to(DIAGRAMS_DIR)
            except ValueError:
                validator.fail(section, f"scenario {scenario_id} {field} escapes diagrams/: {destination}")
                continue
            validator.require(
                page_target.is_file(),
                section,
                f"broken Pages target for scenario {scenario_id} {field}: diagrams/{destination}",
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
                validator.fail(section, f"{relative(path)}:{line_number} contains {match.group(0)}")


def main() -> int:
    validator = Validator()
    manifest = load_manifest(validator)
    specs = validate_inventory(validator, manifest)
    validate_assets(validator, manifest, specs)
    validate_catalog(validator, manifest)
    validate_xcode(validator, manifest)
    validate_markdown_links(validator)
    validate_pages_links(validator, manifest)
    validate_placeholders(validator)

    if validator.errors:
        print(f"Repository validation failed with {len(validator.errors)} error(s):", file=sys.stderr)
        for error in validator.errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "Repository validation passed: "
        f"{len(manifest)} synchronized specifications, SVG/PNG asset pairs, documentation files, samples, and shared iOS schemes."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
