const navLinks = [
  { key: 'home', href: '/uy/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/uy/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'descuentos', href: '/uy/descuentos/', label: 'Descuentos', icon: '⚖️' },
  { key: 'aguinaldo', href: '/uy/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'horas', href: '/uy/horas-extra/', label: 'Horas extra', icon: '⏱️' },
  { key: 'indemnizacion', href: '/uy/indemnizacion/', label: 'Indemnización', icon: '🛡️' },
];

export function resolveUyNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/uy/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/uy';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createUyNav(activeKey = resolveUyNavKey()) {
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

export function injectUyNav(target, activeKey = resolveUyNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createUyNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountUyNav(targetSelector = '#uyNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveUyNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectUyNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountUyNav('[data-uy-nav], #uyNav');
  });
}
