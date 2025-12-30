const navLinks = [
  { key: 'home', href: '/cu/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/cu/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'cambio', href: '/cu/cambio/', label: 'Conversión CUP ↔ USD', icon: '💱' },
  { key: 'aguinaldo', href: '/cu/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/cu/inflacion/', label: 'Inflación', icon: '📊' },
  { key: 'presupuesto', href: '/cu/presupuesto/', label: 'Presupuesto', icon: '🧮' },
];

export function resolveCuNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/cu/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/cu';

  const directMatch = navLinks.find(link => link.href.replace(/\/$/, '') === normalizedPath);
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createCuNav(activeKey = resolveCuNavKey()) {
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

export function injectCuNav(target, activeKey = resolveCuNavKey()) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createCuNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountCuNav(targetSelector = '#cuNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string' ? document.querySelectorAll(targetSelector) : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveCuNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectCuNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountCuNav('[data-cu-nav], #cuNav');
  });
}
