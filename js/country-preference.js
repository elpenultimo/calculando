(function initCountryPreference() {
  const REGION_KEY = 'tc_region';
  const SUPPORTED_HOSTS = ['tucalculo.com', 'www.tucalculo.com'];

  function isTuCalculoHost() {
    return SUPPORTED_HOSTS.includes(window.location.hostname);
  }

  function normalizePath(pathname) {
    if (!pathname) return '/';
    return pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  }

  function getStoredRegion() {
    try {
      return localStorage.getItem(REGION_KEY);
    } catch (err) {
      return null;
    }
  }

  function storeRegion(region) {
    try {
      localStorage.setItem(REGION_KEY, region);
    } catch (err) {
      /* ignore localStorage write errors */
    }
  }

  function redirectForRegion(region) {
    if (region === 'cl') {
      window.location.href = 'https://calculando.cl/';
      return true;
    }

    if (region === 'mx') {
      window.location.href = '/mx/';
      return true;
    }

    return false;
  }

  function handleRootCountryRedirect() {
    if (!isTuCalculoHost()) return;

    const normalizedPath = normalizePath(window.location.pathname || '/');
    if (normalizedPath !== '/') return;

    const stored = getStoredRegion();
    if (stored) {
      redirectForRegion(stored);
      return;
    }

    window.location.replace('/seleccionar-pais/');
  }

  function addChangeCountryLink() {
    if (!isTuCalculoHost()) return;

    const header = document.querySelector('header');
    if (!header || header.querySelector('#changeCountryLink')) return;

    const link = document.createElement('a');
    link.id = 'changeCountryLink';
    link.href = '/seleccionar-pais/';
    link.textContent = 'Cambiar país';
    link.style.cssText = 'font-size:13px;color:var(--primary);text-decoration:underline;';

    header.appendChild(link);
  }

  // Nota: Si se requiere GEOIP real más adelante, la regla debe vivirse en Cloudflare
  // (Redirect Rules/Workers). Este archivo solo maneja preferencias locales del usuario.

  window.tcCountry = {
    isTuCalculoHost,
    getStoredRegion,
    storeRegion,
    redirectForRegion,
    handleRootCountryRedirect,
    addChangeCountryLink,
  };
})();
