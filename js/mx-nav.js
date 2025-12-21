export function createMxNav(activeKey = 'home') {
  const nav = document.createElement('nav');
  nav.className = 'tool-nav';
  nav.setAttribute('aria-label', 'Navegación de calculadoras México');

  const links = [
    { key: 'home', href: '/mx/', label: 'Inicio MX', icon: '🏠' },
    { key: 'iva', href: '/mx/iva/', label: 'IVA', icon: '🧮' },
    { key: 'sueldo', href: '/mx/sueldo-neto/', label: 'Sueldo neto', icon: '💸' },
    { key: 'aguinaldo', href: '/mx/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
    { key: 'vacaciones', href: '/mx/vacaciones/', label: 'Vacaciones', icon: '🏖️' },
    { key: 'ptu', href: '/mx/ptu/', label: 'PTU', icon: '📊' },
    { key: 'finiquito', href: '/mx/finiquito/', label: 'Finiquito', icon: '📄' },
  ];

  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = 'tool-tab';
    a.dataset.page = link.key;
    a.innerHTML = `<span>${link.icon}</span> ${link.label}`;
    if (activeKey === link.key) {
      a.classList.add('tool-tab-active');
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });

  return nav;
}

export function injectMxNav(target, activeKey = 'home') {
  const container =
    typeof target === 'string' ? document.querySelector(target) : target;

  if (!container) return null;

  container.innerHTML = '';
  const nav = createMxNav(activeKey);
  container.appendChild(nav);
  return nav;
}
