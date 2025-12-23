const navLinks = [
  { key: 'home', href: '/ar/', label: 'Inicio', icon: '🏠' },
  { key: 'sueldo', href: '/ar/sueldo-neto/', label: 'Sueldo neto', icon: '💰' },
  { key: 'ganancias', href: '/ar/ganancias/', label: 'Ganancias', icon: '📈' },
  { key: 'aguinaldo', href: '/ar/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/ar/inflacion/', label: 'Inflación', icon: '📊' },
  { key: 'dolar', href: '/ar/dolar/', label: 'Dólar', icon: '💵' },
];

export function resolveArNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/ar/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/ar';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createArNav(activeKey = resolveArNavKey()) {
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

export function injectArNav(target, activeKey = resolveArNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createArNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountArNav(targetSelector = '#arNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveArNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectArNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountArNav('[data-ar-nav], #arNav');
  });
}
