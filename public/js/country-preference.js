(function initCountryPreference() {
  const REGION_KEY = 'tc_region';
  const SUPPORTED_HOSTS = ['tucalculo.com', 'www.tucalculo.com'];

  const COUNTRIES = {
    ar: { name: 'Argentina', iso2: 'AR' },
    bo: { name: 'Bolivia', iso2: 'BO' },
    br: { name: 'Brasil', iso2: 'BR' },
    cl: { name: 'Chile', iso2: 'CL' },
    co: { name: 'Colombia', iso2: 'CO' },
    ec: { name: 'Ecuador', iso2: 'EC' },
    py: { name: 'Paraguay', iso2: 'PY' },
    pe: { name: 'Perú', iso2: 'PE' },
    uy: { name: 'Uruguay', iso2: 'UY' },
    ve: { name: 'Venezuela', iso2: 'VE' },
    cr: { name: 'Costa Rica', iso2: 'CR' },
    sv: { name: 'El Salvador', iso2: 'SV' },
    gt: { name: 'Guatemala', iso2: 'GT' },
    hn: { name: 'Honduras', iso2: 'HN' },
    ni: { name: 'Nicaragua', iso2: 'NI' },
    pa: { name: 'Panamá', iso2: 'PA' },
    cu: { name: 'Cuba', iso2: 'CU' },
    do: { name: 'República Dominicana', iso2: 'DO' },
    pr: { name: 'Puerto Rico', iso2: 'PR' },
    us: { name: 'Estados Unidos', iso2: 'US' },
    mx: { name: 'México', iso2: 'MX' },
    es: { name: 'España', iso2: 'ES' },
    gq: { name: 'Guinea Ecuatorial', iso2: 'GQ' },
  };

  function iso2ToFlagEmoji(iso2) {
    if (!iso2 || iso2.length !== 2) return '';
    const code = iso2.toUpperCase();
    const A = 0x1f1e6;
    const base = 'A'.charCodeAt(0);
    const first = code.charCodeAt(0) - base + A;
    const second = code.charCodeAt(1) - base + A;
    if (code.charCodeAt(0) < 65 || code.charCodeAt(0) > 90) return '';
    if (code.charCodeAt(1) < 65 || code.charCodeAt(1) > 90) return '';
    return String.fromCodePoint(first, second);
  }

  function getCountryBySlug(slug) {
    if (!slug) return null;
    return COUNTRIES[String(slug).toLowerCase()] || null;
  }

  function detectCountrySlug() {
    const pathSlug = (window.location.pathname.split('/')[1] || '').toLowerCase();
    if (getCountryBySlug(pathSlug)) return pathSlug;

    const attrSlug = (document.documentElement.getAttribute('data-country') || '').toLowerCase();
    if (getCountryBySlug(attrSlug)) return attrSlug;

    return '';
  }

  function renderCountryTitles() {
    const slug = detectCountrySlug();
    const country = getCountryBySlug(slug);
    const flag = country ? iso2ToFlagEmoji(country.iso2) : '';
    const defaultLabel = country ? `Tu Cálculo ${country.name}` : '';

    const targets = [
      ...document.querySelectorAll('header .logo-text strong'),
      ...document.querySelectorAll('.hero h1'),
    ];

    targets.forEach((target) => {
      if (!target) return;
      const fallbackText = target.textContent?.trim() || 'Tu Cálculo';
      const label = defaultLabel || fallbackText;

      target.innerHTML = '';

      if (flag) {
        const flagSpan = document.createElement('span');
        flagSpan.setAttribute('aria-hidden', 'true');
        flagSpan.textContent = flag;
        target.appendChild(flagSpan);

        target.appendChild(document.createTextNode(' '));
      }

      const textSpan = document.createElement('span');
      textSpan.textContent = label;
      target.appendChild(textSpan);
    });
  }

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

    if (region === 'br') {
      window.location.href = '/br/';
      return true;
    }

    if (region === 'py') {
      window.location.href = '/py/';
      return true;
    }

    if (region === 'uy') {
      window.location.href = '/uy/';
      return true;
    }

    if (region === 'ec') {
      window.location.href = '/ec/';
      return true;
    }

    if (region === 've') {
      window.location.href = '/ve/';
      return true;
    }

    if (region === 'pa') {
      window.location.href = '/pa/';
      return true;
    }

    if (region === 'cr') {
      window.location.href = '/cr/';
      return true;
    }

    if (region === 'gq') {
      window.location.href = '/gq/';
      return true;
    }

    if (region === 'ni') {
      window.location.href = '/ni/';
      return true;
    }

    if (region === 'hn') {
      window.location.href = '/hn/';
      return true;
    }

    if (region === 'sv') {
      window.location.href = '/sv/';
      return true;
    }

    if (region === 'pr') {
      window.location.href = '/pr/';
      return true;
    }

    if (region === 'es') {
      window.location.href = '/es/';
      return true;
    }

    if (region === 'cu') {
      window.location.href = '/cu/';
      return true;
    }

    if (region === 'gt') {
      window.location.href = '/gt/';
      return true;
    }

    if (region === 'do') {
      window.location.href = '/do/';
      return true;
    }

    if (region === 'us') {
      window.location.href = '/us/';
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
      'font-size:13px;color:var(--country-accent);text-decoration:underline;text-decoration-color:var(--country-accent);';

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

  function loadFaqInjector() {
    if (window.__faqInjectorLoaded) return;
    window.__faqInjectorLoaded = true;

    const script = document.createElement('script');
    script.src = '/js/faq-injector.js';
    script.defer = true;
    script.crossOrigin = 'anonymous';
    (document.head || document.body || document.documentElement).appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderCountryTitles();
      loadFaqInjector();
    });
  } else {
    renderCountryTitles();
    loadFaqInjector();
  }
})();
