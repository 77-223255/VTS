/**
 * background.js - Service Worker v1.4.0
 * Handles tab capture, caching, message routing
 */

// ── 1. Thumbnail cache ──

const cache = {
  data: new Map(),
  capturing: new Map(),
  timers: new Map(),
  size: 0,
  LIMIT: 200,
  MAX_MEM: 20 << 20,
  _saveTimer: null,

  sizeOf: d => d ? Math.floor(d.length * 0.75) : 0,

  async load() {
    const { vts_thumbnails: s = {} } = await chrome.storage.session.get('vts_thumbnails').catch(() => ({}));
    this.data.clear();
    this.size = 0;
    for (const [id, d] of Object.entries(s)) {
      if (!id.startsWith('_')) { this.data.set(+id, d); this.size += this.sizeOf(d); }
    }
  },

  save() {
    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      chrome.storage.session.set({ vts_thumbnails: Object.fromEntries(this.data) }).catch(() => {});
      this._saveTimer = null;
    }, 1000);
  },

  evict() {
    while (this.data.size > this.LIMIT || this.size > this.MAX_MEM) {
      const [k, d] = this.data.entries().next().value || [];
      if (!k) break;
      this.size -= this.sizeOf(d);
      this.data.delete(k);
    }
  },

  set(id, d) {
    if (!d) return;
    this.size -= this.sizeOf(this.data.get(id));
    this.data.set(id, d);
    this.size += this.sizeOf(d);
    this.evict();
    this.save();
  },

  del(id) {
    this.size -= this.sizeOf(this.data.get(id));
    this.data.delete(id);
    this.capturing.delete(id);
    this.timers.delete(id);
    chrome.alarms.clear(`c_${id}`).catch(() => {});
    this.save();
  }
};

// ── 2. Helpers ──

const RESTRICTED = ['chrome://', 'edge://', 'about:', 'chrome-extension://', 'file://'];
const isAllowed = url => url && !RESTRICTED.some(p => url.startsWith(p));

const DEBOUNCE_MS = 5000;
const ALARM_PERIOD_MIN = 10;

const CAPTURE_OPTS = { format: 'jpeg', quality: 45 };

function capture(tabId, windowId) {
  const now = Date.now();
  const pending = cache.capturing.get(tabId);

  if (pending && now - pending.started < DEBOUNCE_MS) {
    return pending.promise;
  }

  const promise = chrome.tabs    .captureVisibleTab(windowId, CAPTURE_OPTS)
    .then(d => cache.set(tabId, d))
    .catch(() => null)
    .finally(() => cache.capturing.delete(tabId));

  cache.capturing.set(tabId, { promise, started: now });
  return promise;
}

// ── 3. Message router ──

const router = {
  async getTabsAndCapture({ tab }) {
    let wid = tab?.windowId;
    let captureId = tab?.id;

    if (!wid) {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!activeTab) return { tabs: [] };
      wid = activeTab.windowId;
      captureId = activeTab.id;
    }

    const tabs = await chrome.tabs.query({ windowId: wid });
    if (captureId) capture(captureId, wid);

    return {
      tabs: tabs.map(t => ({
        id: t.id,
        title: t.title || '加载中...',
        favIconUrl: t.favIconUrl || '',
        active: t.active,
        thumbnail: cache.data.get(t.id)
      }))
    };
  },

  async switchTab({ tabId }) {
    try { await chrome.tabs.update(tabId, { active: true }); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  },

  async closeTab({ tabId }) {
    try {
      await chrome.tabs.remove(tabId);
      cache.del(tabId);
      return { ok: true };
    } catch (e) { return { ok: false, error: e.message }; }
  }
};

// ── 4. Alarm (periodic capture) ──

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (!name.startsWith('c_')) return;
  const tabId = +name.slice(2);
  const wid = cache.timers.get(tabId);
  if (!wid) return;
  const t = await chrome.tabs.get(tabId).catch(() => null);
  if (t?.active && isAllowed(t.url)) await capture(tabId, wid);
  else { chrome.alarms.clear(name); cache.timers.delete(tabId); }
});

// ── 5. Tab lifecycle ──

chrome.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  const t = await chrome.tabs.get(tabId).catch(() => null);
  if (!t || !isAllowed(t.url)) return;
  await capture(tabId, windowId);
  chrome.alarms.create(`c_${tabId}`, { periodInMinutes: ALARM_PERIOD_MIN });
  cache.timers.set(tabId, windowId);
});

chrome.tabs.onUpdated.addListener(async (id, { status }, t) => {
  if (status !== 'complete' || !t?.active || !isAllowed(t.url)) return;
  await capture(id, t.windowId);
  chrome.alarms.create(`c_${id}`, { periodInMinutes: ALARM_PERIOD_MIN });
  cache.timers.set(id, t.windowId);
});

chrome.tabs.onRemoved.addListener(id => cache.del(id));

// ── 6. Commands ──

chrome.commands.onCommand.addListener(async cmd => {
  if (cmd !== 'open-overlay' && cmd !== 'navigate-up') return;

  const { vts_settings: s = {} } = await chrome.storage.local.get('vts_settings');
  if (s.enableOverlay === false) return;

  chrome.tabs.query({ active: true, currentWindow: true }, ([t]) => {
    if (!t?.id || !isAllowed(t.url)) return;
    const action = cmd === 'navigate-up' ? 'navigateUp' : 'trigger';
    chrome.tabs.sendMessage(t.id, { action }, () => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({ target: { tabId: t.id }, files: ['content-script.js'] })
          .then(() => setTimeout(() => chrome.tabs.sendMessage(t.id, { action }), 100));
      }
    });
  });
});

// ── 7. Message dispatch ──

chrome.runtime.onMessage.addListener((msg, sender, send) => {
  const h = router[msg.action];
  if (h) h({ ...msg, tab: sender.tab }).then(send).catch(() => send({}));
  return true;
});

// ── 8. Init ──

cache.load();
