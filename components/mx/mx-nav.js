const NAV_LINKS = [
  { key: 'home', href: '/mx/', label: 'Inicio MX', icon: '🏠' },
  { key: 'iva', href: '/mx/iva/', label: 'IVA México', icon: '🧮' },
  { key: 'sueldo', href: '/mx/sueldo-neto/', label: 'Sueldo neto MX', icon: '💸' },
  { key: 'aguinaldo', href: '/mx/aguinaldo/', label: 'Aguinaldo MX', icon: '🎁' },
  { key: 'finiquito', href: '/mx/finiquito/', label: 'Finiquito', icon: '📄' },
  { key: 'ptu', href: '/mx/ptu/', label: 'PTU', icon: '📊' },
  { key: 'vacaciones', href: '/mx/vacaciones/', label: 'Vacaciones MX', icon: '🏖️' },
];

const normalizePath = (path) => {
  if (!path) return '/';
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
};

const resolveActiveKey = (pathname = '/') => {
  const normalizedPath = normalizePath(pathname);
  const match = NAV_LINKS.find((link) => {
    const normalizedHref = normalizePath(link.href);
    return normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref);
  });
  return match?.key ?? 'home';
};

export function createMxNav(activeKey) {
  const nav = document.createElement('div');
  nav.className = 'tool-nav mx-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navegación de calculadoras México');

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const currentKey = activeKey || resolveActiveKey(currentPath);

  NAV_LINKS.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'tool-tab';
    a.dataset.page = link.key;
    a.innerHTML = `<span>${link.icon}</span> ${link.label}`;

    if (link.key === currentKey) {
      a.classList.add('tool-tab-active');
      a.setAttribute('aria-current', 'page');
    }

    nav.appendChild(a);
  });

  return nav;
}

export function injectMxNav(target, activeKey) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createMxNav(activeKey);
  container.appendChild(nav);
  return nav;
}
