# TJA688 Game Portfolio Prototype

一个可部署到 GitHub Pages 的单页个人主页原型，使用游戏 UI 的交互语言来展示作品，而不是传统简历站。

## 技术栈

- Vite
- React + TypeScript
- GSAP
- PixiJS
- Howler.js
- SCSS

## 当前内容

- 首屏 Hero 演出
- 三张占位作品卡
- 游戏式详情弹层
- Pixi 背景粒子 / 飞线 / 脉冲层
- Howler 短音效反馈
- 调试开关：音效、Pixi、低特效、模拟 reduced motion

## 本地运行

```powershell
npm install
npm run dev
```

## 构建

```powershell
npm run build
```

构建产物输出到 `dist/`。

## GitHub Pages

仓库已经包含 `.github/workflows/deploy.yml`，推送到 `main` 后会通过 GitHub Actions 构建并发布到 GitHub Pages。

这个仓库是用户主页仓库 `tja688.github.io`，所以 `vite.config.ts` 中的 `base` 设为根路径 `/`。

## 后续替换建议

1. 把 `src/data/works.ts` 里的占位项目替换成真实作品。
2. 把 `src/data/profile.ts` 里的简介、技能和外链替换成个人信息。
3. 将占位封面换成压缩后的真实截图或短视频封面。
