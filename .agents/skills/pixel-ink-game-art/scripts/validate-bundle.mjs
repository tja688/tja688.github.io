import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
let textFile, fontName;
for (let i = 0; i < args.length; i++) {
  const flag = args[i];
  const value = args[++i];
  if (!["--text", "--font"].includes(flag) || !value || value.startsWith("--"))
    throw new Error(
      "Usage: validate-bundle.mjs [--text <UTF-8 file> [--font <bundled TTF filename>]]",
    );
  if (flag === "--text") textFile = value;
  else fontName = value;
}
if (fontName && !textFile) throw new Error("--font requires --text");
const errors = [];
const report = {
  status: "passed",
  files: 0,
  fonts: [],
  referenceLinks: 0,
  syntaxChecked: [],
};
const check = (condition, message) => {
  if (!condition) errors.push(message);
};
const readJSON = (path) =>
  JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}
const allFiles = files(root);
report.files = allFiles.length;
for (const path of allFiles) {
  if (path.endsWith(".md")) {
    const text = readFileSync(path, "utf8");
    check(
      !text.includes("[TODO:"),
      `Unfinished skill scaffold: ${relative(root, path)}`,
    );
    for (const match of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const href = match[1];
      if (/^(?:https?:|mailto:|#)/.test(href)) continue;
      const target = resolve(
        dirname(path),
        decodeURIComponent(href.split("#")[0]),
      );
      check(
        existsSync(target),
        `Broken reference in ${relative(root, path)}: ${href}`,
      );
      report.referenceLinks++;
    }
  }
  if (path.endsWith(".mjs")) {
    try {
      execFileSync(process.execPath, ["--check", path], { stdio: "pipe" });
      report.syntaxChecked.push(relative(root, path));
    } catch (error) {
      errors.push(
        `Syntax failed: ${relative(root, path)}: ${error.stderr?.toString()}`,
      );
    }
  }
}

function glyphCheck(font, codePoint) {
  const tableCount = font.readUInt16BE(4);
  let cmap;
  for (let i = 0; i < tableCount; i++) {
    const record = 12 + i * 16;
    if (font.toString("ascii", record, record + 4) === "cmap")
      cmap = font.readUInt32BE(record + 8);
  }
  if (cmap == null) return false;
  const count = font.readUInt16BE(cmap + 2);
  const subTables = [];
  for (let i = 0; i < count; i++) {
    const record = cmap + 4 + i * 8;
    const at = cmap + font.readUInt32BE(record + 4);
    const format = font.readUInt16BE(at);
    if (format === 4 || format === 12) subTables.push({ at, format });
  }
  subTables.sort((a, b) => b.format - a.format);
  for (const { at, format } of subTables) {
    if (format === 12) {
      const groups = font.readUInt32BE(at + 12);
      for (let i = 0; i < groups; i++) {
        const g = at + 16 + i * 12,
          first = font.readUInt32BE(g),
          last = font.readUInt32BE(g + 4);
        if (codePoint >= first && codePoint <= last)
          return font.readUInt32BE(g + 8) + codePoint - first !== 0;
      }
    } else if (codePoint <= 65535) {
      const segments = font.readUInt16BE(at + 6) / 2;
      for (let i = 0; i < segments; i++) {
        const last = font.readUInt16BE(at + 14 + i * 2),
          first = font.readUInt16BE(at + 16 + segments * 2 + i * 2);
        if (codePoint < first || codePoint > last) continue;
        const delta = font.readInt16BE(at + 16 + segments * 4 + i * 2);
        const offsetAt = at + 16 + segments * 6 + i * 2,
          offset = font.readUInt16BE(offsetAt);
        if (offset === 0) return ((codePoint + delta) & 65535) !== 0;
        const glyphAt = offsetAt + offset + (codePoint - first) * 2;
        if (glyphAt + 2 > font.length) return false;
        const glyph = font.readUInt16BE(glyphAt);
        return glyph !== 0 && ((glyph + delta) & 65535) !== 0;
      }
    }
  }
  return false;
}

const sources = readJSON(join(root, "assets/fonts/sources.json"));
const fontBuffers = [];
for (const source of sources.files) {
  const path = join(root, "assets/fonts", source.file);
  const data = readFileSync(path);
  check(
    createHash("sha256").update(data).digest("hex") ===
      source.sha256.toLowerCase(),
    `Font source hash changed: ${source.file}`,
  );
  if (!source.file.endsWith(".ttf")) continue;
  fontBuffers.push({ file: source.file, data });
  const magic = data.subarray(0, 4).toString("hex");
  check(
    magic === "00010000" || magic === "4f54544f",
    `Not an OpenType/TrueType binary: ${source.file}`,
  );
  const sample = source.file.startsWith("Noto")
    ? "游戏画面字体音频设置确认取消开始结束资源路径机关探索生命得分胜利失败，。！？「」【】（）％"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?.,:+-/";
  const missing = [...new Set(sample)].filter(
    (char) => !glyphCheck(data, char.codePointAt(0)),
  );
  check(
    missing.length === 0,
    `Missing sampled glyphs in ${source.file}: ${missing.join("")}`,
  );
  report.fonts.push({
    file: source.file,
    bytes: data.length,
    sampledGlyphs: [...new Set(sample)].length,
    missing,
  });
}
if (textFile) {
  const candidates = fontBuffers.filter(
    (font) => !fontName || font.file === fontName,
  );
  check(candidates.length > 0, `Unknown bundled font: ${fontName}`);
  const characters = [
    ...new Set(readFileSync(resolve(textFile), "utf8")),
  ].filter((char) => !/[\u0000-\u001f\u007f\uFEFF]/u.test(char));
  const missing = candidates.length
    ? characters.filter(
        (char) =>
          !candidates.some((font) =>
            glyphCheck(font.data, char.codePointAt(0)),
          ),
      )
    : [];
  report.actualText = {
    file: resolve(textFile),
    fonts: candidates.map((font) => font.file),
    uniqueCharacters: characters.length,
    missing: missing.map((char) => ({
      char,
      codePoint: `U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`,
    })),
  };
  check(
    missing.length === 0,
    `Missing actual-text glyphs: ${missing.join("")}`,
  );
}
for (const family of ["Silkscreen", "NotoSansSC"])
  check(
    readFileSync(join(root, `assets/fonts/${family}-OFL.txt`), "utf8").includes(
      "SIL OPEN FONT LICENSE Version 1.1",
    ),
    `Font license missing: ${family}`,
  );
const theme = readJSON(join(root, "assets/theme.json"));
const renderedAudio = readJSON(join(root, "assets/audio/sources.json"));
report.renderedAudio = [];
for (const source of renderedAudio.files) {
  const data = readFileSync(join(root, "assets/audio", source.file));
  check(
    data.toString("ascii", 0, 4) === "RIFF" &&
      data.toString("ascii", 8, 12) === "WAVE",
    `Not a WAV file: ${source.file}`,
  );
  check(
    data.readUInt32LE(40) === data.length - 44 &&
      data.readUInt32LE(4) === data.length - 8,
    `Invalid WAV sizes: ${source.file}`,
  );
  check(
    createHash("sha256").update(data).digest("hex") === source.sha256,
    `Rendered sound hash changed: ${source.file}`,
  );
  check(
    source.peak > 0 && source.peak < 0.9 && source.rms > 0,
    `Silence or clipping: ${source.file}`,
  );
  report.renderedAudio.push({
    file: source.file,
    duration: source.duration,
    peak: source.peak,
  });
}
for (const [role, key] of Object.entries(theme.roles))
  check(key in theme.palette, `Unknown role ${role}=${key}`);
for (const [name, color] of Object.entries(theme.palette))
  check(/^#[a-f\d]{6}$/i.test(color), `Invalid palette ${name}`);
for (const [cue, layers] of Object.entries(theme.audio.cues))
  for (const layer of layers) {
    check(
      ["sine", "square", "sawtooth", "triangle"].includes(layer.wave),
      `Invalid wave ${cue}`,
    );
    check(
      layer.duration > 0 &&
        layer.gain > 0 &&
        layer.gain <= 1 &&
        layer.frequency >= 20 &&
        layer.end >= 20,
      `Invalid sound envelope ${cue}`,
    );
  }
report.status = errors.length ? "failed" : "passed";
report.errors = errors;
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
