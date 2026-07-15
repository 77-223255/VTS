/**
 * content-script.js - Vertical Tab Switcher v1.4.0
 * Overlay UI with keyboard/mouse navigation and preview
 */

;(function () {
  'use strict';
  if (window.__VTS) return;
  window.__VTS = true;

  // ── 1. State ──

  const S = {
    visible: false,
    busy: false,
    tabs: [],
    sel: 0,
    active: 0,
    settings: { thumbs: true, preview: true },
    altHeld: false,
    initialized: false
  };

  // ── 2. Utilities ──

  function addListeners(el, types, fn, opt) {
    types.split(' ').forEach(t => el.addEventListener(t, fn, opt));
  }

  function getImageNaturalSize(dataUrl) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 0, h: 0 });
      img.src = dataUrl;
    });
  }

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
    const thumbH = S.settings.thumbs
      ? Math.max(52, Math.min(190, innerHeight * 0.09))
      : 0;
    document.documentElement.style.setProperty('--vts-h', (thumbH || 44) + 'px');
  }

  function calcPreviewLayout(ratio) {
    const margin = Math.max(32, innerWidth * 0.03);
    const gap = 32;
    const listW = 280;
    const titleH = 28;
    const availW = innerWidth - margin * 2 - listW - gap;
    const availH = innerHeight - margin * 2 - titleH;
    let w = Math.min(availW, availH * ratio);
    let h = w / ratio;
    if (h > availH) { h = availH; w = h * ratio; }
    const listRect = DOM.list.getBoundingClientRect();
    return { w, h, titleH, previewX: listRect.right + gap, previewY: (innerHeight - h - titleH) / 2 };
  }

  // ── 5. DOM ──

  const DOM = {
    overlay: null, list: null, preview: null,
    savedPosition: '', savedTop: '', savedWidth: '', savedScrollY: 0,
    _handler: null, _container: null,

    create() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'vts-overlay';

      this.list = document.createElement('div');
      this.list.className = 'vts-tab-list';

      this.preview = document.createElement('div');
      this.preview.className = 'vts-preview-popup';
      this.preview.innerHTML = '<img><div class="vts-preview-title"></div>';
      this._previewImg = this.preview.querySelector('img');
      this._previewTitle = this.preview.querySelector('.vts-preview-title');

      this.overlay.appendChild(this.list);
      this._container = document.fullscreenElement || document.body;
      this._container.append(this.overlay, this.preview);

      if (!document.fullscreenElement) {
        this.savedScrollY = window.scrollY;
        this.savedPosition = document.body.style.position;
        this.savedTop = document.body.style.top;
        this.savedWidth = document.body.style.width;
        document.body.style.position = 'fixed';
        document.body.style.top = -this.savedScrollY + 'px';
        document.body.style.width = '100%';
      }

      this.overlay.onclick = e => { if (e.target === this.overlay) close(); };
      this._handler = onItemEvent;
      addListeners(this.list, 'click mousedown mousemove mouseup mouseover mouseout', this._handler, true);
    },

    destroy() {
      if (this._handler && this.list) {
        ['click', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout']
          .forEach(t => this.list.removeEventListener(t, this._handler, true));
      }
      this.overlay?.remove();
      this.preview?.remove();
      if (this._container === document.body) {
        document.body.style.position = this.savedPosition;
        document.body.style.top = this.savedTop;
        document.body.style.width = this.savedWidth;
        window.scrollTo(0, this.savedScrollY);
      }
      this.overlay = this.list = this.preview = this._handler = this._container = this._previewImg = this._previewTitle = null;
    }
  };

  // ── 6. Render ──

  let _cachedItems = null;

  function render() {
    DOM.list.innerHTML = '';
    if (!S.tabs.length) {
      DOM.list.innerHTML = '<div class="vts-empty-message">没有标签页</div>';
      _cachedItems = null;
      return;
    }
    const frag = document.createDocumentFragment();
    S.tabs.forEach((t, i) => frag.appendChild(createItem(t, i)));
    DOM.list.appendChild(frag);
    _cachedItems = DOM.list.querySelectorAll('.vts-tab-item');
    updateSel();
  }

  function createItem(tab, idx) {
    const hasThumb = S.settings.thumbs && tab.thumbnail;
    const el = document.createElement('div');
    el.className =
      'vts-tab-item' +
      (tab.active ? ' vts-active-tab' : '') +
      (hasThumb ? ' vts-overlay-mode' : ' vts-native-mode');
    el.dataset.idx = idx;

    const bar = document.createElement('div');
    bar.className = 'vts-tab-title-bar';

    if (tab.favIconUrl) {
      const ico = document.createElement('img');
      ico.className = 'vts-tab-favicon';
      ico.src = tab.favIconUrl;
      ico.onerror = () => ico.style.display = 'none';
      bar.appendChild(ico);
    }

    const title = document.createElement('span');
    title.className = 'vts-tab-title';
    title.textContent = tab.title;
    bar.appendChild(title);

    const closeBtn = document.createElement('div');
    closeBtn.className = 'vts-close-btn';
    closeBtn.textContent = '×';
    bar.appendChild(closeBtn);

    if (hasThumb) {
      const thumb = document.createElement('div');
      thumb.className = 'vts-tab-thumbnail';
      const img = document.createElement('img');
      img.src = tab.thumbnail;
      img.loading = 'lazy';
      thumb.appendChild(img);
      thumb.appendChild(bar);
      el.appendChild(thumb);
    } else {
      el.appendChild(bar);
    }
    return el;
  }

  function updateSel(scroll) {
    const items = _cachedItems;
    if (!items?.length) return;
    items.forEach((el, i) => el.classList.toggle('vts-selected', i === S.sel));
    if (scroll) items[S.sel]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    showPreview(S.tabs[S.sel]);
  }

  // ── 7. Preview ──

  function positionList(previewSize) {
    if (!DOM.list) return;
    if (S.settings.preview && previewSize?.w > 0) {
      const p = calcPreviewLayout(previewSize.w / previewSize.h);
      const totalW = 280 + 32 + p.w;
      const listX = (innerWidth - totalW) / 2;
      DOM.list.style.cssText = `position:absolute;left:${listX}px;top:50%;transform:translateY(-50%)`;
    } else if (S.settings.preview) {
      const previewW = Math.min(innerWidth * 0.35, innerHeight * 0.6);
      const listX = (innerWidth - 280 - 32 - previewW) / 2;
      DOM.list.style.cssText = `position:absolute;left:${listX}px;top:50%;transform:translateY(-50%)`;
    } else {
      DOM.list.style.cssText = '';
    }
  }

  function showPreview(tab) {
    if (!S.settings.preview) {
      DOM.preview?.classList.remove('vts-visible');
      return;
    }

    const img = DOM._previewImg;
    DOM._previewTitle.textContent = tab?.title || '';

    if (!tab?.thumbnail) {
      DOM.preview.classList.remove('vts-visible');
      DOM.preview.classList.add('vts-no-thumb');
      img.style.display = 'none';
      const p = calcPreviewLayout(1.6);
      Object.assign(DOM.preview.style, {
        width: p.w + 'px', height: p.h + p.titleH + 'px',
        left: p.previewX + 'px', top: p.previewY + 'px'
      });
      DOM.preview.classList.add('vts-visible');
      return;
    }

    DOM.preview.classList.remove('vts-no-thumb');
    img.style.display = '';
    img.onload = () => {
      const p = calcPreviewLayout(img.naturalWidth / img.naturalHeight);
      Object.assign(DOM.preview.style, {
        width: p.w + 'px', height: p.h + p.titleH + 'px',
        left: p.previewX + 'px', top: p.previewY + 'px'
      });
      DOM.preview.classList.add('vts-visible');
    };
    img.src = tab.thumbnail;
  }

  // ── 8. Open / Close ──

  async function open() {
    if (S.visible) return close();
    if (S.busy) return;

    S.busy = true;
    S.altHeld = true;

    try {
      const { vts_settings: s = {} } = await chrome.storage.local.get('vts_settings');
      S.settings.thumbs = s.showThumbnailsInList ?? true;
      S.settings.preview = s.showSidePreview ?? true;

      S.tabs = await api.getTabs();
      if (!S.tabs.length) return;

      S.sel = S.active = Math.max(0, S.tabs.findIndex(t => t.active));

      let initialPreviewSize = null;
      if (S.settings.preview && S.tabs[S.sel]?.thumbnail) {
        initialPreviewSize = await getImageNaturalSize(S.tabs[S.sel].thumbnail);
      }

      calcLayout();
      DOM.create();
      render();
      positionList(initialPreviewSize);
      DOM.overlay.classList.add('vts-active');
      S.visible = true;
      S.initialized = false;
    } finally {
      S.busy = false;
    }
  }

  function close() {
    if (!S.visible) return;

    DOM.preview?.classList.remove('vts-visible');
    S.visible = S.busy = false;
    S.altHeld = S.initialized = false;

    if (DOM.list) DOM.list.style.cssText = '';
    DOM.overlay.classList.add('vts-fading-out');
    DOM.overlay.classList.remove('vts-active');

    setTimeout(() => { DOM.list.innerHTML = ''; DOM.destroy(); }, 150);
  }

  async function closeTab(id) {
    DOM.preview?.classList.remove('vts-visible');
    await api.send({ action: 'closeTab', tabId: id });

    const idx = S.tabs.findIndex(t => t.id === id);
    if (idx < 0) return;

    S.tabs.splice(idx, 1);
    if (!S.tabs.length) return close();

    if (S.sel >= S.tabs.length) S.sel = S.tabs.length - 1;
    else if (idx < S.sel) S.sel--;

    calcLayout();
    render();
  }

  // ── 9. Mouse events ──

  let hoverTimer, isLongPressing, lastHoveredItem = null;

  function onItemEvent(e) {
    if (!S.visible) return;

    if (e.type === 'mousemove') { S.initialized = true; clearTimeout(hoverTimer); return; }
    if (e.type === 'mouseover' && !S.initialized) return;

    const item = e.target.closest('.vts-tab-item');

    if (e.type === 'mouseover') {
      if (!item || item === lastHoveredItem) return;
      lastHoveredItem = item;
      const idx = +item.dataset.idx;
      const tab = S.tabs[idx];
      if (!tab) return;
      S.sel = idx;
      updateSel();
      return;
    }

    if (e.type === 'mouseout') {
      if (!item) return;
      const related = e.relatedTarget?.closest('.vts-tab-item');
      if (related === item) return;
      if (item === lastHoveredItem) lastHoveredItem = null;
      clearTimeout(hoverTimer);
      if (!related) { S.sel = S.active; updateSel(); }
      return;
    }

    if (!item) return;
    const idx = +item.dataset.idx;
    const tab = S.tabs[idx];
    if (!tab) return;
    const isClose = e.target.closest('.vts-close-btn');

    if (e.type === 'click') {
      if (isClose) { e.stopImmediatePropagation(); return closeTab(tab.id); }
      if (!isLongPressing) { close(); api.send({ action: 'switchTab', tabId: tab.id }); }
      isLongPressing = false;
    }

    if (e.type === 'mousedown' && e.button === 0 && !isClose) {
      hoverTimer = setTimeout(() => { isLongPressing = true; }, 400);
    }
  }

  // ── 10. Keyboard ──

  addListeners(document, 'keydown', e => {
    if (!S.visible) return;

    if (e.key === 'ArrowUp' || e.key === 'k') {
      S.sel = (S.sel - 1 + S.tabs.length) % S.tabs.length; updateSel(1);
    } else if (e.key === 'ArrowDown' || e.key === 'j') {
      S.sel = (S.sel + 1) % S.tabs.length; updateSel(1);
    } else if (e.key === 'Enter' && S.tabs[S.sel]) {
      close(); api.send({ action: 'switchTab', tabId: S.tabs[S.sel].id });
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && S.tabs[S.sel]) {
      closeTab(S.tabs[S.sel].id);
    } else if (e.key === 'Escape') {
      close();
    } else {
      return;
    }
    e.preventDefault();
  }, true);

  addListeners(document, 'keyup', e => {
    if (e.key === 'Alt' && S.visible && S.altHeld) {
      S.altHeld = false;
      if (S.tabs[S.sel]) api.send({ action: 'switchTab', tabId: S.tabs[S.sel].id });
      close();
    }
  }, true);

  // ── 11. Message listener ──

  chrome.runtime.onMessage.addListener((msg, _, send) => {
    if (msg.action === 'trigger') {
      if (S.visible) { S.sel = (S.sel + 1) % S.tabs.length; updateSel(1); }
      else open();
      send({ ok: true });
    }
    if (msg.action === 'navigateUp') {
      if (S.visible) { S.sel = (S.sel - 1 + S.tabs.length) % S.tabs.length; updateSel(1); }
      else open();
      send({ ok: true });
    }
    return true;
  });
})();
