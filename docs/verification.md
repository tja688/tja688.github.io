# 2026-10-17 视觉与交互升级验收

检查对象：npm run build 的正式产物，使用 http://127.0.0.1:4173/ 生产预览。本节记录上线前的本地实测，后文保留原有历史记录。

## 本次已通过

- TypeScript 与 Vite 构建通过，修改文件的 git diff --check 通过。
- playwright-cli 执行 scripts/verify-site.js 返回 passed: true。十二个项目、三项首屏选择、分类、玩法搜索、无结果重置、所有详情、深链接、Esc、Tab 焦点与焦点恢复均通过。
- 320、390、768、1024、1440px 宽度无横向溢出，390px 详情无横向溢出。桌面与 390px 浅深主题已实际打开查看。
- 系统浅深主题、手动切换、刷新后保留选择通过。减少动画时所有循环视频暂停。
- 鼠标移动确实改变展示窗的 spring transform；点击小卡带实际触发跳跃与像素碎屑；筛选后作品数和布局更新正确。
- 通过详情的真实链接打开 /play/the-called/，进入地图与 WASM 对局，出牌到第九格，等待需要的能力目标出现并选择，随后返回地图、打开牌组构筑。未修改游戏构建。
- 完整流程无未处理脚本错误，无同源 4xx / 5xx 资源失败。媒体与吉祥物均正常显示，WebP 含透明通道，288×288，约 11KB。
- Lighthouse 正式产物：手机与桌面的无障碍、最佳实践、SEO 均为 100 分。桌面品牌链接的可访问名称额外修正为使用可见文字。独立的 Agentic Browsing 项因未提供 llms.txt 未满分，这不是标准 SEO 项。
- 本机冷加载性能跟踪：LCP 156ms，CLS 0.00。使用本机静态服务器、无 CPU 或网络限速，不代表公网或真实用户性能，未测得现场 INP。

## 本次实机证据

- artifacts/home-desktop.png：1440px 浅色完整主页。
- artifacts/home-mobile.png：390px 浅色完整主页。
- artifacts/dialog-mobile.png：390px 项目详情。
- artifacts/portfolio-dark.png：1440px 深色首屏。
- docs/art-direction.md：改版审视、视觉规则、动效用途、生成素材提示词。

验收脚本必须运行在 production preview。Vite dev 对 public 下目录的 HTML 请求可能回退主页，不能用它验证嵌入式静态游戏。原脚本在出牌后立即判断目标是否可见存在竞争；本次改为等待目标选择或回合继续状态，再进行后续操作。脚本同时等待筛选退出动画结束后检查作品数量。

本次未重新验证网盘下载权限或对 The Called 全部规则做回归。页面不新增用户身份信息，也不自动发声。

---

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
