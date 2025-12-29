(function applyCountryAccent() {
  const REGION_KEY = 'tc_region';
  const COUNTRY_ACCENTS = {
    cl: '#2F6FED',
    mx: '#2E7D32',
    ar: '#5DADE2',
    bo: '#D32F2F',
    br: '#1E8E5A',
    co: '#F2C94C',
    pe: '#D32F2F',
    py: '#2F6FED',
    uy: '#5DADE2',
    ec: '#F2C94C',
    ve: '#F2C94C',
    pa: '#2F6FED',
    cr: '#D32F2F',
    ni: '#5DADE2',
    hn: '#5DADE2',
    sv: '#2F6FED',
    gt: '#2F6FED',
    do: '#2F6FED',
    pr: '#D32F2F',
    cu: '#D32F2F',
    us: '#2F6FED',
    es: '#D32F2F',
    gq: '#2E7D32',
  };

  const rootEl = document.documentElement;
  if (!rootEl) return;

  const hexToRgba = (hex, alpha) => {
    if (typeof hex !== 'string') return null;
    const normalized = hex.startsWith('#') ? hex.slice(1) : hex;
    if (normalized.length !== 6) return null;

    const intVal = parseInt(normalized, 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  let region = null;
  try {
    region = localStorage.getItem(REGION_KEY);
  } catch (err) {
    return;
  }

  if (!region) return;

  rootEl.setAttribute('data-country', region);

  const accent = COUNTRY_ACCENTS[region];
  if (!accent) return;

  rootEl.style.setProperty('--country-accent', accent);
  const softAccent = hexToRgba(accent, 0.16);
  if (softAccent) {
    rootEl.style.setProperty('--country-accent-soft', softAccent);
  }

  // Manual test: in console set localStorage.tc_region = 'mx' and reload to see the accent.
})();

(function setupThemeToggle() {
  if (window.tcCountry?.addChangeCountryLink) {
    window.tcCountry.addChangeCountryLink();
  }

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const rootEl = document.documentElement;

  if (!themeToggle || !themeIcon || !themeLabel) return;

  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Modo oscuro';
    } else {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Modo claro';
    }
  }

  const stored = localStorage.getItem('calculando-theme');
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('calculando-theme', next);
  });
})();

(function loadCountryFlagScript() {
  const FLAG_SCRIPT_SRC = '/js/country-flag.js';

  const head = document.head || document.documentElement;
  if (!head) return;

  const alreadyLoaded = head.querySelector(`script[src="${FLAG_SCRIPT_SRC}"]`);
  if (alreadyLoaded) return;

  const script = document.createElement('script');
  script.src = FLAG_SCRIPT_SRC;
  script.defer = true;
  head.appendChild(script);
})();
