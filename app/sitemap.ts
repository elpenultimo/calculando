import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

function isCountryFolder(name: string) {
  return /^[a-z]{2}$/.test(name);
}

function listDirs(fullPath: string) {
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function hasIndexHtml(dirPath: string) {
  return fs.existsSync(path.join(dirPath, "index.html"));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const h = headers();

  // Vercel/Next suelen pasar host aquí
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${proto}://${host}`.replace(/\/$/, "");

  const items: MetadataRoute.Sitemap = [];

  // ✅ páginas principales
  items.push(
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/sueldo-liquido/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/boleta/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/uf/`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/iva/`, changeFrequency: "weekly", priority: 0.9 }
  );

  // ✅ países desde repo raíz y/o public
  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, "public");

  const countries = Array.from(
    new Set([
      ...listDirs(repoRoot).filter(isCountryFolder),
      ...listDirs(publicDir).filter(isCountryFolder),
    ])
  ).sort();

  for (const cc of countries) {
    items.push({
      url: `${baseUrl}/${cc}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const candidates = [path.join(repoRoot, cc), path.join(publicDir, cc)];
    for (const basePath of candidates) {
      if (!fs.existsSync(basePath)) continue;

      for (const sub of listDirs(basePath)) {
        const subPath = path.join(basePath, sub);
        if (hasIndexHtml(subPath)) {
          items.push({
            url: `${baseUrl}/${cc}/${sub}/`,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  }

  return items;
}
