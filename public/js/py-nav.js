const navLinks = [
  { key: 'home', href: '/py/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/py/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'ips', href: '/py/ips/', label: 'IPS / Descuentos', icon: '🛡️' },
  { key: 'aguinaldo', href: '/py/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/py/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolvePyNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/py/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/py';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createPyNav(activeKey = resolvePyNavKey()) {
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

export function injectPyNav(target, activeKey = resolvePyNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createPyNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountPyNav(targetSelector = '#pyNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolvePyNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectPyNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountPyNav('[data-py-nav], #pyNav');
  });
}
