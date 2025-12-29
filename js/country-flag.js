(function mountCountryFlag() {
  const root = document.documentElement;
  if (!root) return;

  function normalizeCountry(code) {
    if (!code) return '';
    const normalized = String(code).trim().toLowerCase();
    if (!normalized) return '';
    if (normalized === 'uk') return 'gb';
    return normalized;
  }

  function ensureContainer() {
    const existing = document.getElementById('countryFlag');
    if (existing) return existing;

    const logoBlock = document.querySelector('.logo-block');
    if (!logoBlock) return null;

    const span = document.createElement('span');
    span.id = 'countryFlag';
    span.className = 'country-flag';
    span.setAttribute('aria-hidden', 'true');

    const logoMark = logoBlock.querySelector('.logo-mark');
    if (logoMark) {
      logoMark.insertAdjacentElement('afterend', span);
    } else {
      logoBlock.prepend(span);
    }

    return span;
  }

  function renderFlag() {
    const iso = normalizeCountry(root.dataset.country);
    if (!iso) return;

    const container = ensureContainer();
    if (!container) return;

    const img = document.createElement('img');
    img.src = `https://flagcdn.com/24x18/${iso}.png`;
    img.srcset = `https://flagcdn.com/48x36/${iso}.png 2x`;
    img.alt = 'Bandera';
    img.loading = 'lazy';
    img.decoding = 'async';

    container.innerHTML = '';
    container.appendChild(img);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFlag);
  } else {
    renderFlag();
  }
})();
