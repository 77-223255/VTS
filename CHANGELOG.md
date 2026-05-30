# Changelog

## v1.3.0 (2026-05-30)

- **Redesigned** settings popup: replaced old toggle blocks with two minimalist synth-style LED indicators on a compact 84x36 panel ([popup.html](./popup.html), [popup.js](./popup.js))
- **Refined** overlay brand colors: soft blue `#60a5fa` / green `#4ade80` with multi-layer diffused glow replacing the hard border ring ([overlay.css](./overlay.css#L6-L14))
- **Gentle** selection/active/hover states: layered box-shadow (`0 0 8px` + `0 0 20px`) fading radially for a subtle luminous aura ([overlay.css](./overlay.css#L84-L86))
- **Extended** `getTabsAndCapture` to work from popup context (no `sender.tab` fallback) ([background.js](./background.js#L71-L83))

## v1.2.0 (2026-05-17)

- **Added** `_execute_action` command with `Alt+W` shortcut for settings popup ([manifest.json](./manifest.json#L17-L21))
- **Added** `x_x` placeholder preview for tabs without thumbnails ([content-script.js](./content-script.js#L162-L187), [overlay.css](./overlay.css#L189-L191))
- **Redesigned** settings popup: removed language toggle, replaced text with eye emoticons (`O_O`/`>_<`), removed box borders with divider lines ([popup.html](./popup.html), [popup.js](./popup.js))
- **Refreshed** brand colors: more saturated blue/green for selection and active states ([overlay.css](./overlay.css#L6-L11))
- **Increased** tab item heights: default 40→60px, expanded 120→150px ([popup.html](./popup.html#L50-L67))
## v1.1.2 (2026-04-30)

- **Fixed** preview layout jitter when switching between tabs with different thumbnail sizes.
- **Improved** `positionList()` to use elastic positioning based on the active tab's actual thumbnail dimensions.
- **Improved** `showPreview()` to keep the tab list position fixed while only resizing the side preview panel.

## v1.1.0 (2026-04-04)

- Initial release with thumbnail preview, side preview panel, dark/light mode support, and keyboard navigation.
