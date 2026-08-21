import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const rendererPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(rendererPath), "..");
const diagramsDir = path.join(repoRoot, "diagrams");
const imagesDir = path.join(diagramsDir, "images");
const manifest = JSON.parse(fs.readFileSync(path.join(diagramsDir, "manifest.json"), "utf8"));
const configPath = path.join(diagramsDir, "mermaid-config.json");
const cssPath = path.join(diagramsDir, "mermaid-theme.css");
const configSource = fs.readFileSync(configPath, "utf8");
const cssSource = fs.readFileSync(cssPath, "utf8");
const packageMetadata = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const packageLockSource = fs.readFileSync(path.join(repoRoot, "package-lock.json"), "utf8");
const packageLockSha256 = createHash("sha256").update(packageLockSource).digest("hex");
const rendererSourceSha256 = createHash("sha256")
  .update(fs.readFileSync(rendererPath, "utf8"))
  .digest("hex");
const mermaidCliVersion = packageMetadata.devDependencies?.["@mermaid-js/mermaid-cli"];
const renderSettings = { backgroundColor: "#f8fafc", width: 1800 };
const renderFingerprintSchema = 2;
const mmdcPath = path.join(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "mmdc.cmd" : "mmdc");
const checkOnly = process.argv.includes("--check");

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${name} requires a path.`);
  }
  return value;
}

const puppeteerConfigArgument = argumentValue("--puppeteer-config");
const puppeteerConfigPath = puppeteerConfigArgument
  ? path.resolve(repoRoot, puppeteerConfigArgument)
  : null;

if (!fs.existsSync(mmdcPath)) {
  console.error("Mermaid CLI is not installed. Run `npm ci` first.");
  process.exit(1);
}

if (puppeteerConfigPath && !fs.existsSync(puppeteerConfigPath)) {
  console.error(`Puppeteer configuration not found: ${puppeteerConfigPath}`);
  process.exit(1);
}

function extractMermaid(markdown, file) {
  const blocks = [...markdown.matchAll(/```mermaid\s*\n([\s\S]*?)```/g)];
  if (blocks.length !== 1) {
    throw new Error(`${file} must contain exactly one Mermaid block; found ${blocks.length}.`);
  }
  return `${blocks[0][1].trim()}\n`;
}

function renderInputHash(source) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        source,
        configSource,
        cssSource,
        mermaidCliVersion,
        packageLockSha256,
        rendererSourceSha256,
        renderSettings,
        renderFingerprintSchema,
      }),
    )
    .digest("hex");
}

function attachRenderInputHash(svg, hash) {
  if (!svg.includes("<svg")) {
    throw new Error("Mermaid output does not contain an <svg> root.");
  }
  return svg.replace("<svg", `<svg data-render-input-sha256="${hash}"`);
}

function maskEdgesBehindLabels(svg) {
  const viewBox = svg.match(
    /<svg\b[^>]*\bviewBox="([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)"/,
  );
  if (!viewBox) {
    throw new Error("Rendered SVG does not contain a numeric viewBox.");
  }
  const padding = 4;
  const gapRects = [];
  const labelPattern =
    /<g class="edgeLabel" transform="translate\(([-+\deE.]+),\s*([-+\deE.]+)\)">\s*<g class="label" data-id="[^"]+" transform="translate\(([-+\deE.]+),\s*([-+\deE.]+)\)">\s*<foreignObject width="([-+\deE.]+)" height="([-+\deE.]+)">/g;
  for (const match of svg.matchAll(labelPattern)) {
    const x = Number(match[1]) + Number(match[3]) - padding;
    const y = Number(match[2]) + Number(match[4]) - padding;
    const width = Number(match[5]) + padding * 2;
    const height = Number(match[6]) + padding * 2;
    gapRects.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2" fill="black"/>`);
  }

  const labelCount = [...svg.matchAll(/<g class="edgeLabel" transform=/g)].length;
  if (gapRects.length !== labelCount) {
    throw new Error(`Masked ${gapRects.length} of ${labelCount} rendered edge labels.`);
  }
  if (gapRects.length === 0) {
    return svg;
  }

  const maskId = "edge-label-gaps";
  const mask = `<defs><mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="${viewBox[1]}" y="${viewBox[2]}" width="${viewBox[3]}" height="${viewBox[4]}"><rect x="${viewBox[1]}" y="${viewBox[2]}" width="${viewBox[3]}" height="${viewBox[4]}" fill="white"/>${gapRects.join("")}</mask></defs>`;
  let maskedGroupCount = 0;
  const masked = svg
    .replace(/(<svg\b[^>]*>)/, `$1${mask}`)
    .replace(/<g class="(?:edgePaths|edges edgePath)">/g, (group) => {
      maskedGroupCount += 1;
      return group.replace(">", ` mask="url(#${maskId})">`);
    });
  if (maskedGroupCount === 0) {
    throw new Error("Rendered SVG does not contain an edge-path group.");
  }
  return masked;
}

function committedRenderInputHash(svg) {
  return svg.match(/\bdata-render-input-sha256="([a-f0-9]{64})"/)?.[1] ?? null;
}

fs.mkdirSync(imagesDir, { recursive: true });
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kmp-mermaid-"));
const stale = [];

try {
  for (const entry of manifest) {
    const markdown = fs.readFileSync(path.join(diagramsDir, entry.file), "utf8");
    const source = extractMermaid(markdown, entry.file);
    const stem = path.basename(entry.file, ".md");
    const inputPath = path.join(tempDir, `${stem}.mmd`);
    const renderedPath = path.join(tempDir, `${stem}.svg`);
    const committedPath = path.join(imagesDir, `${stem}.svg`);
    fs.writeFileSync(inputPath, source);

    const mmdcArguments = [
      "--input",
      inputPath,
      "--output",
      renderedPath,
      "--configFile",
      configPath,
      "--cssFile",
      cssPath,
      "--backgroundColor",
      renderSettings.backgroundColor,
      "--width",
      String(renderSettings.width),
    ];
    if (puppeteerConfigPath) {
      mmdcArguments.push("--puppeteerConfigFile", puppeteerConfigPath);
    }

    const result = spawnSync(mmdcPath, mmdcArguments, { cwd: repoRoot, encoding: "utf8" });
    if (result.status !== 0) {
      process.stderr.write(result.stdout || "");
      process.stderr.write(result.stderr || "");
      throw new Error(`Mermaid rendering failed for ${entry.file}.`);
    }

    const expectedHash = renderInputHash(source);
    const maskedSvg = maskEdgesBehindLabels(fs.readFileSync(renderedPath, "utf8"));
    const rendered = attachRenderInputHash(maskedSvg, expectedHash);
    if (checkOnly) {
      const current = fs.existsSync(committedPath) ? fs.readFileSync(committedPath, "utf8") : "";
      if (committedRenderInputHash(current) !== expectedHash) {
        stale.push(path.relative(repoRoot, committedPath));
      }
    } else {
      fs.writeFileSync(committedPath, rendered);
    }
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

if (stale.length > 0) {
  console.error(`Generated diagram images are stale:\n${stale.map((file) => `- ${file}`).join("\n")}`);
  console.error("Run `npm run render`.");
  process.exit(1);
}

console.log(`${checkOnly ? "Verified" : "Rendered"} ${manifest.length} Mermaid SVG images.`);
