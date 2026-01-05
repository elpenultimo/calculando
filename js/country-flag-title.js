const COUNTRY_MAP = {
  ar: { name: 'Argentina', iso2: 'AR' },
  bo: { name: 'Bolivia', iso2: 'BO' },
  br: { name: 'Brasil', iso2: 'BR' },
  cl: { name: 'Chile', iso2: 'CL' },
  co: { name: 'Colombia', iso2: 'CO' },
  ec: { name: 'Ecuador', iso2: 'EC' },
  py: { name: 'Paraguay', iso2: 'PY' },
  pe: { name: 'Perú', iso2: 'PE' },
  uy: { name: 'Uruguay', iso2: 'UY' },
  ve: { name: 'Venezuela', iso2: 'VE' },
  cr: { name: 'Costa Rica', iso2: 'CR' },
  sv: { name: 'El Salvador', iso2: 'SV' },
  gt: { name: 'Guatemala', iso2: 'GT' },
  hn: { name: 'Honduras', iso2: 'HN' },
  ni: { name: 'Nicaragua', iso2: 'NI' },
  pa: { name: 'Panamá', iso2: 'PA' },
  cu: { name: 'Cuba', iso2: 'CU' },
  do: { name: 'República Dominicana', iso2: 'DO' },
  pr: { name: 'Puerto Rico', iso2: 'PR' },
  us: { name: 'Estados Unidos', iso2: 'US' },
  mx: { name: 'México', iso2: 'MX' },
  es: { name: 'España', iso2: 'ES' },
  gq: { name: 'Guinea Ecuatorial', iso2: 'GQ' },
};

function isoToFlagEmoji(iso2) {
  const code = (iso2 || '').trim().toUpperCase();
  if (!/^([A-Z]{2})$/.test(code)) return '';
  return String.fromCodePoint(
    ...code.split('').map(letter => 127397 + letter.charCodeAt(0)),
  );
}

function normalizeSlug(slug) {
  if (!slug) return '';
  return slug.trim().toLowerCase();
}

function getCountrySlug() {
  const pathSlug = normalizeSlug(window.location.pathname.split('/')[1] || '');
  if (pathSlug && COUNTRY_MAP[pathSlug]) return pathSlug;

  const htmlSlug = normalizeSlug(
    document.documentElement?.getAttribute('data-country'),
  );
  if (htmlSlug && COUNTRY_MAP[htmlSlug]) return htmlSlug;

  return '';
}

export function createCountryFlagTitle(countryName, countryCode, label) {
  const container = document.createElement('span');
  container.className = 'country-flag-title';

  const flagEmoji = isoToFlagEmoji(countryCode);
  if (flagEmoji) {
    const flag = document.createElement('span');
    flag.className = 'country-flag-emoji';
    flag.setAttribute('aria-hidden', 'true');
    flag.textContent = flagEmoji;
    container.appendChild(flag);
  }

  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = countryName;
  container.appendChild(sr);

  const text = document.createElement('span');
  text.textContent = label || `Tu Cálculo ${countryName}`;

  if (flagEmoji) {
    const spacer = document.createTextNode(' ');
    container.appendChild(spacer);
  }

  container.appendChild(text);

  return container;
}

export function applyCountryTitle(selector = '.hero h1') {
  if (typeof document === 'undefined') return null;
  const heading = document.querySelector(selector);
  if (!heading) return null;

  const slug = getCountrySlug();
  const countryInfo = COUNTRY_MAP[slug] || null;
  const currentLabel = (heading.textContent || '').trim();
  const isTuCalculoHeading = /^Tu Cálculo/i.test(currentLabel);
  if (!isTuCalculoHeading) return null;
  const countryName = countryInfo?.name || currentLabel.replace(/^Tu Cálculo\s*/i, '').trim();
  const countryCode = countryInfo?.iso2 || slug || '';

  if (!countryName) return null;

  const node = createCountryFlagTitle(countryName, countryCode, currentLabel || undefined);

  heading.innerHTML = '';
  heading.appendChild(node);
  return heading;
}

function autoApplyCountryTitle() {
  applyCountryTitle('.hero h1');
}

if (typeof window !== 'undefined') {
  window.CountryFlagTitle = { createCountryFlagTitle, applyCountryTitle };
  window.addEventListener('DOMContentLoaded', autoApplyCountryTitle);
}
