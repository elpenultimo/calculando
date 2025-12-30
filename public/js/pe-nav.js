const navLinks = [
  { key: 'home', href: '/pe/', label: 'Inicio', icon: '🏠' },
  { key: 'sueldo', href: '/pe/sueldo-neto/', label: 'Sueldo neto', icon: '💰' },
  { key: 'quinta', href: '/pe/quinta-categoria/', label: 'Quinta categoría', icon: '📈' },
  { key: 'gratificacion', href: '/pe/gratificacion/', label: 'Gratificación', icon: '🎁' },
  { key: 'cts', href: '/pe/cts/', label: 'CTS', icon: '🏦' },
  { key: 'inflacion', href: '/pe/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolvePeNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/pe/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/pe';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createPeNav(activeKey = resolvePeNavKey()) {
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

export function injectPeNav(target, activeKey = resolvePeNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createPeNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountPeNav(targetSelector = '#peNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolvePeNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectPeNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountPeNav('[data-pe-nav], #peNav');
  });
}
