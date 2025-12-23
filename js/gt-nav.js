const navLinks = [
  { key: 'home', href: '/gt/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/gt/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'igss', href: '/gt/igss/', label: 'IGSS / Descuentos', icon: '🛡️' },
  { key: 'aguinaldo', href: '/gt/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'bono14', href: '/gt/bono-14/', label: 'Bono 14', icon: '🎉' },
  { key: 'inflacion', href: '/gt/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveGtNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/gt/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/gt';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createGtNav(activeKey = resolveGtNavKey()) {
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

export function injectGtNav(target, activeKey = resolveGtNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createGtNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountGtNav(targetSelector = '#gtNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveGtNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectGtNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountGtNav('[data-gt-nav], #gtNav');
  });
}
