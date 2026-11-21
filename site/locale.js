export let language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
export const tr = (zh, en) => (language === 'en' ? en : zh);

const copy = [...document.querySelectorAll('[data-en]')].map(node => [node, node.textContent]);
const attributes = ['aria-label', 'alt', 'title'].flatMap(key => {
  const data = key === 'aria-label' ? 'ariaEn' : key === 'alt' ? 'altEn' : 'titleEn';
  const selector = key === 'alt' ? '[data-alt-en]' : key === 'aria-label' ? '[data-aria-en]' : '[data-title-en]';
  return [...document.querySelectorAll(selector)]
    .map(node => [node, key, node.getAttribute(key), node.dataset[data]]);
});
const switches = [...document.querySelectorAll('[data-language]')];

export function applyLocale() {
  document.documentElement.lang = tr('zh-CN', 'en');
  for (const [node, zh] of copy) node.textContent = tr(zh, node.dataset.en);
  for (const [node, key, zh, en] of attributes) node.setAttribute(key, tr(zh, en));
  for (const button of switches) {
    button.textContent = tr('EN', '中文');
    button.setAttribute('aria-label', tr('Switch to English', '切换到中文'));
  }
}

function toggle() {
  language = tr('en', 'zh');
  try {
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url.href);
  } catch {
    /* Text still switches in the offline file. */
  }
  applyLocale();
  window.dispatchEvent(new Event('paper-language-change'));
}

for (const button of switches) button.addEventListener('click', toggle);
applyLocale();
