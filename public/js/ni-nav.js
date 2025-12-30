const navLinks = [
  { key: 'home', href: '/ni/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/ni/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'inss', href: '/ni/inss/', label: 'INSS / Deducciones', icon: '🛡️' },
  { key: 'aguinaldo', href: '/ni/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/ni/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveNiNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/ni/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/ni';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createNiNav(activeKey = resolveNiNavKey()) {
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

export function injectNiNav(target, activeKey = resolveNiNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createNiNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountNiNav(targetSelector = '#niNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveNiNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectNiNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountNiNav('[data-ni-nav], #niNav');
  });
}
