import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const rootDir = process.cwd();
const publicGifDir = path.join(rootDir, "public", "gifs");
const generatedDir = path.join(rootDir, "src", "generated");
const codexGifDir = path.join(os.homedir(), "Documents", "Codex", "gifs");

const gifExtension = /\.gif$/i;

function normalizeName(name) {
  return name.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function publicPathFor(fileName) {
  return `/gifs/${encodeURIComponent(fileName)}`;
}

async function listGifFiles(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && gifExtension.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function syncExternalGifs() {
  await mkdir(publicGifDir, { recursive: true });
  const externalGifs = await listGifFiles(codexGifDir);

  for (const fileName of externalGifs) {
    const target = path.join(publicGifDir, fileName);
    if (!existsSync(target)) {
      await copyFile(path.join(codexGifDir, fileName), target);
    }
  }
}

function findGif(files, preferredNames, keywordSets, fallbackIndex = 0) {
  const normalized = files.map((fileName) => ({
    fileName,
    normalized: normalizeName(fileName),
  }));

  for (const preferred of preferredNames) {
    const hit = normalized.find(
      (entry) => entry.normalized === normalizeName(preferred),
    );
    if (hit) return hit.fileName;
  }

  for (const keywords of keywordSets) {
    const hit = normalized.find((entry) =>
      keywords.every((keyword) => entry.normalized.includes(keyword)),
    );
    if (hit) return hit.fileName;
  }

  return files[fallbackIndex % Math.max(files.length, 1)] ?? null;
}

function makeEntry(fileName) {
  if (!fileName) return null;
  return {
    fileName,
    src: publicPathFor(fileName),
  };
}

async function writeManifest() {
  await syncExternalGifs();
  const files = await listGifFiles(publicGifDir);

  const picks = {
    opening: findGif(
      files,
      [
        "sanji-one.gif",
        "sanji-happy.gif",
        "sanji-one.gif",
        "sanji-nami.gif",
      ],
      [["happy"], ["love"], ["nami"], ["one", "piece"], ["sanji"]],
      0,
    ),
    intro: findGif(
      files,
      ["sanji-one-piece.gif", "sanji-cooking.gif", "one-piece-sanji.gif"],
      [["cooking"], ["one", "piece", "sanji"], ["sanji"]],
      1,
    ),
    romantic: findGif(
      files,
      ["sanji-rose.gif", "sanji-nami.gif", "one-piece-sanji.gif"],
      [["rose"], ["nami"], ["romantic"], ["sanji"]],
      2,
    ),
    calm: findGif(
      files,
      ["sanji-calm.gif", "sanji-Standing.gif"],
      [["calm"], ["standing"], ["soft"], ["sanji"]],
      3,
    ),
    panic: findGif(
      files,
      [
        "one-piece-sanji spinning.gif",
        "sanji-panic.gif",
        "banging-on-ground-upset.gif",
      ],
      [["panic"], ["banging"], ["upset"], ["ground"], ["spinning"], ["spin"]],
      4,
    ),
    spin: findGif(
      files,
      ["sanji-spin.gif", "one-piece-sanji spinning.gif"],
      [["spinning"], ["spin"], ["upset"]],
      5,
    ),
    bow: findGif(
      files,
      ["sanji-bow.gif", "one-piece-sanji.gif", "sanji-one-piece.gif"],
      [["bow"], ["one", "piece", "sanji"], ["sanji"], ["dog"]],
      6,
    ),
    gift: findGif(
      files,
      ["one-piece-sanji dog.gif", "one piece GIF.gif", "one-piece-sanji.gif"],
      [["dog"], ["gif"], ["one", "piece", "sanji"]],
      6,
    ),
    heart: findGif(
      files,
      ["one piece GIF.gif", "sanji-heart.gif", "sanji-nami.gif", "sanji-one.gif"],
      [["heart"], ["nami"], ["love"], ["one"]],
      7,
    ),
  };

  const manifest = Object.fromEntries(
    Object.entries(picks).map(([key, fileName]) => [key, makeEntry(fileName)]),
  );

  await mkdir(generatedDir, { recursive: true });
  await writeFile(
    path.join(generatedDir, "gifManifest.js"),
    `export const availableGifs = ${JSON.stringify(files, null, 2)};\n\nexport const gifLibrary = ${JSON.stringify(manifest, null, 2)};\n`,
  );

  console.log(`GIF manifest ready with ${files.length} GIF(s).`);
}

await writeManifest();
