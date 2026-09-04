import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramsDir = path.join(repoRoot, "diagrams");
const outputDir = path.join(repoRoot, "_site");
const manifest = JSON.parse(fs.readFileSync(path.join(diagramsDir, "manifest.json"), "utf8"));

function safeRelativePath(value, field) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Manifest field ${field} must be a non-empty string.`);
  }
  const normalized = path.posix.normalize(value);
  if (normalized !== value || path.posix.isAbsolute(value) || value.startsWith("../")) {
    throw new Error(`Manifest field ${field} is not a safe relative path: ${value}`);
  }
  return value;
}

const siteFiles = new Set([
  "index.html",
  "diagrams/bundle.js",
  "diagrams/manifest.json",
]);

for (const [index, entry] of manifest.entries()) {
  if (!entry || typeof entry !== "object") {
    throw new Error(`Manifest entry ${index + 1} must be an object.`);
  }
  const source = safeRelativePath(entry.file, `entry ${index + 1} file`);
  const image = safeRelativePath(entry.image, `entry ${index + 1} image`);
  siteFiles.add(`diagrams/${source}`);
  siteFiles.add(`diagrams/${image}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });

let totalBytes = 0;
for (const relativePath of [...siteFiles].sort()) {
  const sourcePath = path.join(repoRoot, relativePath);
  const sourceStat = fs.lstatSync(sourcePath);
  if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) {
    throw new Error(`Pages input must be a regular file: ${relativePath}`);
  }
  const destinationPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
  totalBytes += sourceStat.size;
}

console.log(
  `Built _site with ${siteFiles.size} files (${(totalBytes / 1024).toFixed(1)} KiB).`,
);
