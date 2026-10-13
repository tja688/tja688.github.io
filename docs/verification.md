# 验收记录

2026-10-13，Windows / Chromium。检查对象为 `npm run build` 生成的产物，使用 Vite production preview 托管。

## 已通过

- TypeScript 类型检查与 Vite 正式构建。
- 12 个作品从统一目录生成，The Called 文案保留未发布与联机、PVE 难度的真实判断。
- 首屏三个作品切换，原型与 Game Jam 分类，玩法关键词搜索，无结果提示及重置。
- 12 个作品详情均能打开，画廊未出现断图，原下载入口与提取码仍可获取。
- 项目深链接、Esc 关闭、Tab 焦点限制、关闭后回到触发按钮、关闭后解除页面滚动锁。
- 320、390、768、1024、1440px 屏宽无页面横向溢出；390px 详情无横向溢出。
- 减少动画模式下，首页所有视频暂停；页面不主动播放音效。
- 无实名、学校、职位、私人联系方式或现实照片出现在页面和分享元数据中。
- 404 页能返回主页。
- 从作品详情的在线试玩链接打开 `/play/the-called/`，实际进入探索地图，加载 WASM 内核，选牌、放到第九格并完成怪物回应，再返回地图进入构筑界面。
- 本次浏览器检查没有未处理 JavaScript 错误，也没有同源 HTTP 4xx / 5xx 资源请求。

## 实机证据

- `public/media/the-called/home.webp`，实际主菜单。
- `public/media/the-called/map.webp`，实际探索地图。
- `public/media/the-called/battle.webp`，正常出牌后稳定在第三回合的对局，玩家与怪物各 3 点。
- `public/media/the-called/deck.webp`，实际十五张牌组与卡盒。
- `artifacts/home-desktop.png`，1440px 完整主页。
- `artifacts/home-mobile.png`，390px 完整主页。
- `artifacts/dialog-mobile.png`，390px The Called 详情。

`artifacts/` 是本地验收输出，不提交到部署。网站中引用的游戏截图使用 WebP，共约 210 KB。

## 可重复检查

见 `README.md` 的浏览器验收命令与 `scripts/verify-site.js`。游戏构建导入脚本为 `scripts/import-the-called.mjs`，版本来源和逐文件 SHA-256 为 `docs/the-called-build.json`。

这次验证覆盖主页和游戏托管接入，不代表对 The Called 全部卡牌规则或难度完成回归。原试玩下载平台的下载权限、网盘可用性未做完整下载验证。

## 发布设置修复

线上复查发现原 Pages 发布类型是 `legacy`，会由分支根目录的自动任务覆盖 Actions 产物。已把仓库 Pages 发布类型改为 `workflow`，继续使用 `.github/workflows/deploy.yml` 发布 `dist/`。这项设置属于 GitHub 仓库配置，重新部署仍需保持 GitHub Actions 作为 Source。
