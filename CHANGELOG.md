# Changelog

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
