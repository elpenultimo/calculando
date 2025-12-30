const navLinks = [
  { key: 'home', href: '/hn/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/hn/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'ihss', href: '/hn/ihss/', label: 'IHSS / Deducciones', icon: '🛡️' },
  { key: 'aguinaldo', href: '/hn/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/hn/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveHnNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/hn/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/hn';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createHnNav(activeKey = resolveHnNavKey()) {
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

export function injectHnNav(target, activeKey = resolveHnNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createHnNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountHnNav(targetSelector = '#hnNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveHnNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectHnNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountHnNav('[data-hn-nav], #hnNav');
  });
}
