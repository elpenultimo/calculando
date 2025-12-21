export function createMXNavigation(activeKey = 'home') {
  const header = document.createElement('header');
  header.className = 'mx-navigation';

  const logoBlock = document.createElement('a');
  logoBlock.href = '/mx/';
  logoBlock.className = 'logo-block';
  logoBlock.setAttribute('aria-label', 'Ir al inicio de Calculando México');

  const logoMark = document.createElement('div');
  logoMark.className = 'logo-mark';
  logoMark.textContent = 'C';

  const logoText = document.createElement('div');
  logoText.className = 'logo-text';

  const logoTitle = document.createElement('strong');
  logoTitle.textContent = 'Calculando México';

  const logoSubtitle = document.createElement('span');
  logoSubtitle.textContent = 'Calculadoras en pesos MXN';

  logoText.appendChild(logoTitle);
  logoText.appendChild(logoSubtitle);
  logoBlock.appendChild(logoMark);
  logoBlock.appendChild(logoText);

  const navContainer = document.createElement('nav');
  navContainer.className = 'tool-nav';

  const links = [
    { key: 'home', href: '/mx/', label: 'Inicio MX', icon: '🏠' },
    { key: 'sueldo-neto', href: '/mx/sueldo-neto/', label: 'Sueldo neto', icon: '💸' },
    { key: 'aguinaldo', href: '/mx/aguinaldo/', label: 'Aguinaldo', icon: '🎁' },
    { key: 'vacaciones', href: '/mx/vacaciones/', label: 'Vacaciones', icon: '🏖️' },
    { key: 'ptu', href: '/mx/ptu/', label: 'PTU', icon: '📊' },
    { key: 'finiquito', href: '/mx/finiquito/', label: 'Finiquito', icon: '📄' },
    { key: 'iva', href: '/mx/iva/', label: 'IVA 16%', icon: '🧮' },
  ];

  links.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.className = 'tool-tab';
    anchor.dataset.page = link.key;
    anchor.innerHTML = `<span>${link.icon}</span> ${link.label}`;
    if (link.key === activeKey) {
      anchor.classList.add('tool-tab-active');
      anchor.setAttribute('aria-current', 'page');
    }
    navContainer.appendChild(anchor);
  });

  const themeToggle = document.createElement('button');
  themeToggle.id = 'themeToggle';
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = `
    <span class="theme-toggle-icon" id="themeIcon">🌙</span>
    <span id="themeLabel">Modo oscuro</span>
  `;

  header.appendChild(logoBlock);
  header.appendChild(navContainer);
  header.appendChild(themeToggle);

  return header;
}
