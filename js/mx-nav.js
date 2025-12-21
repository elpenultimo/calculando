export function createMxNav(activeKey = null) {
  const scrollWrapper = document.createElement('div');
  scrollWrapper.className = 'mx-nav-wrapper';

  const nav = document.createElement('div');
  nav.className = 'tool-nav mx-nav';

  const links = [
    { key: 'home', href: '/mx/', label: 'Inicio', icon: '🏠' },
    { key: 'iva', href: '/mx/iva/', label: 'IVA', icon: '🧮' },
    { key: 'sueldo', href: '/mx/sueldo-neto/', label: 'Sueldo neto', icon: '💸' },
    { key: 'aguinaldo', href: '/mx/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
    { key: 'ptu', href: '/mx/ptu/', label: 'PTU', icon: '📊' },
    { key: 'finiquito', href: '/mx/finiquito/', label: 'Finiquito', icon: '📄' },
    { key: 'vacaciones', href: '/mx/vacaciones/', label: 'Vacaciones', icon: '🏖️' },
  ];

  const pathname =
    typeof window !== 'undefined' && window.location?.pathname
      ? window.location.pathname
      : '';

  const isAliasMatch = (linkKey, path) => {
    if (linkKey === 'sueldo') {
      return path.startsWith('/mx/sueldo-liquido/');
    }
    return false;
  };

  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'tool-tab';
    a.dataset.page = link.key;
    a.innerHTML = `<span>${link.icon}</span> ${link.label}`;

    const isHome = link.key === 'home';
    const pathMatches = isHome
      ? pathname === '/mx/' || pathname === '/mx'
      : pathname.startsWith(link.href) || isAliasMatch(link.key, pathname);

    if ((activeKey && activeKey === link.key) || (!activeKey && pathMatches)) {
      a.classList.add('tool-tab-active');
    }

    nav.appendChild(a);
  });

  scrollWrapper.appendChild(nav);
  return scrollWrapper;
}

export function injectMxNav(target, activeKey = null) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createMxNav(activeKey);
  container.appendChild(nav);
  return nav;
}
