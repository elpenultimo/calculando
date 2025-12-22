(function setupThemeToggle() {
  if (window.tcCountry?.addChangeCountryLink) {
    window.tcCountry.addChangeCountryLink();
  }

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const rootEl = document.documentElement;

  if (!themeToggle || !themeIcon || !themeLabel) return;

  function applyTheme(theme) {
    rootEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Modo oscuro';
    } else {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Modo claro';
    }
  }

  const stored = localStorage.getItem('calculando-theme');
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
  } else {
    applyTheme('dark');
  }

  themeToggle.addEventListener('click', () => {
    const current = rootEl.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('calculando-theme', next);
  });
})();
