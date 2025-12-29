const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'public');
const baseUrls = [
  { file: 'sitemap-tucalculo.xml', baseUrl: 'https://www.tucalculo.com' },
  { file: 'sitemap-calculando.xml', baseUrl: 'https://www.calculando.cl' }
];

const ignoredRoots = new Set([
  'api',
  'css',
  'js',
  'node_modules',
  'src',
  '.git',
  '.github',
  '.next',
  'app',
  'public',
  'blog'
]);

const HOME_ROUTE = { path: '/', priority: 1.0, changefreq: 'daily' };

function hasIndex(dirPath) {
  return fs.existsSync(path.join(dirPath, 'index.html'));
}

function isCountryDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const hasAdditionalHtml = entries.some(
    (entry) => entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html'
  );
  const hasSubdirectories = entries.some((entry) => entry.isDirectory());

  return hasIndex(dirPath) && (hasAdditionalHtml || hasSubdirectories);
}

function collectCountryRoutes(dirName, dirPath) {
  const routes = [];
  if (!hasIndex(dirPath)) return routes;

  routes.push({ path: `/${dirName}/`, priority: 0.8, changefreq: 'weekly' });

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDirPath = path.join(dirPath, entry.name);
      if (hasIndex(subDirPath)) {
        routes.push({ path: `/${dirName}/${entry.name}/`, priority: 0.7, changefreq: 'weekly' });
      }
    }
  }

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
      routes.push({ path: `/${dirName}/${entry.name}`, priority: 0.6, changefreq: 'monthly' });
    }
  }

  return routes;
}

function collectGlobalDirectoryRoutes(dirName, dirPath) {
  const routes = [];
  if (hasIndex(dirPath)) {
    routes.push({ path: `/${dirName}/`, priority: 0.7, changefreq: 'weekly' });
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
      routes.push({ path: `/${dirName}/${entry.name}`, priority: 0.6, changefreq: 'monthly' });
    }
  }
  return routes;
}

function collectRoutes() {
  const routes = [];
  if (hasIndex(rootDir)) {
    routes.push(HOME_ROUTE);
  }

  const rootEntries = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignoredRoots.has(entry.name));

  for (const entry of rootEntries) {
    const dirName = entry.name;
    const dirPath = path.join(rootDir, dirName);

    const countryRoutes = isCountryDirectory(dirPath)
      ? collectCountryRoutes(dirName, dirPath)
      : collectGlobalDirectoryRoutes(dirName, dirPath);

    routes.push(...countryRoutes);
  }

  const rootFiles = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith('.html') &&
        entry.name !== 'index.html'
    );

  for (const file of rootFiles) {
    routes.push({ path: `/${file.name}`, priority: 0.6, changefreq: 'monthly' });
  }

  return routes;
}

function buildSitemap(baseUrl, routes) {
  const body = routes
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((route) => {
      const priority = route.priority.toFixed(1);
      return [
        '  <url>',
        `    <loc>${baseUrl}${route.path}</loc>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const routes = collectRoutes();

  for (const { file, baseUrl } of baseUrls) {
    const xml = buildSitemap(baseUrl, routes);
    fs.writeFileSync(path.join(outputDir, file), xml, 'utf8');
  }

  console.log(`Generated ${routes.length} routes for each sitemap.`);
}

main();
