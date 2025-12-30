const navLinks = [
  { key: 'home', href: '/us/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/us/salario-neto/', label: 'Salario neto', icon: '💰' },
  { key: 'hourly', href: '/us/hourly-yearly/', label: 'Hourly ↔ Yearly', icon: '⏱️' },
  { key: 'presupuesto', href: '/us/presupuesto/', label: 'Presupuesto', icon: '🧮' },
  { key: 'propina', href: '/us/tip/', label: 'Propinas (Tip)', icon: '🍽️' },
  { key: 'inflacion', href: '/us/inflacion/', label: 'Inflación', icon: '📈' },
];

export function resolveUsNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/us/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/us';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createUsNav(activeKey = resolveUsNavKey()) {
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

export function injectUsNav(target, activeKey = resolveUsNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createUsNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountUsNav(targetSelector = '#usNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveUsNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectUsNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountUsNav('[data-us-nav], #usNav');
  });
}
