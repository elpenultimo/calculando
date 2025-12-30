const navLinks = [
  { key: 'home', href: '/co/', label: 'Inicio', icon: '🏠' },
  { key: 'sueldo', href: '/co/sueldo-neto/', label: 'Sueldo neto', icon: '💰' },
  { key: 'retencion', href: '/co/retencion/', label: 'Retención', icon: '📑' },
  { key: 'prima', href: '/co/prima/', label: 'Prima', icon: '🎁' },
  { key: 'inflacion', href: '/co/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveCoNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/co/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/co';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createCoNav(activeKey = resolveCoNavKey()) {
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

export function injectCoNav(target, activeKey = resolveCoNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createCoNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountCoNav(targetSelector = '#coNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveCoNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectCoNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountCoNav('[data-co-nav], #coNav');
  });
}
