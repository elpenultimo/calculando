const navLinks = [
  { key: 'home', href: '/bo/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/bo/salario-liquido/', label: 'Salario líquido', icon: '💰' },
  { key: 'afp', href: '/bo/afp/', label: 'AFP / Descuentos', icon: '🏦' },
  { key: 'aguinaldo', href: '/bo/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/bo/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveBoNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/bo/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/bo';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createBoNav(activeKey = resolveBoNavKey()) {
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

export function injectBoNav(target, activeKey = resolveBoNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createBoNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountBoNav(targetSelector = '#boNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveBoNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectBoNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountBoNav('[data-bo-nav], #boNav');
  });
}
