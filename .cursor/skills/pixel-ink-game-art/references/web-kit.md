# Web 基础工具

从技能目录运行 `node scripts/scaffold.mjs <游戏目录>`。输出只在该项目的 `art/`，不创建规则或游戏入口。重复运行时相同文件跳过，不同文件先报错；明确需要替换工具资源时加 `--replace-art`。应用逻辑、场景和布局由策划决定。

通过 HTTP 服务运行 ES 模块与字体。可用 `node scripts/preview.mjs <游戏目录> --port 4186` 做本地检查，或使用已有项目的开发服务。

## 初始化与显示

在页面引入 `art/style.css`，建立一个有实际宽高的 `.ink-surface` 容器和其中的 Canvas。UI 放在其外层或独立叠加层；交互控件用清晰文字。

```js
import { loadTheme, installTheme, loadFonts, createPixelSurface, makeFloor, InkFX } from './art/ink.mjs'
import { InkAudio } from './art/audio.mjs'

const theme = await loadTheme()
installTheme(theme)
await loadFonts()
let floor
const surface = createPixelSurface(document.querySelector('canvas'), {
  ...theme.world,
  logicalHeight: theme.world.logicalHeight,
  onResize: (width, height) => { floor = makeFloor(width, height, { palette: theme.palette, ...theme.world }) },
})
const fx = new InkFX(theme, { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches })
const audio = new InkAudio(theme, { storageKey: 'my-game-audio' })
```

`makeFloor` 接收 `{ palette, tile, seed }`。世界的绘制循环、摄像机与对象命中由游戏代码建立，`onResize` 只重建静态纹理。

`createPixelSurface` 默认按容器比例调整逻辑宽度，并在 `minWidth/maxWidth` 之间限制。固定地图或棋盘需保持同一逻辑尺寸时，传入 `minWidth: mapWidth, maxWidth: mapWidth, logicalHeight: mapHeight`；显示尺寸仍可自适应。可滚动世界则把地图边界与当前视口分开，用摄像机处理二者的关系。规则边界和对象命中采用各自明确的世界坐标。

## 绘制 API

| API | 输入与用途 |
| --- | --- |
| `surface.ctx / width / height` | 当前逻辑画布和上下文，尺寸随容器变化 |
| `surface.fromClient(x,y)` | 映射指针到逻辑世界，摄像机变换由游戏再应用 |
| `pixelLine(ctx,ax,ay,bx,by,color)` | 栅格折线的线段，最终坐标取整 |
| `pixelRing(ctx,x,y,radius,color,options)` | 可配置边数与旋转的像素环 |
| `pixelPolygon(ctx,points,color)` | 扫描线实心多边形 |
| `drawBlueprint(ctx,blueprint,pose)` | `rows` 字符网格、`colors` 映射和可选 `pivot`；`pose` 为坐标与整数缩放 |
| `ditherRect(ctx,options)` | 区域、颜色与密度，`originX/Y` 把图案锁在世界坐标 |
| `makeDitherGlow(radius,color,density)` | 生成可缓存的透明点阵光晕，状态变化时重建 |
| `makeFloor(width,height,{palette,tile,seed})` | 可缓存的灰阶接缝、颗粒和裂纹 |
| `noise(x,y,seed)` | 稳定视觉噪声，供材质与外观变化使用 |

建立自己的蓝图，例如容器、机器、动物或逻辑符号。`rows` 中点号为空，其他字符从 `colors` 取色；零件组合在游戏代码中依锚点绘制。工具不预设卡牌、怪物或地图类型。

## 反馈与声音

规则产生实际事件时调用 `fx.burst/pulse/float({x,y,color,eventId,...})`，用主题的语义颜色。每帧按秒计算 `dt`，运行 `fx.update(dt)` 后在世界绘制末尾调用 `fx.draw(ctx)`。每个效果通道对 `eventId` 去重，粒子与浮字有容量上限。

`InkFX.float` 默认在低清世界里以 8 px 像素拉丁字体绘制，适合短数字与拉丁读数。中文原因、长结果与规则说明放在主分辨率 DOM 或清晰 UI 层；需要跟随世界对象的中文标签，通过世界到屏幕的坐标变换定位该清晰层。

```js
startButton.addEventListener('click', async () => {
  if (await audio.unlock()) {
    audio.play('confirm')
    audio.startAmbience('mysterious')
  } else {
    // Give the player a usable sound-enable or mute control.
  }
})
// Called once when the game's accepted event occurs:
fx.burst({ x, y, color: theme.palette[theme.roles.action], eventId })
audio.play('impact', { eventId })
```

`audio.setLevels({music,effects,master,muted})` 作用于已有声音；`suspend/resume` 用于页面或暂停策略；`stopAmbience` 与 `dispose` 处理退出。`scheduleCue` 可用于 OfflineAudioContext 的波形检查。

非零音量采用指数平滑，零音量与静音立即归零。压缩器也有释放时间。测量滑块效果时，按 [audio.mjs](../assets/web/audio.mjs) 中的时间常数留出收敛窗口，再采集实际输出；非零设置后的第一帧可能仍在过渡。另检查闲置总线设零后第一次播放，确保没有短暂漏声。

闲置节点的 `AudioParam.value` 可能仍显示缓存的旧值。用实际播放后的输出或试听判断声音是否被关闭，同时记录控件状态；单独读取增益参数不足以验证静音。

关闭场景时取消应用自己的动画循环和监听，执行 `surface.dispose()`、`fx.clear()` 与 `audio.dispose()`。这些工具只拥有自己的资源；游戏规则和页面生命周期仍由应用负责。
