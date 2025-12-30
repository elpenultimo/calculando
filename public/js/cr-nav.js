const navLinks = [
  { key: 'home', href: '/cr/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/cr/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'ccss', href: '/cr/ccss/', label: 'CCSS / Deducciones', icon: '🛡️' },
  { key: 'aguinaldo', href: '/cr/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
  { key: 'inflacion', href: '/cr/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveCrNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/cr/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/cr';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createCrNav(activeKey = resolveCrNavKey()) {
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

export function injectCrNav(target, activeKey = resolveCrNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createCrNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountCrNav(targetSelector = '#crNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveCrNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectCrNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountCrNav('[data-cr-nav], #crNav');
  });
}
