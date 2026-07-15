<p align="center">
  <a href="README.md">English</a> | <strong>简体中文</strong>
</p>

<p align="center">
  <img src="icons/icon128.png" width="96" height="96">
</p>

<h1 align="center">VTS</h1>

<p align="center">竖直标签切换器 — 快速标签切换，支持缩略图预览</p>

---

<p align="center">
  <img src="README_IMAGE/VTS_long.PNG" alt="VTS 截图">
</p>

## 功能特点

- 每个标签页显示缩略图预览，支持侧边放大面板
- **弹窗内嵌标签切换** — 在无法注入 overlay 的页面中仍可正常使用
- 三盏 LED 辉光指示灯，支持键盘切换
- 自动适配深色 / 浅色模式
- 可在弹窗中一键启用 / 禁用 overlay 功能

## 安装方法

1. 下载或克隆本仓库
2. 在 Edge 中打开 `edge://extensions/`（Chrome 则为 `chrome://extensions/`）
3. 启用右上角的**开发者模式**
4. 点击**加载已解压的扩展程序** → 选择 `VTS` 文件夹

## 使用方法

### Overlay 切换器（`Alt+Q`）

| 按键 | 操作 |
| ---- | ---- |
| `Alt+Q` | 打开切换器 / 向下导航 |
| `Alt+Shift+Q` | 向上导航 |
| `↑` / `↓` 或 `j` / `k` | 浏览标签 |
| `Enter` | 切换到选中标签 |
| `Delete` / `Backspace` | 关闭选中标签 |
| `Esc` / 点击背景 | 关闭切换器 |
| 点击 `×` | 关闭标签 |
| 松开 `Alt` | 确认选中并关闭 |

### Popup 弹窗（`Alt+W`）

| 按键 | 操作 |
| ---- | ---- |
| `q` / `↑` | 向上导航 |
| `w` / `↓` | 向下导航 |
| `e` / `Enter` | 切换到选中标签 |
| `1` / `2` / `3` | 切换 LED 指示灯 |
| `Esc` | 关闭弹窗 |
| 点击条目 / `×` | 切换 / 关闭标签 |

## 设置说明

点击扩展图标或按 `Alt+W` 打开弹窗，三盏 LED 指示灯：

| # | 颜色 | 设置项 |
| --- | --- | --- |
| 1 | 白色 | 启用 / 禁用 overlay（`Alt+Q`） |
| 2 | 蓝色 | 在列表中显示缩略图 |
| 3 | 绿色 | 显示侧边预览面板 |

## 常见问题

**问：为什么有些标签没有缩略图？**  
答：Edge 限制了对内部页面（chrome://、edge:// 等）的截图。

**问：为什么有些页面不弹出 overlay？**  
答：部分页面可能拦截了内容脚本注入。此时请使用弹窗（`Alt+W`）代替，弹窗内提供了同样的标签列表。

**问：可以修改快捷键吗？**  
答：可以，访问 `edge://extensions/shortcuts`。

**问：隐身模式下能用吗？**  
答：可以，在扩展详情页启用"在隐身模式下启用"。

[更新日志](./CHANGELOG.zh-CN.md)

## 开源协议

MIT License — 详见 [LICENSE](../LICENSE)。
