import { headers } from "next/headers";
import type { MetadataRoute } from "next";

// Ajusta esta lista si quieres excluir algo puntual
const IGNORED_DIRS = new Set([
  "api",
  "blog",
  "css",
  "js",
  "img",
  "fonts",
]);

function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const host = headers().get("host");
  return `https://${host}`;
}

function getCountryCodes(): string[] {
  // IMPORTANTE: esta lista DEBE coincidir con las carpetas reales
  // según tu repo: cl, mx, ar, co, es, us, etc.
  return [
    "cl","mx","ar","co","pe","es","us","br","uy","py","bo","ec","ve",
    "cr","gt","sv","hn","ni","pa","do","cu","gq"
  ];
}

// Ajusta estas rutas a las calculadoras que EXISTEN en cada país
const CALCULATORS = [
  "sueldo-liquido",
  "iva",
  "boleta",
  "uf",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  const urls: MetadataRoute.Sitemap = [];

  // Home global
  urls.push({
    url: `${siteUrl}/`,
    lastModified,
    changeFrequency: "daily",
    priority: 1,
  });

  // Países + calculadoras
  getCountryCodes().forEach((code) => {
    // Home país
    urls.push({
      url: `${siteUrl}/${code}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Calculadoras por país
    CALCULATORS.forEach((calc) => {
      urls.push({
        url: `${siteUrl}/${code}/${calc}/`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  return urls;
}
