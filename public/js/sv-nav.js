const navLinks = [
  { key: 'home', href: '/sv/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/sv/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'isss-afp', href: '/sv/isss-afp/', label: 'ISSS / AFP', icon: '🛡️' },
  { key: 'aguinaldo', href: '/sv/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/sv/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveSvNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/sv/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/sv';

  const directMatch = navLinks.find(link => link.href.replace(/\/$/, '') === normalizedPath);
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createSvNav(activeKey = resolveSvNavKey()) {
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

export function injectSvNav(target, activeKey = resolveSvNavKey()) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createSvNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountSvNav(targetSelector = '#svNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string' ? document.querySelectorAll(targetSelector) : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveSvNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectSvNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountSvNav('[data-sv-nav], #svNav');
  });
}
