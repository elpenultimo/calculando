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

  function redirectForRegion(region, options = {}) {
    const { replace = true, keepQuery = '' } = options;

    const go = (url) => {
      if (replace) window.location.replace(url);
      else window.location.href = url;
    };

    if (region === 'cl') {
      // Chile vive en calculando.cl (dominio distinto)
      // Si quieres conservar querystring (sin force), lo concatenamos.
      const url = keepQuery ? `https://calculando.cl/?${keepQuery}` : 'https://calculando.cl/';
      go(url);
      return true;
    }

    if (region === 'mx') {
      // México vive en /mx/ dentro de tucalculo.com
      const base = '/mx/';
      const url = keepQuery ? `${base}?${keepQuery}` : base;
      go(url);
      return true;
    }

    return false;
  }

  function handleRootCountryRedirect() {
    if (!isTuCalculoHost()) return;

    // 1) Soporte para pruebas rápidas:
    // tucalculo.com/?force=mx  o  tucalculo.com/?force=cl
    const params = new URLSearchParams(window.location.search);
    const force = params.get('force');

    if (force === 'mx' || force === 'cl') {
      storeRegion(force);
      params.delete('force');
      const remainingQuery = params.toString();

      // Ojo: para CL redirige a calculando.cl
      redirectForRegion(force, { replace: true, keepQuery: remainingQuery });
      return;
    }

    // 2) Solo actuamos en la raíz "/"
    const normalizedPath = normalizePath(window.location.pathname || '/');
    if (normalizedPath !== '/') return;

    // 3) Si hay preferencia guardada, redirigir sin mostrar selector
    const stored = getStoredRegion();
    if (stored) {
      redirectForRegion(stored, { replace: true });
      return;
    }

    // 4) Primera visita: mostrar selector
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
    link.style.cssText =
      'font-size:13px;color:var(--primary);text-decoration:underline;';

    header.appendChild(link);
  }

  window.tcCountry = {
    isTuCalculoHost,
    getStoredRegion,
    storeRegion,
    redirectForRegion,
    handleRootCountryRedirect,
    addChangeCountryLink,
  };
})();
