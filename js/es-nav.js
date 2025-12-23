const navLinks = [
  { key: 'home', href: '/es/', label: 'Inicio', icon: '🏠' },
  { key: 'salario', href: '/es/salario-neto/', label: 'Salario neto', icon: '💶' },
  { key: 'nomina', href: '/es/nomina/', label: 'Nómina / Retenciones', icon: '📄' },
  { key: 'iva', href: '/es/iva/', label: 'IVA', icon: '🧾' },
  { key: 'irpf', href: '/es/irpf/', label: 'IRPF (estimado)', icon: '📊' },
  { key: 'pagas', href: '/es/pagas-extra/', label: 'Pagas extra', icon: '🎁' },
];

export function resolveEsNavKey(pathname = '') {
  if (!pathname) {
    pathname = typeof window !== 'undefined' ? window.location.pathname : '/es/';
  }

  const normalizedPath = pathname.replace(/\/$/, '') || '/es';

  const directMatch = navLinks.find(
    link => link.href.replace(/\/$/, '') === normalizedPath,
  );
  if (directMatch) return directMatch.key;

  return 'home';
}

export function createEsNav(activeKey = resolveEsNavKey()) {
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

export function injectEsNav(target, activeKey = resolveEsNavKey()) {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createEsNav(activeKey);
  container.appendChild(nav);
  return nav;
}

export function autoMountEsNav(targetSelector = '#esNav') {
  if (typeof document === 'undefined') return null;

  const targets = Array.from(
    typeof targetSelector === 'string'
      ? document.querySelectorAll(targetSelector)
      : [targetSelector],
  ).filter(Boolean);

  const activeKey = resolveEsNavKey();

  let mounted = null;
  targets.forEach(target => {
    const nav = injectEsNav(target, activeKey);
    if (nav && !mounted) mounted = nav;
  });

  return mounted;
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    autoMountEsNav('[data-es-nav], #esNav');
  });
}
