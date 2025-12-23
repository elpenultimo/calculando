const navLinks = [
  { key: 'home', href: '/do/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/do/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'tss', href: '/do/tss/', label: 'TSS / Descuentos', icon: '🛡️' },
  { key: 'regalia', href: '/do/regalia/', label: 'Regalía Pascual', icon: '🎁' },
  { key: 'vacaciones', href: '/do/vacaciones/', label: 'Vacaciones', icon: '🌴' },
  { key: 'inflacion', href: '/do/inflacion/', label: 'Inflación', icon: '📊' },
];

export function resolveDoNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/do/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/do';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createDoNav(activeKey = resolveDoNavKey()) {
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

export function injectDoNav(target, activeKey = resolveDoNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createDoNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountDoNav(targetSelector = '#doNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveDoNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectDoNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountDoNav('[data-do-nav], #doNav');
  });
}
