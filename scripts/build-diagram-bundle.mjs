import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramsDir = path.join(repoRoot, "diagrams");
const manifestPath = path.join(diagramsDir, "manifest.json");
const bundlePath = path.join(diagramsDir, "bundle.js");
const checkOnly = process.argv.includes("--check");

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const diagrams = Object.fromEntries(
  manifest.map((entry) => [
    entry.file,
    fs.readFileSync(path.join(diagramsDir, entry.file), "utf8"),
  ]),
);
const output = `window.KMP_DIAGRAM_BUNDLE = ${JSON.stringify({ manifest, diagrams }, null, 2)};\n`;

if (checkOnly) {
  const current = fs.existsSync(bundlePath) ? fs.readFileSync(bundlePath, "utf8") : "";
  if (current !== output) {
    console.error("diagrams/bundle.js is stale. Run `npm run bundle`.");
    process.exit(1);
  }
  console.log(`Verified diagrams/bundle.js for ${manifest.length} diagrams.`);
} else {
  fs.writeFileSync(bundlePath, output);
  console.log(`Bundled ${manifest.length} Mermaid sources into diagrams/bundle.js.`);
}
