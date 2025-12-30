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

  function isoFromPathname() {
    const first = (window.location.pathname.split('/')[1] || '').trim().toLowerCase();
    // Países típicos: 2 letras. Si algún día usas /pais/mexico, esto no se activa.
    if (/^[a-z]{2}$/.test(first)) return first;
    return '';
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

  let lastIso = '';

  function resolveIso() {
    const attrIso = normalizeCountry(root.getAttribute('data-country'));
    const pathIso = normalizeCountry(isoFromPathname());

    // Si hay iso en path, es la fuente más “real” del país actual.
    if (pathIso) return pathIso;

    // Si no hay iso en path, cae al atributo (caso calculando.cl raíz, etc.)
    return attrIso;
  }

  function renderFlag() {
    const iso = resolveIso();
    if (!iso) return;

    // Evita re-render innecesario y “parpadeos”
    if (iso === lastIso && document.getElementById('countryFlag')) return;
    lastIso = iso;

    const container = ensureContainer();
    if (!container) return;

    container.innerHTML = '';

    const img = document.createElement('img');
    img.src = `https://flagcdn.com/24x18/${iso}.png`;
    img.srcset = `https://flagcdn.com/48x36/${iso}.png 2x`;
    img.alt = 'Bandera';
    img.loading = 'lazy';
    img.decoding = 'async';

    container.appendChild(img);
  }

  function hookHistory() {
    // Re-render cuando cambie la URL sin recargar
    const _pushState = history.pushState;
    const _replaceState = history.replaceState;

    history.pushState = function () {
      const ret = _pushState.apply(this, arguments);
      queueMicrotask(renderFlag);
      return ret;
    };

    history.replaceState = function () {
      const ret = _replaceState.apply(this, arguments);
      queueMicrotask(renderFlag);
      return ret;
    };

    window.addEventListener('popstate', () => renderFlag());
  }

  function watchDataCountry() {
    // Si alguien actualiza <html data-country="...">, re-renderiza
    const obs = new MutationObserver(() => renderFlag());
    obs.observe(root, { attributes: true, attributeFilter: ['data-country'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hookHistory();
      watchDataCountry();
      renderFlag();
    });
  } else {
    hookHistory();
    watchDataCountry();
    renderFlag();
  }
})();
