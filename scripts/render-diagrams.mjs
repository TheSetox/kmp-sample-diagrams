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
const previewsDir = path.join(diagramsDir, "previews");
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
const renderSettings = { backgroundColor: "#ffffff", width: 1800 };
const renderFingerprintSchema = 4;
const diagramDesign = "engineering-doc-v1";
const previewDesign = "readme-preview-v1";
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

function renderInputHash(source, metadata) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        source,
        metadata,
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

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function plainText(value) {
  return String(value)
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapText(value, maximumCharacters, maximumLines = 2) {
  const original = plainText(value);
  const words = original.split(" ").filter(Boolean);
  const lines = [];
  let current = "";
  let wordIndex = 0;
  while (wordIndex < words.length && lines.length < maximumLines) {
    const word = words[wordIndex];
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maximumCharacters || !current) {
      current = candidate;
      wordIndex += 1;
      continue;
    }
    lines.push(current);
    current = "";
  }
  if (current && lines.length < maximumLines) lines.push(current);
  if (wordIndex < words.length && lines.length > 0) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex].replace(/[.…]+$/, "")}…`;
  }
  return lines;
}

function documentMetadata(markdown, entry, source) {
  const heading = markdown.match(/^#\s+(.+)$/m);
  const beforeMermaid = markdown
    .slice(heading ? heading.index + heading[0].length : 0)
    .split("```mermaid", 1)[0];
  const subtitle = beforeMermaid
    .split(/\n\s*\n/)
    .map((paragraph) => plainText(paragraph))
    .find(Boolean);
  const scenario = entry.file.match(/^(\d{2})-/)?.[1] ?? "";
  const legend = ["application", "platform"];
  if (/\bclass\s+[^;\n]*\bkmp\b|KMP library module/.test(source)) legend.push("shared");
  if (/app-owned code/.test(markdown)) legend.push("conceptual");
  legend.push("flow");
  return {
    scenario,
    title: plainText(entry.title || heading?.[1] || entry.file),
    subtitle: subtitle || "Kotlin Multiplatform architecture and dependency flow.",
    category: plainText(entry.category),
    sample: String(entry.sample).trim(),
    legend,
  };
}

function numericAttribute(attributes, name) {
  const match = attributes.match(new RegExp(`\\b${name}="([-+\\deE.]+)"`));
  return match ? Number(match[1]) : null;
}

function alignClusterLabels(svg) {
  let alignedCount = 0;
  const clusterPattern = /(<g class="cluster"[^>]*><rect)([^>]*)(\/><g class="cluster-label" transform="translate\()([-+\deE.]+),\s*([-+\deE.]+)(\)"><foreignObject width=")([-+\deE.]+)(" height="[-+\deE.]+">)/g;
  const aligned = svg.replace(
    clusterPattern,
    (match, prefix, rectangleAttributes, labelPrefix, _labelX, labelY, widthPrefix, _labelWidth, suffix) => {
      const rectangleX = numericAttribute(rectangleAttributes, "x");
      const rectangleWidth = numericAttribute(rectangleAttributes, "width");
      if (rectangleX === null || rectangleWidth === null) return match;
      alignedCount += 1;
      const inset = 14;
      const labelWidth = Math.max(1, rectangleWidth - inset * 2);
      return `${prefix}${rectangleAttributes}${labelPrefix}${rectangleX + inset}, ${labelY}${widthPrefix}${labelWidth}${suffix}`;
    },
  );
  const clusterCount = [...svg.matchAll(/<g class="cluster"/g)].length;
  if (alignedCount !== clusterCount) {
    throw new Error(`Aligned ${alignedCount} of ${clusterCount} rendered cluster labels.`);
  }
  return aligned;
}

function legendMarkup(items, x, y) {
  const definitions = {
    application: { label: "Application target", kind: "box", fill: "#fff8eb", stroke: "#c47a12" },
    platform: { label: "Platform code", kind: "box", fill: "#f3f9fc", stroke: "#2b6f9e" },
    shared: { label: "Shared KMP", kind: "box", fill: "#f8f5fe", stroke: "#6e4bae" },
    conceptual: { label: "App-owned layer", kind: "dashed", fill: "#f8fbfd", stroke: "#8aa7bc" },
    flow: { label: "Call / dependency", kind: "flow", fill: "none", stroke: "#17324a" },
  };
  const columns = 3;
  const columnWidth = 190;
  const rowHeight = 28;
  const rows = Math.ceil(items.length / columns);
  const boxWidth = 604;
  const boxHeight = rows === 1 ? 52 : 80;
  const markup = items
    .map((token, index) => {
      const item = definitions[token];
      if (!item) throw new Error(`Unknown diagram legend token: ${token}`);
      const itemX = x + 18 + (index % columns) * columnWidth;
      const itemY = y + 30 + Math.floor(index / columns) * rowHeight;
      let sample;
      if (item.kind === "flow") {
        sample = `<path d="M${itemX} ${itemY - 4}H${itemX + 19}" fill="none" stroke="${item.stroke}" stroke-width="1.5"/><path d="M${itemX + 24} ${itemY - 4}l-6 -4v8z" fill="${item.stroke}"/>`;
      } else {
        const dash = item.kind === "dashed" ? ' stroke-dasharray="4 3"' : "";
        sample = `<rect x="${itemX}" y="${itemY - 12}" width="24" height="14" rx="3" fill="${item.fill}" stroke="${item.stroke}" stroke-width="1.3"${dash}/>`;
      }
      return `${sample}<text x="${itemX + 33}" y="${itemY}" fill="#526577" font-size="11.5" font-weight="600">${escapeXml(item.label)}</text>`;
    })
    .join("");
  return `<g data-diagram-legend="true" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif"><rect x="${x}" y="${y}" width="${boxWidth}" height="${boxHeight}" rx="8" fill="#fbfcfd" stroke="#d5dde4" stroke-width="1"/><text x="${x + 18}" y="${y + 17}" fill="#7a8996" font-size="9.5" font-weight="700" letter-spacing="1.2">LEGEND</text>${markup}</g>`;
}

function frameDiagramSvg(svg, metadata) {
  const opening = svg.match(/<svg\b[^>]*>/)?.[0];
  if (!opening) throw new Error("Rendered SVG does not contain an <svg> root.");
  const viewBox = opening.match(/\bviewBox="([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)"/);
  if (!viewBox) throw new Error("Rendered SVG does not contain a numeric viewBox.");

  const graphWidth = Number(viewBox[3]);
  const graphHeight = Number(viewBox[4]);
  const sideMargin = 48;
  const headerHeight = 170;
  const bottomMargin = 40;
  const canvasWidth = Math.ceil(Math.max(1600, graphWidth + sideMargin * 2));
  const canvasHeight = Math.ceil(headerHeight + graphHeight + bottomMargin);
  const graphX = (canvasWidth - graphWidth) / 2;
  const titleId = `diagram-${metadata.scenario}-title`;
  const descriptionId = `diagram-${metadata.scenario}-description`;
  const subtitleLines = wrapText(metadata.subtitle, 78, 2);
  const subtitle = subtitleLines
    .map((line, index) => `<tspan x="${sideMargin}" dy="${index === 0 ? 0 : 20}">${escapeXml(line)}</tspan>`)
    .join("");
  const legendX = canvasWidth - sideMargin - 604;
  const legend = legendMarkup(metadata.legend, legendX, 24);
  const eyebrow = `KMP ARCHITECTURE · ${metadata.category.toUpperCase()} · DEPENDENCY FLOW`;
  const accessibleDescription = `${metadata.title}. ${metadata.subtitle} Solid arrows show calls or dependencies.`;

  let innerOpening = opening
    .replace(/\sdata-render-input-sha256="[^"]*"/, "")
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/\sx="[^"]*"/, "")
    .replace(/\sy="[^"]*"/, "")
    .replace(/\spreserveAspectRatio="[^"]*"/, "");
  innerOpening = innerOpening.replace(
    "<svg",
    `<svg x="${graphX}" y="${headerHeight}" width="${graphWidth}" height="${graphHeight}" preserveAspectRatio="xMidYMin meet"`,
  );
  const innerSvg = svg.replace(opening, innerOpening);
  const header = `<g data-document-header="true" font-family="Arial, 'Helvetica Neue', Helvetica, sans-serif"><text x="${sideMargin}" y="30" fill="#64748b" font-size="10.5" font-weight="700" letter-spacing="1.35">${escapeXml(eyebrow)}</text><text x="${sideMargin}" y="69" fill="#26394a" font-size="30" font-weight="700">${escapeXml(`${metadata.scenario} · ${metadata.title}`)}</text><text x="${sideMargin}" y="98" fill="#526577" font-size="15" font-weight="400">${subtitle}</text><text x="${sideMargin}" y="140" fill="#738290" font-size="10.5" font-weight="700" letter-spacing="0.7">${escapeXml(metadata.sample.toUpperCase())}</text>${legend}<line x1="${sideMargin}" y1="151" x2="${canvasWidth - sideMargin}" y2="151" stroke="#d7dee5" stroke-width="1"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" role="img" aria-labelledby="${titleId} ${descriptionId}" data-diagram-design="${diagramDesign}" style="background:#ffffff"><title id="${titleId}">${escapeXml(`${metadata.scenario} · ${metadata.title}`)}</title><desc id="${descriptionId}">${escapeXml(accessibleDescription)}</desc><rect width="${canvasWidth}" height="${canvasHeight}" fill="#ffffff"/>${header}${innerSvg}</svg>`;
}

function readmePreviewSvg(svg, metadata) {
  const opening = svg.match(/<svg\b[^>]*>/)?.[0];
  if (!opening) throw new Error("Rendered SVG does not contain an <svg> root.");
  const viewBox = opening.match(/\bviewBox="([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)\s+([-+\deE.]+)"/);
  if (!viewBox) throw new Error("Rendered SVG does not contain a numeric viewBox.");

  const graphWidth = Math.ceil(Number(viewBox[3]));
  const graphHeight = Math.ceil(Number(viewBox[4]));
  const titleId = `diagram-${metadata.scenario}-preview-title`;
  const descriptionId = `diagram-${metadata.scenario}-preview-description`;
  const accessibleDescription = `${metadata.title}. Cropped architecture preview without the document header. Solid arrows show calls or dependencies.`;
  let previewOpening = opening
    .replace(/\sdata-render-input-sha256="[^"]*"/, "")
    .replace(/\sdata-diagram-design="[^"]*"/, "")
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/\sx="[^"]*"/, "")
    .replace(/\sy="[^"]*"/, "")
    .replace(/\spreserveAspectRatio="[^"]*"/, "")
    .replace(/\srole="[^"]*"/, "")
    .replace(/\saria-labelledby="[^"]*"/, "");
  previewOpening = previewOpening.replace(
    "<svg",
    `<svg width="${graphWidth}" height="${graphHeight}" preserveAspectRatio="xMinYMin meet" role="img" aria-labelledby="${titleId} ${descriptionId}" data-diagram-design="${previewDesign}"`,
  );
  const accessibility = `<title id="${titleId}">${escapeXml(`${metadata.scenario} · ${metadata.title}`)}</title><desc id="${descriptionId}">${escapeXml(accessibleDescription)}</desc>`;
  return svg.replace(opening, `${previewOpening}${accessibility}`);
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
  const padding = 6;
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
fs.mkdirSync(previewsDir, { recursive: true });
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
    const committedPreviewPath = path.join(previewsDir, `${stem}.svg`);
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

    const metadata = documentMetadata(markdown, entry, source);
    const expectedHash = renderInputHash(source, metadata);
    const maskedSvg = maskEdgesBehindLabels(fs.readFileSync(renderedPath, "utf8"));
    const alignedSvg = alignClusterLabels(maskedSvg);
    const framedSvg = frameDiagramSvg(alignedSvg, metadata);
    const rendered = attachRenderInputHash(framedSvg, expectedHash);
    const preview = attachRenderInputHash(readmePreviewSvg(alignedSvg, metadata), expectedHash);
    if (checkOnly) {
      const current = fs.existsSync(committedPath) ? fs.readFileSync(committedPath, "utf8") : "";
      if (committedRenderInputHash(current) !== expectedHash) {
        stale.push(path.relative(repoRoot, committedPath));
      }
      const currentPreview = fs.existsSync(committedPreviewPath)
        ? fs.readFileSync(committedPreviewPath, "utf8")
        : "";
      if (committedRenderInputHash(currentPreview) !== expectedHash) {
        stale.push(path.relative(repoRoot, committedPreviewPath));
      }
    } else {
      fs.writeFileSync(committedPath, rendered);
      fs.writeFileSync(committedPreviewPath, preview);
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

console.log(
  `${checkOnly ? "Verified" : "Rendered"} ${manifest.length} full Mermaid SVGs and ${manifest.length} README previews.`,
);
