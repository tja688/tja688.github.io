# 小游档案

作品优先的独立游戏主页。使用像素墨色的灰阶材质、方角边框、少量荧绿交互提示；作品画面保留原本的美术风格。

Vite + React + TypeScript，部署到 GitHub Pages。推送 `main` 后自动构建发布。仓库 Pages 设置的 Source 使用 GitHub Actions，不能使用 `main / root` 的分支发布，否则会把源码入口直接发到线上。

## 本地运行

```powershell
npm ci
npm run dev
npm run build
npm run preview
```

## 内容与展示

- `src/content/projects.ts` 是作品目录，包含状态、文案、实机画面和试玩链接。
- `src/content/types.ts` 定义作品和媒体类型。`play` 链接用于在线游戏，`download` 用于试玩包和提取码。
- 首屏展示 The Called、九宫地下城、Wind Will Read；精选区展示九宫地下城、Wind Will Read、地狱酒店。
- 作品库从同一份目录生成，支持类型筛选和关键词搜索。
- `#p/<slug>` 可直接打开并分享作品详情。原生 dialog 支持 Esc、焦点限制和关闭后恢复焦点。
- 页面、分享元数据和部署资源均已去除实名、履历、私人联系方式与现实照片。源码旧版本仍保留在 Git 历史中。

美术约定见 `docs/art-direction.md`。

## The Called 在线试玩

主页入口为 `/play/the-called/`。这个目录包含游戏的静态前端和 WASM 规则内核，直接由 GitHub Pages 托管，不需要开发服务器。

原游戏仍标记为练手作品、未正式发布，网页只是一个实验试玩版本。截图来自本地实际操作，包括主菜单、节点地图、出牌后的对局和构筑界面。

重新同步浏览器版本前，在 The-Called 仓库构建前端和 WASM：

```powershell
dotnet publish src/Pcd.Wasm/Pcd.Wasm.csproj -c Release
npm run build:web
New-Item -ItemType Directory -Force dist/kernel | Out-Null
Copy-Item src/Pcd.Wasm/bin/Release/net10.0/browser-wasm/AppBundle/_framework dist/kernel/ -Recurse -Force
```

然后回到主页仓库：

```powershell
node scripts/import-the-called.mjs ../The-Called
npm run build
```

同步脚本检查相对资源路径与必要的 WASM 文件，再替换 `public/play/the-called`。来源提交、文件列表和 SHA-256 保存在 `docs/the-called-build.json`。它不会重写游戏源码。

截图保存在 `public/media/the-called`。其他作品素材也位于 `public/media/<slug>`。压制图片或视频：

```powershell
node scripts/media.mjs my-game path/to/shot.png --name shot-1
node scripts/media.mjs my-game path/to/capture.mp4 --name loop --no-square
```

## 浏览器验收

需要已安装的 `playwright-cli`。先构建并启动生产预览，避免只检查开发模式：

```powershell
npm run build
npm run preview -- --port 5175
playwright-cli -s=qa open http://localhost:5175
playwright-cli -s=qa run-code --filename=scripts/verify-site.js
```

验证分类、搜索、空状态、所有项目弹窗、深链接、键盘焦点、减少动画、五种屏宽及静态托管游戏的实际出牌路径。截图输出到忽略提交的 `artifacts/`。`verify-site.js` 是 CLI 所需的单函数表达式，末尾不加分号。

## 资源与授权

原始资源 `resources/` 使用 Git LFS。已部署资源 `public/media`、`public/fonts`、`public/play` 使用普通 Git，避免 Pages 把 LFS 指针当作实际资源。

Silkscreen 字体来自 `pixel-ink-game-art` 技能包，OFL 授权随字体放在 `public/fonts/Silkscreen-OFL.txt`。中文使用系统清晰字体，正文不做像素降采样。
