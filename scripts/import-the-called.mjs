import {
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(process.argv[2] ?? join(root, "..", "The-Called"));
const input = join(source, "dist");
const target = join(root, "public", "play", "the-called");
for (const name of [
  "index.html",
  "kernel/_framework/dotnet.js",
  "kernel/_framework/dotnet.native.wasm",
  "kernel/_framework/Pcd.Kernel.wasm",
]) {
  if (!(await stat(join(input, name))).isFile())
    throw new Error(`Incomplete browser build: ${name}`);
}
const html = await readFile(join(input, "index.html"), "utf8");
if (!html.includes('src="./assets/'))
  throw new Error("The game build must use relative asset URLs.");
if (relative(root, target).split(sep).join("/") !== "public/play/the-called")
  throw new Error("Invalid import destination.");
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(input, target, { recursive: true });
async function inventory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await inventory(path)));
    else if (entry.isFile()) {
      const bytes = await readFile(path);
      files.push({
        path: relative(target, path).split(sep).join("/"),
        bytes: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
    } else throw new Error(`Unsupported build entry: ${entry.name}`);
  }
  return files;
}
const files = await inventory(target);
const receipt = {
  repository: "https://github.com/tja688/The-Called",
  commit: execFileSync("git", ["-C", source, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  importedAt: new Date().toISOString(),
  playablePath: "/play/the-called/",
  bytes: files.reduce((sum, file) => sum + file.bytes, 0),
  files,
};
await mkdir(join(root, "docs"), { recursive: true });
await writeFile(
  join(root, "docs", "the-called-build.json"),
  JSON.stringify(receipt, null, 2) + "\n",
);
console.log(
  `Imported ${files.length} files, ${(receipt.bytes / 1024 / 1024).toFixed(2)} MiB. Source commit ${receipt.commit}.`,
);
