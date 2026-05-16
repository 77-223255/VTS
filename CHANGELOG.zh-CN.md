# 更新日志

## v1.2.0 (2026-05-17)

- **新增** `_execute_action` 命令，绑定 `Alt+W` 快捷键打开设置面板 ([manifest.json](./manifest.json#L17-L21))
- **新增** 无缩略图标签的 `x_x` 占位预览 ([content-script.js](./content-script.js#L162-L187), [overlay.css](./overlay.css#L189-L191))
- **重构** 设置弹窗：移除语言切换，文字替换为眼睛颜文字（`O_O`/`>_<`），取消边框改用分割线 ([popup.html](./popup.html), [popup.js](./popup.js))
- **焕新** 品牌色：选中态和激活态使用更高饱和度的蓝/绿色 ([overlay.css](./overlay.css#L6-L11))
- **调整** 标签项高度：默认 40→60px，展开 120→150px ([popup.html](./popup.html#L50-L67))
- **修复** 背景图路径（`.jpg`→`.png`），`inset: -1px` 修复缩略图下边框线露白 ([popup.html](./popup.html#L28-L37))

## v1.1.2 (2026-04-30)

- **修复** 切换不同缩略图尺寸标签页时的预览布局跳动问题
- **改进** `positionList()` 基于当前活动标签页缩略图实际尺寸使用弹性定位
- **改进** `showPreview()` 保持标签列表位置固定，仅调整侧边预览面板大小

## v1.1.0 (2026-04-04)

- 初始版本：支持缩略图预览、侧边预览面板、深色/浅色模式及键盘导航
