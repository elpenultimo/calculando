const navLinks = [
  { key: 'home', href: '/gq/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/gq/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'descuentos', href: '/gq/descuentos/', label: 'Descuentos', icon: '⚖️' },
  { key: 'iva', href: '/gq/iva/', label: 'IVA (ref)', icon: '🧾' },
  { key: 'cambio', href: '/gq/eur-xaf/', label: 'EUR ↔ XAF', icon: '💱' },
  { key: 'aguinaldo', href: '/gq/aguinaldo/', label: 'Aguinaldo / Bono', icon: '🎁' },
];

export function resolveGqNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/gq/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/gq';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createGqNav(activeKey = resolveGqNavKey()) {
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

export function injectGqNav(target, activeKey = resolveGqNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createGqNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountGqNav(targetSelector = '#gqNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveGqNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectGqNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountGqNav('[data-gq-nav], #gqNav');
  });
}
