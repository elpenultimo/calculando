(function initCountryPreference() {
  const COUNTRY_COOKIE = 'tc_country';
  const ONE_YEAR_SECONDS = 31_536_000;
  const SUPPORTED_HOSTS = ['tucalculo.com', 'www.tucalculo.com'];

  function isTuCalculoHost() {
    const host = window.location.hostname || '';
    return SUPPORTED_HOSTS.some((value) => host.includes(value));
  }

  function normalizePath(pathname) {
    if (!pathname) return '/';
    return pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  }

  function parseCookieValue(cookieString) {
    return cookieString.split('=')[1]?.trim() ?? '';
  }

  function getCookieValue(name) {
    const cookies = document.cookie?.split(';') || [];
    for (const cookie of cookies) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(`${name}=`)) {
        return parseCookieValue(trimmed);
      }
    }

    return '';
  }

  function storeCountry(country) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${COUNTRY_COOKIE}=${country}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax${secure}`;
  }

  function getStoredCountry() {
    const value = (getCookieValue(COUNTRY_COOKIE) || '').toLowerCase();
    return value === 'cl' || value === 'mx' ? value : '';
  }

  function redirectForCountry(country) {
    if (country === 'cl') {
      window.location.href = '/';
      return true;
    }

    if (country === 'mx') {
      window.location.href = '/mx/';
      return true;
    }

    return false;
  }

  async function detectCountryFromHeaders() {
    try {
      const response = await fetch('/api/country', { credentials: 'same-origin' });
      if (!response.ok) return '';

      const data = await response.json();
      const headerCountry = (data.country || '').toLowerCase();
      return headerCountry === 'mx' || headerCountry === 'cl' ? headerCountry : '';
    } catch (err) {
      return '';
    }
  }

  function handleForceParam() {
    if (!isTuCalculoHost()) return false;

    try {
      const url = new URL(window.location.href);
      const force = (url.searchParams.get('force') || '').toLowerCase();
      if (force === 'mx' || force === 'cl') {
        storeCountry(force);
        redirectForCountry(force);
        return true;
      }
    } catch (err) {
      /* ignore URL parsing errors */
    }

    return false;
  }

  async function handleRootCountryRedirect() {
    if (!isTuCalculoHost()) return;

    if (handleForceParam()) return;

    const normalizedPath = normalizePath(window.location.pathname || '/');
    if (normalizedPath !== '/') return;

    const stored = getStoredCountry();
    if (stored) {
      redirectForCountry(stored);
      return;
    }

    const detected = await detectCountryFromHeaders();
    if (detected) {
      storeCountry(detected);
      redirectForCountry(detected);
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

  window.tcCountry = {
    isTuCalculoHost,
    getStoredCountry,
    storeCountry,
    redirectForCountry,
    handleRootCountryRedirect,
    addChangeCountryLink,
    // Backward compatibility with previous API
    getStoredRegion: getStoredCountry,
    storeRegion: storeCountry,
    redirectForRegion: redirectForCountry,
  };

  handleForceParam();
})();
