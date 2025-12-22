const navLinks = [
  { key: 'home', href: '/mx/', label: 'Inicio', icon: '🏠' },
  { key: 'iva', href: '/mx/iva/', label: 'IVA', icon: '🧮' },
  { key: 'sueldo', href: '/mx/sueldo-neto/', label: 'Sueldo neto', icon: '💸' },
  { key: 'aguinaldo', href: '/mx/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'ptu', href: '/mx/ptu/', label: 'PTU', icon: '📊' },
  { key: 'finiquito', href: '/mx/finiquito/', label: 'Finiquito', icon: '📄' },
  { key: 'vacaciones', href: '/mx/vacaciones/', label: 'Vacaciones', icon: '🏖️' },
];

export function resolveMxNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/mx/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/mx';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  if (normalizedPath.startsWith('/mx/sueldo-liquido')) return 'sueldo';

  return 'home';
}

export function createMxNav(activeKey = resolveMxNavKey()) {
  const nav = document.createElement('div');
  nav.className = 'tool-nav';

  navLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'tool-tab';
    a.dataset.page = link.key;
    a.innerHTML = `<span>${link.icon}</span> ${link.label}`;
    if (activeKey === link.key) {
      a.classList.add('tool-tab-active');
    }
    nav.appendChild(a);
  });

  return nav;
}

export function injectMxNav(target, activeKey = resolveMxNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createMxNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountMxNav(targetSelector = '#mxNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveMxNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectMxNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountMxNav('[data-mx-nav], #mxNav');
  });
}
