import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';
import type { MetadataRoute } from 'next';

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

type RouteEntry = {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
};

const LAST_MODIFIED = new Date();
const IGNORED_ROOT_DIRS = new Set([
  'api',
  'css',
  'js',
  'node_modules',
  'src',
  '.git',
  '.github',
  '.next',
  'app',
  'blog',
]);

function normalizeBaseUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;
  const sanitized = rawUrl.trim().replace(/^http:\/\//i, 'https://');
  return sanitized.replace(/\/+$/, '');
}

function resolveSiteUrl(): string {
  const envUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (envUrl) return envUrl;

  const host = headers().get('host');
  if (host) {
    return normalizeBaseUrl(`https://${host}`) || 'https://calculando.cl';
  }

  return 'https://calculando.cl';
}

function buildUrl(baseUrl: string, routePath: string) {
  const normalizedBase = normalizeBaseUrl(baseUrl) || '';
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${normalizedBase}${normalizedPath}`.replace(/([^:]\/)\+/g, '$1/');
}

function directoryHasIndex(dirPath: string) {
  return fs.existsSync(path.join(dirPath, 'index.html'));
}

function discoverCountryCodes(): string[] {
  const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory() && /^[a-z]{2}$/i.test(entry.name))
    .map(entry => entry.name)
    .sort();
}

function discoverCountryRoutes(countryCode: string): string[] {
  const routes: string[] = [];
  const basePath = path.join(process.cwd(), countryCode);
  if (!fs.existsSync(basePath)) return routes;

  if (directoryHasIndex(basePath)) {
    routes.push(`/${countryCode}/`);
  }

  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const dirPath = path.join(basePath, entry.name);
      if (directoryHasIndex(dirPath)) {
        routes.push(`/${countryCode}/${entry.name}/`);
      }
    }

    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
      const name = entry.name.replace(/\.html$/, '');
      routes.push(`/${countryCode}/${name}.html`);
    }
  });

  return routes;
}

function discoverGlobalRoutes(): string[] {
  const routes: string[] = [];
  const rootEntries = fs.readdirSync(process.cwd(), { withFileTypes: true });

  rootEntries.forEach(entry => {
    if (entry.isDirectory()) {
      if (/^[a-z]{2}$/i.test(entry.name)) return;
      if (IGNORED_ROOT_DIRS.has(entry.name)) return;

      const dirPath = path.join(process.cwd(), entry.name);
      if (directoryHasIndex(dirPath)) {
        routes.push(`/${entry.name}/`);
      }
    }

    if (entry.isFile() && entry.name.endsWith('.html')) {
      if (entry.name === 'index.html') return;
      routes.push(`/${entry.name}`);
    }
  });

  return routes;
}

function discoverBlogRoutes(includeBlog: boolean): { home?: string; posts: string[] } {
  const blogDir = path.join(process.cwd(), 'blog');
  const result: { home?: string; posts: string[] } = { posts: [] };

  if (!includeBlog || !fs.existsSync(blogDir)) return result;

  if (directoryHasIndex(blogDir)) {
    result.home = '/blog/';
  }

  const blogEntries = fs.readdirSync(blogDir, { withFileTypes: true });
  blogEntries.forEach(entry => {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
      result.posts.push(`/blog/${entry.name}`);
    }
  });

  return result;
}

function toRouteEntry(pathname: string, priority: number, changeFrequency: ChangeFrequency): RouteEntry {
  return { path: pathname, priority, changeFrequency };
}

function dedupe(entries: RouteEntry[]) {
  const byPath = new Map<string, RouteEntry>();
  entries.forEach(entry => {
    if (!byPath.has(entry.path)) {
      byPath.set(entry.path, entry);
    }
  });
  return Array.from(byPath.values());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl();
  const countryCodes = discoverCountryCodes();
  const includeBlog = /calculando/.test(siteUrl) || /calculando/.test(headers().get('host') || '');

  const entries: RouteEntry[] = [toRouteEntry('/', 1, 'daily')];

  discoverGlobalRoutes().forEach(route => {
    entries.push(toRouteEntry(route, 0.7, 'weekly'));
  });

  countryCodes.forEach(code => {
    const countryRoutes = discoverCountryRoutes(code);
    countryRoutes.forEach(route => {
      const isHome = route === `/${code}/` || route === `/${code}`;
      entries.push(toRouteEntry(route, isHome ? 0.8 : 0.7, 'weekly'));
    });
  });

  const blogRoutes = discoverBlogRoutes(includeBlog);
  if (blogRoutes.home) {
    entries.push(toRouteEntry(blogRoutes.home, 0.7, 'weekly'));
  }
  blogRoutes.posts.forEach(route => {
    entries.push(toRouteEntry(route, 0.6, 'monthly'));
  });

  return dedupe(entries).map(({ path: routePath, priority, changeFrequency }) => ({
    url: buildUrl(siteUrl, routePath),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
  }));
}
