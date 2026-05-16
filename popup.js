/**
 * popup.js - Settings popup v1.2.0
 */

const i18n = {
  zh: {
    thumbOn: 'O_O',
    thumbOff: '>_<',
    previewOn: 'O_O',
    previewOff: '>_<'
  },
  en: {
    thumbOn: 'O_O',
    thumbOff: '>_<',
    previewOn: 'O_O',
    previewOff: '>_<'
  }
};

const isInternal = url => url && ['chrome://', 'edge://', 'about:', 'chrome-extension://', 'file://'].some(p => url.startsWith(p));


let lang = 'zh';

async function init() {
  const { vts_settings: s = {}, vts_lang: l } = await chrome.storage.local.get(['vts_settings', 'vts_lang']);
  lang = l || (navigator.language.startsWith('zh') ? 'zh' : 'en');
  
  const optThumb = document.getElementById('optThumb');
  const optPreview = document.getElementById('optPreview');
  
  function applyState() {
    const hasThumb = s.showThumbnailsInList ?? true;
    const hasPreview = s.showSidePreview ?? true;
    optThumb.classList.toggle('on', hasThumb);
    optPreview.classList.toggle('on', hasPreview);
    optThumb.querySelector('.option-text').textContent = hasThumb ? i18n[lang].thumbOn : i18n[lang].thumbOff;
    optPreview.querySelector('.option-text').textContent = hasPreview ? i18n[lang].previewOn : i18n[lang].previewOff;
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && isInternal(tab.url)) {
    document.body.classList.add('unsupported');
    applyState();
    return;
  }
  
  function save() {
    chrome.storage.local.set({ vts_settings: s });
  }
  
  optThumb.onclick = () => {
    s.showThumbnailsInList = !(s.showThumbnailsInList ?? true);
    applyState(); save();
  };
  
  optPreview.onclick = () => {
    s.showSidePreview = !(s.showSidePreview ?? true);
    applyState(); save();
  };
  
  applyState();
}

init();
