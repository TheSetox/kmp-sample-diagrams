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
  "diagrams/catalog.js",
  "diagrams/manifest.json",
]);

for (const [index, entry] of manifest.entries()) {
  if (!entry || typeof entry !== "object") {
    throw new Error(`Manifest entry ${index + 1} must be an object.`);
  }
  for (const field of ["file", "spec", "image", "preview", "png", "previewPng"]) {
    const asset = safeRelativePath(entry[field], `entry ${index + 1} ${field}`);
    siteFiles.add(`diagrams/${asset}`);
  }
}

const fontsDir = path.join(diagramsDir, "fonts");
if (!fs.existsSync(fontsDir)) {
  throw new Error("Pages input is missing diagrams/fonts.");
} else {
  const fontsStat = fs.lstatSync(fontsDir);
  if (!fontsStat.isDirectory() || fontsStat.isSymbolicLink()) {
    throw new Error("diagrams/fonts must be a regular directory.");
  }
  const pending = [fontsDir];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const name of fs.readdirSync(directory)) {
      const fontPath = path.join(directory, name);
      const fontStat = fs.lstatSync(fontPath);
      if (fontStat.isSymbolicLink()) {
        throw new Error(`Pages input cannot be a symbolic link: ${path.relative(repoRoot, fontPath)}`);
      }
      if (fontStat.isDirectory()) {
        pending.push(fontPath);
      } else if (fontStat.isFile()) {
        siteFiles.add(path.relative(repoRoot, fontPath).split(path.sep).join("/"));
      } else {
        throw new Error(`Pages font input must be a regular file: ${path.relative(repoRoot, fontPath)}`);
      }
    }
  }
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
