import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramsDir = path.join(repoRoot, "diagrams");
const manifestPath = path.join(diagramsDir, "manifest.json");
const catalogPath = path.join(diagramsDir, "catalog.js");
const checkOnly = process.argv.includes("--check");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (!Array.isArray(manifest)) {
  throw new Error("diagrams/manifest.json must contain an array.");
}
const serializedManifest = JSON.stringify(manifest, null, 2)
  .replaceAll("<", "\\u003c")
  .replaceAll("\u2028", "\\u2028")
  .replaceAll("\u2029", "\\u2029");
const output = `window.KMP_DIAGRAM_CATALOG = ${serializedManifest};\n`;

if (checkOnly) {
  const current = fs.existsSync(catalogPath) ? fs.readFileSync(catalogPath, "utf8") : "";
  if (current !== output) {
    console.error("diagrams/catalog.js is stale. Run `npm run catalog`.");
    process.exit(1);
  }
  console.log(`Verified diagrams/catalog.js for ${manifest.length} diagrams.`);
} else {
  fs.writeFileSync(catalogPath, output);
  console.log(`Wrote diagrams/catalog.js for ${manifest.length} diagrams.`);
}
