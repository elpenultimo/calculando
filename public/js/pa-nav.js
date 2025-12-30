const navLinks = [
  { key: 'home', href: '/pa/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/pa/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'descuentos', href: '/pa/descuentos/', label: 'Descuentos', icon: '⚖️' },
  { key: 'decimo', href: '/pa/decimo-tercer-mes/', label: 'Décimo tercer mes', icon: '🎁' },
  { key: 'prestaciones', href: '/pa/prestaciones/', label: 'Prestaciones', icon: '🛡️' },
];

export function resolvePaNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/pa/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/pa';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createPaNav(activeKey = resolvePaNavKey()) {
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

export function injectPaNav(target, activeKey = resolvePaNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createPaNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountPaNav(targetSelector = '#paNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolvePaNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectPaNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountPaNav('[data-pa-nav], #paNav');
  });
}
