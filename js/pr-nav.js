const navLinks = [
  { key: 'home', href: '/pr/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/pr/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'horas', href: '/pr/horas-extra/', label: 'Horas extra', icon: '⏱️' },
  { key: 'ivu', href: '/pr/ivu/', label: 'IVU (Sales Tax)', icon: '🧾' },
  { key: 'propina', href: '/pr/propina/', label: 'Propina', icon: '🍽️' },
  { key: 'inflacion', href: '/pr/inflacion/', label: 'Inflación', icon: '📈' },
];

export function resolvePrNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/pr/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/pr';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createPrNav(activeKey = resolvePrNavKey()) {
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

export function injectPrNav(target, activeKey = resolvePrNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createPrNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountPrNav(targetSelector = '#prNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolvePrNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectPrNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountPrNav('[data-pr-nav], #prNav');
  });
}
