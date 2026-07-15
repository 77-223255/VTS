/**
 * popup.js - Tab Switcher Popup v1.4.0
 * Inline tab list with mouse/keyboard navigation
 */

// ── 1. DOM refs ──

const list = document.getElementById('tabList');
const ledOverlay = document.getElementById('ledOverlay');
const ledThumb = document.getElementById('ledThumb');
const ledMacro = document.getElementById('ledMacro');

// ── 2. State ──

let settings = { enableOverlay: true, showThumbnailsInList: true, showSidePreview: true };
let tabs = [];
let sel = 0;

// ── 3. API ──

const api = {
  send(msg) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, r => {
        chrome.runtime.lastError ? reject(r) : resolve(r);
      });
    });
  },
  getTabs() {
    return api.send({ action: 'getTabsAndCapture' }).then(r => r?.tabs || []);
  }
};

// ── 4. Layout ──

function calcLayout() {
  const h = settings.showThumbnailsInList
    ? Math.max(80, Math.min(140, document.body.clientHeight * 0.30))
    : 0;
  document.documentElement.style.setProperty('--vts-h', (h || 44) + 'px');
}

// ── 5. Render ──

let _cachedItems = null;

function render() {
  list.innerHTML = '';
  if (!tabs.length) {
    list.innerHTML = '<div class="empty-msg">No tabs</div>';
    _cachedItems = null;
    return;
  }
  calcLayout();
  const frag = document.createDocumentFragment();
  tabs.forEach((t, i) => frag.appendChild(createItem(t, i)));
  list.appendChild(frag);
  _cachedItems = list.querySelectorAll('.tab-item');
  updateSel();
}

function createItem(tab, idx) {
  const hasThumb = settings.showThumbnailsInList && tab.thumbnail;
  const el = document.createElement('div');
  el.className = 'tab-item' + (tab.active ? ' active-tab' : '') + (hasThumb ? ' has-thumb' : ' no-thumb');
  el.dataset.idx = idx;

  const bar = document.createElement('div');
  bar.className = 'tab-title-bar';

  if (tab.favIconUrl) {
    const ico = document.createElement('img');
    ico.className = 'tab-favicon';
    ico.src = tab.favIconUrl;
    ico.onerror = () => ico.style.display = 'none';
    bar.appendChild(ico);
  }

  const title = document.createElement('span');
  title.className = 'tab-title';
  title.textContent = tab.title;
  bar.appendChild(title);

  const closeBtn = document.createElement('div');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '\u00d7';
  bar.appendChild(closeBtn);

  if (hasThumb) {
    const thumb = document.createElement('div');
    thumb.className = 'tab-thumb';
    const img = document.createElement('img');
    img.src = tab.thumbnail;
    thumb.appendChild(img);
    thumb.appendChild(bar);
    el.appendChild(thumb);
  } else {
    el.appendChild(bar);
  }
  return el;
}

function updateSel() {
  const items = _cachedItems;
  items.forEach((el, i) => el.classList.toggle('selected', i === sel));
  items[sel]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ── 6. Tab actions ──

async function switchTo(id) {
  await api.send({ action: 'switchTab', tabId: id });
  window.close();
}

async function closeOne(id) {
  await api.send({ action: 'closeTab', tabId: id });
  const idx = tabs.findIndex(t => t.id === id);
  if (idx < 0) return;
  tabs.splice(idx, 1);
  if (!tabs.length) { render(); window.close(); return; }
  if (sel >= tabs.length) sel = tabs.length - 1;
  else if (idx < sel) sel--;
  render();
}

// ── 7. Settings ──

function applyLEDs() {
  ledOverlay.classList.toggle('on', settings.enableOverlay);
  ledThumb.classList.toggle('on', settings.showThumbnailsInList);
  ledMacro.classList.toggle('on', settings.showSidePreview);
}

function saveSettings() {
  chrome.storage.local.set({ vts_settings: settings });
}

function toggleSetting(key) {
  settings[key] = !settings[key];
  applyLEDs();
  saveSettings();
  if (key !== 'enableOverlay') render();
}

// ── 8. Events ──

ledOverlay.addEventListener('click', () => toggleSetting('enableOverlay'));
ledThumb.addEventListener('click', () => toggleSetting('showThumbnailsInList'));
ledMacro.addEventListener('click', () => toggleSetting('showSidePreview'));

list.addEventListener('click', e => {
  const closeBtn = e.target.closest('.close-btn');
  const item = e.target.closest('.tab-item');
  if (!item) return;
  const idx = +item.dataset.idx;
  if (closeBtn) return closeOne(tabs[idx].id);
  switchTo(tabs[idx].id);
});

const KEY_SETTING = { '1': 'enableOverlay', '2': 'showThumbnailsInList', '3': 'showSidePreview' };

document.addEventListener('keydown', e => {
  if (KEY_SETTING[e.key]) { toggleSetting(KEY_SETTING[e.key]); return; }

  if (!tabs.length) {
    if (e.key === 'Escape') window.close();
    return;
  }

  const has = tabs[sel];
  if (e.key === 'ArrowDown' || e.key === 'w') { sel = (sel + 1) % tabs.length; updateSel(); }
  else if (e.key === 'ArrowUp' || e.key === 'q') { sel = (sel - 1 + tabs.length) % tabs.length; updateSel(); }
  else if ((e.key === 'Enter' || e.key === 'e') && has) { switchTo(has.id); }
  else if ((e.key === 'Backspace' || e.key === 'Delete') && has) { closeOne(has.id); }
  else if (e.key === 'Escape') { window.close(); }
  else return;
  e.preventDefault();
});

// ── 9. Init ──

(async function init() {
  const [stored, fetchedTabs] = await Promise.all([
    chrome.storage.local.get('vts_settings'),
    api.getTabs().catch(() => [])
  ]);
  const s = stored.vts_settings || {};
  settings.enableOverlay = s.enableOverlay ?? true;
  settings.showThumbnailsInList = s.showThumbnailsInList ?? true;
  settings.showSidePreview = s.showSidePreview ?? true;
  applyLEDs();

  tabs = fetchedTabs;
  sel = Math.max(0, tabs.findIndex(t => t.active));
  render();
})();
