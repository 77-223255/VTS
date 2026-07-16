# Changelog

## v1.4.1 (2026-07-16)

- **Key remap in popup**: swapped `w` (down) and `e` (confirm) — now `e` moves down and `w` confirms selection ([popup.js](./popup.js))
- **Docs**: added `Backspace`/`Delete` close-tab shortcut to popup section in README (feature already existed since v1.4.0)

## v1.4.0 (2026-07-15)

- **Popup tab switcher**: popup now renders the full tab list (280px, elastic height ≤420px) as a fallback when overlay injection is blocked ([popup.html](./popup.html), [popup.js](./popup.js))
- **Overlay toggle**: third LED (white) enables/disables the Alt+Q overlay globally via a storage gate in the background service worker ([background.js](./background.js#L167-L170), [popup.js](./popup.js))
- **Keyboard expansion**: `q`↑ `w`↓ `e`↵ in popup; `j`/`k` navigation in overlay; `1`/`2`/`3` toggle LEDs via keydown map ([popup.js](./popup.js), [content-script.js](./content-script.js))
- **LED redesign**: solid color base with dual-layer box-shadow glow ring + inner shadow for a uniform 3-D indicator, no specular hotspot ([popup.html](./popup.html))
- **CSS variables unified**: popup inline styles now share the same `rgba()` color tokens as overlay.css via `:root` custom properties ([popup.html](./popup.html))
- **Performance**: DOM query results cached in `updateSel()` and `showPreview()` hot paths; `transition: all` narrowed to only animated properties; `CAPTURE_OPTS` constant hoisted ([content-script.js](./content-script.js), [overlay.css](./overlay.css), [background.js](./background.js))
- **Source restructuring**: all JS files organized into numbered sections with ASCII dividers; dead code removed; variable names clarified

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
