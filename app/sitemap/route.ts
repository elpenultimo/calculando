import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CANONICAL_DOMAIN = "https://www.tucalculo.com";
const CHANGEFREQ_PRIORITY: Record<string, number> = {
  daily: 3,
  weekly: 2,
  monthly: 1,
};

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

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function normalizeLoc(loc: string) {
  const url = new URL(loc, CANONICAL_DOMAIN);
  let pathname = url.pathname.replace(/\/$/, "");
  if (pathname === "") pathname = "/";
  return `${CANONICAL_DOMAIN}${pathname === "/" ? "" : pathname}`;
}

function pickStrongerUrl(
  current: { loc: string; changefreq: string; priority: string },
  candidate: { loc: string; changefreq: string; priority: string }
) {
  const currentPriority = Number.parseFloat(current.priority);
  const candidatePriority = Number.parseFloat(candidate.priority);
  if (candidatePriority > currentPriority) return candidate;
  if (candidatePriority < currentPriority) return current;

  const currentFreq = CHANGEFREQ_PRIORITY[current.changefreq] ?? 0;
  const candidateFreq = CHANGEFREQ_PRIORITY[candidate.changefreq] ?? 0;
  if (candidateFreq > currentFreq) return candidate;
  return current;
}

export async function GET(req: Request) {
  const baseUrl = CANONICAL_DOMAIN;

  const urls: { loc: string; changefreq: string; priority: string }[] = [];

  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, "public");

  /* ===============================
     PÁGINAS PRINCIPALES
  =============================== */
  urls.push(
    { loc: `${baseUrl}`, changefreq: "daily", priority: "1.0" },
    { loc: `${baseUrl}/blog`, changefreq: "weekly", priority: "0.8" },
    { loc: `${baseUrl}/sueldo-liquido`, changefreq: "weekly", priority: "0.9" },
    { loc: `${baseUrl}/boleta`, changefreq: "weekly", priority: "0.9" },
    { loc: `${baseUrl}/uf`, changefreq: "daily", priority: "0.9" },
    { loc: `${baseUrl}/iva`, changefreq: "weekly", priority: "0.9" }
  );

  /* ===============================
     BLOG: /public/blog/*.html
     - excluye index.html
     - excluye probando.html
  =============================== */
  const publicBlogDir = path.join(publicDir, "blog");
  if (fs.existsSync(publicBlogDir)) {
    const blogFiles = fs
      .readdirSync(publicBlogDir, { withFileTypes: true })
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .filter((n) => n.endsWith(".html"))
      .filter((n) => n !== "index.html")
      .filter((n) => n !== "probando.html")
      .sort((a, b) => a.localeCompare(b));

    for (const file of blogFiles) {
      urls.push({
        loc: `${baseUrl}/blog/${file}`,
        changefreq: "monthly",
        priority: "0.6",
      });
    }
  }

  /* ===============================
     PÁGINAS ESTÁTICAS EN /public
     (no países)
  =============================== */
  const publicStaticDirs = [
    "sueldo-liquido",
    "uf",
    "boleta",
    "iva",
  ];

  for (const dir of publicStaticDirs) {
    const fullPath = path.join(publicDir, dir);
    if (hasIndexHtml(fullPath)) {
      urls.push({
        loc: `${baseUrl}/${dir}`,
        changefreq: "weekly",
        priority: "0.9",
      });
    }
  }

  /* ===============================
     PAÍSES + CALCULADORAS
  =============================== */
  const countries = Array.from(
    new Set([
      ...listDirs(repoRoot).filter(isCountryFolder),
      ...listDirs(publicDir).filter(isCountryFolder),
    ])
  ).sort();

  for (const cc of countries) {
    urls.push({
      loc: `${baseUrl}/${cc}`,
      changefreq: "weekly",
      priority: "0.8",
    });

    const candidates = [path.join(repoRoot, cc), path.join(publicDir, cc)];
    for (const basePath of candidates) {
      if (!fs.existsSync(basePath)) continue;

      for (const sub of listDirs(basePath)) {
        const subPath = path.join(basePath, sub);
        if (hasIndexHtml(subPath)) {
          urls.push({
            loc: `${baseUrl}/${cc}/${sub}`,
            changefreq: "weekly",
            priority: "0.7",
          });
        }
      }
    }
  }

  const dedupedUrls = Array.from(
    urls.reduce((acc, entry) => {
      const normalizedLoc = normalizeLoc(entry.loc);
      const normalizedEntry = { ...entry, loc: normalizedLoc };
      const existing = acc.get(normalizedLoc);
      if (!existing) {
        acc.set(normalizedLoc, normalizedEntry);
        return acc;
      }
      acc.set(normalizedLoc, pickStrongerUrl(existing, normalizedEntry));
      return acc;
    }, new Map<string, { loc: string; changefreq: string; priority: string }>())
  )
    .map(([, value]) => value)
    .sort((a, b) => a.loc.localeCompare(b.loc));

  /* ===============================
     XML OUTPUT
  =============================== */
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    dedupedUrls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${xmlEscape(u.loc)}</loc>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
