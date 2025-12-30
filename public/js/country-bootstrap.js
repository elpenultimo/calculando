import { getCountryFromPath } from '/src/countryResolver.js';
import { getConfigByCountry } from '/src/countryConfig.js';

function upsertMeta(selectorKey, selectorValue, attr, content) {
  if (!content) return;
  let tag = document.head.querySelector(`${selectorKey}="${selectorValue}"`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(selectorKey, selectorValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attr, content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function applySeo(seo, siteName = 'Calculando') {
  if (!seo) return;
  if (seo.title) {
    document.title = seo.title;
  }

  upsertMeta('name', 'description', 'content', seo.description);
  upsertMeta('property', 'og:title', 'content', seo.ogTitle || seo.title);
  upsertMeta('property', 'og:description', 'content', seo.ogDescription || seo.description);
  upsertMeta('property', 'og:url', 'content', seo.ogUrl || seo.canonical);
  upsertMeta('property', 'og:type', 'content', 'website');
  upsertMeta('property', 'og:site_name', 'content', siteName);

  upsertMeta('name', 'twitter:card', 'content', 'summary');
  upsertMeta('name', 'twitter:title', 'content', seo.twitterTitle || seo.title);
  upsertMeta('name', 'twitter:description', 'content', seo.twitterDescription || seo.description);

  upsertLink('canonical', seo.canonical);
}

export function bootstrapPage(pageKey = 'home') {
  const countryCode = getCountryFromPath(window.location.pathname);
  const config = getConfigByCountry(countryCode) || getConfigByCountry('cl');
  const pageConfig = config?.pages?.[pageKey] || config?.pages?.home;

  document.documentElement.setAttribute('data-country', countryCode);

  if (pageConfig?.seo) {
    applySeo(pageConfig.seo, config?.name);
  }
}
