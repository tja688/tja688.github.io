# 小游档案视觉约定

2026-10-17，基于现有作品集的视觉升级。面向玩家和独立游戏同行，用真实游戏画面、简洁文字和有弹性的操作反馈呈现作品。

## 改版前审视

原站使用深绿黑背景、浅绿强调色、系统中文字体、Silkscreen 与 IBM Plex Mono、方角和像素手柄标志。首页有可切换展示窗、等宽三列精选、十二个作品的分类搜索、原生详情弹窗和平台链接。首页重复出现英文小标签、编号、导览句、状态点和相同意图的入口，框架信息过多。原有风格读数约为 DESIGN_VARIANCE 5、MOTION_INTENSITY 2、VISUAL_DENSITY 6。

本次保留标志、“精选作品 / 全部游戏”导航、#selected 与 #games 锚点、#p/<slug> 项目链接、所有下载和试玩地址。SEO 标题、描述、OG 图与 canonical 分享地址保持原值。追加有效 robots.txt，避免 SPA 回退把 HTML 当作爬虫配置。身份与现实照片继续不出现在作品集里。

## 视觉方向

DESIGN_VARIANCE 8，MOTION_INTENSITY 7，VISUAL_DENSITY 3。使用原生 CSS 与现有 Tailwind 构建定制视觉，不套用商业组件库的默认皮肤。

- 标题、正文使用 Outfit 与系统中文无衬线字。Silkscreen 只保留在品牌与收尾短句，IBM Plex Mono 用于年份等少量元数据。
- 保留浅绿 #c4ed8b。深色用 #151811 与 #edf0e5；浅色用 #f0f1eb 与 #24291f。浅色的小字用同一绿色系的深色值保证对比。按钮始终使用浅绿底、深绿字。
- 全站方角。边框用于导航、主展示窗和弹窗；作品列表本身不套卡片外壳。主展示窗和主按钮保留偏移硬阴影。
- 首屏两行标题配大幅实机画面。精选使用一大两小的构图，作品库使用紧凑的三列画面网格，收尾只留平台入口与小卡带。
- 删除无实际作用的编号、英文眉题、导览尾注、画面标签与重复说明。作品列表每项只留一句玩法介绍，详情保留原开发故事与项目状态。
- 768px 以下各展区单列。导航、按钮与搜索布局分别收紧，320px 起可完整操作。

## 动效用途

Motion 负责操作反馈，CSS 负责原生弹窗进入。指针位置写入 useSpring motion values，不写入 React state，不监听 scroll 逐帧计算。

| 操作 | 反馈目的 |
| --- | --- |
| 首屏进入、精选进入视口 | 按顺序建立标题与作品的层级 |
| 切换首屏作品 | 滑块、淡入与小幅位移说明选中项变化，像素碎屑确认操作 |
| 鼠标停在封面上 | 轻微弹性倾斜和缩放提示可打开 |
| 主按钮与打开按钮 | 轻微吸附、按压和回弹确认可操作性 |
| 分类与搜索 | 指示块移动、作品位置重排说明列表变化 |
| 打开详情 | 缩放淡入连接列表与详情的状态变化 |
| 点击小卡带 | 跳跃、挤压与像素碎屑回应用户，不自动循环 |

prefers-reduced-motion 下关闭位移、倾斜、碎屑、平滑滚动与视频自动播放。触摸操作不启用指针倾斜。所有媒体都静音，页面不播放额外音效。视频只有实际进入视口时才加载播放，离开、页面隐藏或减少动画时暂停。图片失败时显示原位置的文字反馈，视频失败回退海报。无搜索结果时提供重置，复制失败给出手动复制提示。

主题默认跟随系统，导航右侧可手动切换并记住选择。通过内联初始化避免记忆主题闪烁。所有区块使用同一组语义颜色，不在滚动中反转主题。

Motion API 参考：[useSpring](https://motion.dev/docs/react-use-spring)、[减少动画](https://motion.dev/docs/react-accessibility)。

## 小卡带素材

工作区文件：public/media/site/cartridge.webp。使用内置 imagegen 生成透明 PNG，再用现有 scripts/media.mjs 转成 288px WebP，约 11KB。只作为网站吉祥物，不替代任何游戏实机素材。原生成文件仍保留在 Codex generated_images 文件夹。

生成提示词：

> Create a small original indie game archive mascot as a transparent pixel art asset. A charming squat little walking game cartridge creature, off-white body, dark charcoal outline, pale acid green cartridge label, two tiny dark eyes, stubby feet, one arm raised as if saying hello. Front three-quarter view facing slightly left. Strong crisp pixel blocks, limited palette of charcoal #20231e, off-white #e8eae2 and pale lime #c4ed8b only. Handcrafted understated indie game aesthetic, expressive silhouette, no text or letters, no logo, no background, no floor, no shadow outside the character, no gradients, no glow, no 3D render. Single centered character occupying the middle 70 percent of a square transparent canvas. Intended to display at 120 pixels wide on a tasteful indie game portfolio.

## 交付检查范围

每个可见区块分别检查浅深主题、文案、按钮对比、断行、手机布局和减少动画；无表单、徽标墙、引语、长规格表或滚动劫持，对应技能检查项不适用。只保留一个区块眉题；无装饰性编号、状态点、滚动提示、图片上标签、跑马灯或破折号。首屏 CTA 与导航使用同一“全部游戏”名称。

浏览器与构建实测结果见 docs/verification.md，复跑方法见 README.md。
