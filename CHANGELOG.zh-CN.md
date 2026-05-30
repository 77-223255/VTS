# 更新日志

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
