const navLinks = [
  { key: 'home', href: '/ec/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/ec/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'iess', href: '/ec/iess/', label: 'IESS / Aportes', icon: '🛡️' },
  { key: 'decimo13', href: '/ec/decimo-tercero/', label: 'Décimo tercero', icon: '🎁' },
  { key: 'decimo14', href: '/ec/decimo-cuarto/', label: 'Décimo cuarto', icon: '📅' },
  { key: 'liquidacion', href: '/ec/liquidacion/', label: 'Liquidación', icon: '📄' },
];

export function resolveEcNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/ec/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/ec';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createEcNav(activeKey = resolveEcNavKey()) {
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

export function injectEcNav(target, activeKey = resolveEcNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createEcNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountEcNav(targetSelector = '#ecNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveEcNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectEcNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountEcNav('[data-ec-nav], #ecNav');
  });
}
