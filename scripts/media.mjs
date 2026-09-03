#!/usr/bin/env node
/**
 * 把项目素材压成站点用的格式，输出到 public/media/<slug>/。
 *
 *   node scripts/media.mjs <slug> <输入文件> [选项]
 *
 * 输入是 gif / mp4 / mov / webm 时：
 *   生成 <name>.mp4（h264，20fps，静音，默认裁成正方形）和 <name>-poster.webp（首帧海报）
 *   cover 视频请用 --name loop，会得到 loop.mp4 + poster.webp
 * 输入是 png / jpg / webp 时：
 *   生成 <name>.webp（最大宽度 --size，默认 1600）
 *
 * 选项：
 *   --name <n>        输出文件名（不含后缀），默认取输入文件名
 *   --size <px>       视频：正方形边长（默认 720）；图片：最大宽度（默认 1600）
 *   --no-square       视频不裁成正方形，保留原比例（宽高会取偶数）
 *   --poster-at <s>   海报取第几秒的画面，默认 1.0
 *   --crf <n>         视频质量，越小越清晰体积越大，默认 24
 *
 * 需要 PATH 里有 ffmpeg；没有的话可以 `npm i -D ffmpeg-static` 后再跑，脚本会自动找到它。
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function resolveFfmpeg() {
  const probe = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (probe.status === 0) return 'ffmpeg';
  try {
    const require = createRequire(import.meta.url);
    const bin = require('ffmpeg-static');
    if (bin && existsSync(bin)) return bin;
  } catch {
    /* 没装 ffmpeg-static */
  }
  console.error('找不到 ffmpeg。请安装 ffmpeg，或者在项目里 `npm i -D ffmpeg-static`。');
  process.exit(1);
}

function parseArgs(argv) {
  const [slug, input, ...rest] = argv;
  if (!slug || !input) {
    console.error('用法：node scripts/media.mjs <slug> <输入文件> [--name n] [--size px] [--no-square] [--poster-at s] [--crf n]');
    process.exit(1);
  }
  const opts = { slug, input, name: null, size: null, square: true, posterAt: 1.0, crf: 24 };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === '--name') opts.name = rest[++i];
    else if (a === '--size') opts.size = Number(rest[++i]);
    else if (a === '--no-square') opts.square = false;
    else if (a === '--poster-at') opts.posterAt = Number(rest[++i]);
    else if (a === '--crf') opts.crf = Number(rest[++i]);
    else {
      console.error(`未知参数 ${a}`);
      process.exit(1);
    }
  }
  return opts;
}

function run(ff, args) {
  const r = spawnSync(ff, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('ffmpeg 失败');
    process.exit(r.status ?? 1);
  }
}

function report(file) {
  const kb = statSync(file).size / 1024;
  console.log(`${path.relative(root, file)}  ${kb >= 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(0) + ' KB'}`);
}

const ff = resolveFfmpeg();
const o = parseArgs(process.argv.slice(2));
const input = path.resolve(o.input);
if (!existsSync(input)) {
  console.error(`输入文件不存在：${input}`);
  process.exit(1);
}
const outDir = path.join(root, 'public', 'media', o.slug);
mkdirSync(outDir, { recursive: true });
const ext = path.extname(input).toLowerCase();
const name = o.name ?? path.basename(input, ext);

if (['.gif', '.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
  const size = o.size ?? 720;
  const geom = o.square
    ? `crop=trunc(min(iw\\,ih)/2)*2:trunc(min(iw\\,ih)/2)*2,scale=${size}:${size}:flags=lanczos`
    : 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
  const video = path.join(outDir, `${name}.mp4`);
  run(ff, [
    '-i', input,
    '-vf', `fps=20,${geom},format=yuv420p`,
    '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(o.crf),
    '-movflags', '+faststart',
    video,
  ]);
  report(video);

  // cover 视频的海报固定叫 poster.webp，其他视频叫 <name>-poster.webp
  const poster = path.join(outDir, name === 'loop' ? 'poster.webp' : `${name}-poster.webp`);
  run(ff, ['-ss', String(o.posterAt), '-i', input, '-frames:v', '1', '-vf', geom, '-c:v', 'libwebp', '-quality', '82', poster]);
  report(poster);
} else if (['.png', '.jpg', '.jpeg', '.webp', '.bmp'].includes(ext)) {
  const maxW = o.size ?? 1600;
  const out = path.join(outDir, `${name}.webp`);
  run(ff, ['-i', input, '-vf', `scale='min(${maxW},iw)':-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', '82', out]);
  report(out);
} else {
  console.error(`不认识的文件类型：${ext}`);
  process.exit(1);
}
