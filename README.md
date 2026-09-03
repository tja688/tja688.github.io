# TJA688 · 个人主页

独立游戏开发者唐今的名片站：一页介绍我是谁、做过什么。

Vite + React 19 + TypeScript + Tailwind CSS 4 + Motion，部署到 GitHub Pages（推送 `main` 自动构建发布）。

## 本地运行

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 类型检查 + 产物到 dist/
npm run preview   # 本地预览 dist/
```

## 内容在哪里改

页面不写死任何文案，全部内容来自 `src/content/`：

| 文件 | 管什么 |
| --- | --- |
| `src/content/projects.ts` | 所有项目。列表、精选、详情弹窗、履历里的获奖记录都从这里生成 |
| `src/content/profile.ts` | 名字、首页一句话、自述、教育、技能、在玩的游戏、联系方式、照片 |
| `src/content/labels.ts` | 项目类型 / 状态的中文标签 |
| `src/content/types.ts` | 上面两份数据的类型定义，每个字段都有注释 |

## 新增一个项目

1. **准备媒体**。把素材压成站点格式，输出到 `public/media/<slug>/`：

   ```bash
   # 封面循环视频（GIF 或 mp4 都行）：得到 loop.mp4 + poster.webp
   node scripts/media.mjs my-game path/to/capture.gif --name loop

   # 截图：得到 shot-1.webp
   node scripts/media.mjs my-game path/to/shot.png --name shot-1
   ```

   需要 `ffmpeg` 在 PATH 里；没有就 `npm i -D ffmpeg-static` 一次，脚本会自动用它。
   封面视频默认裁成正方形（精选卡片和详情页都按正方形排），加 `--no-square` 可保留原比例。

2. **加一条数据**。在 `src/content/projects.ts` 的数组里追加一个 `Project`（放在合适的时间位置，数组顺序就是页面顺序）：

   ```ts
   {
     slug: 'my-game',                 // 与 public/media/<slug>/ 目录同名
     title: '我的游戏',
     latinTitle: 'My Game',           // 可选，有英文名时单独排出来
     year: '2026',
     kind: 'jam',                     // indie | jam | coursework | prototype
     status: 'shipped',               // in-dev | shipped | shelved
     event: 'Some Game Jam 2026',     // 可选
     award: '最佳玩法',               // 可选，填了会自动进「履历 · 获奖」
     role: '主程',
     team: '三人',
     tagline: '一句话说清楚这个游戏。',
     description: ['第一段。', '第二段。'],
     cover: { kind: 'video', src: '/media/my-game/loop.mp4', poster: '/media/my-game/poster.webp', alt: '画面描述' },
     gallery: [{ kind: 'image', src: '/media/my-game/shot-1.webp', alt: '截图描述' }],
     links: [
       { kind: 'download', url: 'https://pan.baidu.com/s/xxx', code: 'abcd', label: '试玩包' },
       { kind: 'video', url: 'https://www.bilibili.com/video/xxx', label: '演示视频 · B站' },
       { kind: 'page', url: 'https://tja688.itch.io/my-game', label: 'itch.io' },
     ],
     tags: ['Unity', 'C#'],
     featured: true,                  // 进首页精选；建议同时精选 2–4 个
   },
   ```

3. `npm run dev` 看一眼，没问题就提交推送。

其他常改的地方：首页底部「正在做」那一行在 `profile.ts` 的 `now`；联系方式在 `profile.ts` 的 `contacts`（有 `href` 渲染成外链，没有就渲染成点击复制）。

## 目录结构

```
src/
  app/App.tsx            页面骨架 + 项目弹窗的 hash 路由（#p/<slug>）
  components/            各区块：SiteNav / Hero / FeaturedWork / ProjectArchive / ProjectDialog / About / Contact / Footer
  components/ui/         Reveal（进场动画）/ Media（懒加载视频）/ CopyField / Button / SectionHeader
  content/               站点内容（见上）
  lib/softbody.ts        首页软体晶格的物理（Verlet + 位置约束，纯 TS 无 DOM）
  styles/globals.css     设计令牌：色板、字体栈、间距、动画曲线
public/
  media/<slug>/          各项目的 mp4 / webp
  favicon.svg  404.html  .nojekyll
scripts/media.mjs        素材压制脚本
```

## 设计约定

- 色板只有三层：炭黑底 `--color-bg`、骨白字 `--color-ink`（三档明度）、一支群青 `--color-accent`。群青只用于「受力 / 强调」，别拿来做装饰。
- 字体：中文标题 Noto Serif SC，正文走系统字体栈；英文标题 Archivo（可变字重）；数字与标签 IBM Plex Mono。
- 动效统一走 `Reveal`，尊重 `prefers-reduced-motion`；软体晶格在减少动画模式下会静止成完整六边形。
- 项目详情用原生 `<dialog>`，地址栏 `#p/<slug>` 可以直接分享到某个项目。

## 素材与 Git LFS

`resources/` 里的原始 GIF / 截图走 Git LFS，`public/media/**` 例外（在 `.gitattributes` 里排除），因为 GitHub Pages 的构建拿不到 LFS 对象。压制后的产物体积可控（目前全部约 30 MB），直接进普通 Git。
