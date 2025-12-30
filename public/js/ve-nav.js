const navLinks = [
  { key: 'home', href: '/ve/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/ve/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'descuentos', href: '/ve/descuentos/', label: 'Descuentos', icon: '⚖️' },
  { key: 'utilidades', href: '/ve/utilidades/', label: 'Utilidades', icon: '🎁' },
  { key: 'bono', href: '/ve/bono-vacacional/', label: 'Bono vacacional', icon: '🌴' },
  { key: 'prestaciones', href: '/ve/prestaciones/', label: 'Prestaciones', icon: '🛡️' },
];

export function resolveVeNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/ve/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/ve';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createVeNav(activeKey = resolveVeNavKey()) {
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

export function injectVeNav(target, activeKey = resolveVeNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createVeNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountVeNav(targetSelector = '#veNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveVeNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectVeNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountVeNav('[data-ve-nav], #veNav');
  });
}
