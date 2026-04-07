# tja688.github.io

`tja688.github.io` 是 GitHub Pages 用户站点仓库，对应默认访问地址：

<https://tja688.github.io>

## 当前结构

- `index.html`：主页入口
- `styles.css`：全站样式
- `script.js`：轻量交互
- `404.html`：自定义 404 页面

## 本地预览

这是一个纯静态站点，直接双击 `index.html` 就能看页面。

如果你想用本地服务预览，也可以在项目目录运行：

```powershell
python -m http.server 8000
```

然后访问 <http://localhost:8000>

## 发布

推送到 `main` 分支后，GitHub Pages 会把它作为用户主页站点发布。

## 后续建议

1. 把占位文案替换成你自己的简介与项目内容。
2. 增加真实项目截图、头像、简历下载等模块。
3. 如果以后需要博客、组件化开发或多页面结构，再升级到 Vite / Astro / Next.js。
