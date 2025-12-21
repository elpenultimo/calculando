import { createMXNavigation } from '/components/mx/MXNavigation.js';

function resolveTarget(target) {
  if (target) {
    return typeof target === 'string'
      ? document.querySelector(target)
      : target;
  }
  return document.querySelector('main') || document.body;
}

export function renderMXLayout({ activePage = 'home', target } = {}) {
  const container = resolveTarget(target);
  if (!container) return null;

  const existingNav = container.querySelector('.mx-navigation');
  if (existingNav) {
    existingNav.remove();
  }

  const nav = createMXNavigation(activePage);

  if (container.firstChild) {
    container.insertBefore(nav, container.firstChild);
  } else {
    container.appendChild(nav);
  }

  if (typeof window !== 'undefined' && window.setupThemeToggle) {
    window.setupThemeToggle();
  }

  return nav;
}
