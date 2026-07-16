<p align="center">
  <strong>English</strong> | <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <img src="icons/icon128.png" width="96" height="96">
</p>

<h1 align="center">VTS</h1>

<p align="center">Vertical Tab Switcher — Quick tab switching with thumbnail preview</p>

---

<p align="center">
  <img src="README_IMAGE/VTS_long.PNG" alt="VTS Screenshot">
</p>

## Features

- Thumbnail preview for each tab with side preview panel
- **Inline popup tab switcher** — works on pages where overlay injection is blocked
- Three LED indicators with keyboard toggles
- Dark / Light mode auto-detection
- Overlay enable/disable toggle via popup

## Installation

1. Download or clone this repository
2. Open `edge://extensions/` (or `chrome://extensions/`) in your browser
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the `VTS` folder

## Usage

### Overlay (`Alt+Q`)

| Key | Action |
| --- | ------ |
| `Alt+Q` | Open overlay / navigate down |
| `Alt+Shift+Q` | Navigate up |
| `↑` / `↓` or `j` / `k` | Navigate tabs |
| `Enter` | Switch to selected tab |
| `Delete` / `Backspace` | Close selected tab |
| `Esc` / Click background | Close overlay |
| Click `×` | Close tab |
| Release `Alt` | Confirm selection + close |

### Popup (`Alt+W`)

| Key | Action |
| --- | ------ |
| `q` / `↑` | Navigate up |
| `e` / `↓` | Navigate down |
| `w` / `Enter` | Switch to selected tab |
| `1` / `2` / `3` | Toggle LED indicators |
| `Esc` | Close popup |
| Click item / `×` | Switch / close tab |

## Settings

Click the extension icon or press `Alt+W` to open the popup. Three LED indicators:

| # | LED | Setting |
| --- | --- | --- |
| 1 | White | Enable / disable overlay (`Alt+Q`) |
| 2 | Blue | Show thumbnails in list |
| 3 | Green | Show side preview panel |

## FAQ

**Q: Why are some tabs missing thumbnails?**  
A: Chrome restricts screenshots on internal pages (chrome://, edge://, etc.).

**Q: Why doesn't the overlay appear on some pages?**  
A: Content script injection may be blocked on certain pages. Use the popup (`Alt+W`) instead — it provides the same tab list inline.

**Q: Can I change the shortcuts?**  
A: Yes, go to `edge://extensions/shortcuts`.

**Q: Does it work in incognito mode?**  
A: Yes, enable "Allow in incognito" in extension details.

[Changelog](./CHANGELOG.md)

## License

MIT License — see [LICENSE](../LICENSE).
