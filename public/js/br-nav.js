const navLinks = [
  { key: 'home', href: '/br/', label: 'Início', icon: '🏠' },
  { key: 'salario', href: '/br/salario-liquido/', label: 'Salário líquido', icon: '💰' },
  { key: 'inss', href: '/br/inss/', label: 'INSS / Descontos', icon: '🧾' },
  { key: 'decimo', href: '/br/decimo-terceiro/', label: '13º salário', icon: '🎁' },
  { key: 'inflacao', href: '/br/inflacao/', label: 'Inflação', icon: '📊' },
];

export function resolveBrNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/br/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/br';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createBrNav(activeKey = resolveBrNavKey()) {
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

export function injectBrNav(target, activeKey = resolveBrNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createBrNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountBrNav(targetSelector = '#brNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveBrNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectBrNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountBrNav('[data-br-nav], #brNav');
  });
}
