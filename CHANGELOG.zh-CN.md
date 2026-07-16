# 更新日志

## v1.4.1 (2026-07-16)

- **弹窗按键重映射**：交换了 `w`（向下）和 `e`（确认）的功能 —— 现在 `e` 向下移动、`w` 确认选中 ([popup.js](./popup.js))

## v1.4.0 (2026-07-15)

- **弹窗标签切换器**：弹窗现可渲染完整标签列表（280px 宽，弹性高度 ≤420px），在 overlay 注入被拦截时作为后备方案 ([popup.html](./popup.html), [popup.js](./popup.js))
- **Overlay 开关**：第三盏 LED（白色）通过 background service worker 的 storage 门控，全局启用/禁用 Alt+Q overlay ([background.js](./background.js#L167-L170), [popup.js](./popup.js))
- **键盘扩展**：弹窗支持 `q`↑ `w`↓ `e`↵；overlay 新增 `j`/`k` 导航；`1`/`2`/`3` 通过 keydown 映射表切换 LED ([popup.js](./popup.js), [content-script.js](./content-script.js))
- **LED 重设计**：纯色底色 + 双层 box-shadow 辉光光环 + 内阴影，呈现均匀立体指示灯效果，无高光热点 ([popup.html](./popup.html))
- **CSS 变量统一**：弹窗内联样式通过 `:root` 自定义属性与 overlay.css 共用同一套 `rgba()` 色值 ([popup.html](./popup.html))
- **性能优化**：`updateSel()` 和 `showPreview()` 热路径中的 DOM 查询结果缓存；`transition: all` 收敛为仅动画变化属性；`CAPTURE_OPTS` 常量提升 ([content-script.js](./content-script.js), [overlay.css](./overlay.css), [background.js](./background.js))
- **源码重构**：所有 JS 文件按数字序号分段，采用 ASCII 分隔线；移除死代码；变量命名优化

## v1.3.0 (2026-05-30)

- **重设计** 设置弹窗：将原有文字开关替换为两个极简合成器风格 LED 指示灯，面板缩小至 84×36 像素 ([popup.html](./popup.html), [popup.js](./popup.js))
- **精炼** overlay 品牌色：柔和蓝 `#60a5fa` / 绿 `#4ade80`，多层扩散辉光取代原先的硬边色圈 ([overlay.css](./overlay.css#L6-L14))
- **柔化** 选中/活跃/悬停状态：层叠 box-shadow（`0 0 8px` + `0 0 20px`）径向衰减，营造柔和光晕 ([overlay.css](./overlay.css#L84-L86))
- **扩展** `getTabsAndCapture`：支持无 `sender.tab` 的 popup 调用回退 ([background.js](./background.js#L71-L83))

## v1.2.0 (2026-05-17)

- **新增** `_execute_action` 命令，绑定 `Alt+W` 快捷键打开设置面板 ([manifest.json](./manifest.json#L17-L21))
- **新增** 无缩略图标签的 `x_x` 占位预览 ([content-script.js](./content-script.js#L162-L187), [overlay.css](./overlay.css#L189-L191))
- **重构** 设置弹窗：移除语言切换，文字替换为眼睛颜文字（`O_O`/`>_<`），取消边框改用分割线 ([popup.html](./popup.html), [popup.js](./popup.js))
- **焕新** 品牌色：选中态和激活态使用更高饱和度的蓝/绿色 ([overlay.css](./overlay.css#L6-L11))
- **调整** 标签项高度：默认 40→60px，展开 120→150px ([popup.html](./popup.html#L50-L67))
## v1.1.2 (2026-04-30)

- **修复** 切换不同缩略图尺寸标签页时的预览布局跳动问题
- **改进** `positionList()` 基于当前活动标签页缩略图实际尺寸使用弹性定位
- **改进** `showPreview()` 保持标签列表位置固定，仅调整侧边预览面板大小

## v1.1.0 (2026-04-04)

- 初始版本：支持缩略图预览、侧边预览面板、深色/浅色模式及键盘导航
