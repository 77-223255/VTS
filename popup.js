/**
 * popup.js - Settings popup v1.3.0
 */

async function init() {
  const { vts_settings: s = {} } = await chrome.storage.local.get('vts_settings');

  const ledThumb = document.getElementById('ledThumb');
  const ledMacro = document.getElementById('ledMacro');

  function applyState() {
    ledThumb.classList.toggle('on', s.showThumbnailsInList ?? true);
    ledMacro.classList.toggle('on', s.showSidePreview ?? true);
  }

  function save() {
    chrome.storage.local.set({ vts_settings: s });
  }

  ledThumb.onclick = () => {
    s.showThumbnailsInList = !(s.showThumbnailsInList ?? true);
    applyState(); save();
  };

  ledMacro.onclick = () => {
    s.showSidePreview = !(s.showSidePreview ?? true);
    applyState(); save();
  };

  applyState();
}

init();
