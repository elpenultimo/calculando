const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.tucalculo.com";
const PUBLIC_DIR = path.join(process.cwd(), "public");

function isHtmlPage(filePath) {
  const stat = fs.statSync(filePath);
  if (!stat.isFile() || !filePath.endsWith(".html")) return false;

  const content = fs.readFileSync(filePath, "utf8");
  return /<html[\s>]/i.test(content);
}

function formatRouteFromHtml(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const normalized = relativePath.split(path.sep).join("/");

  if (normalized.endsWith("index.html")) {
    const dir = normalized.slice(0, -"index.html".length);
    const withLeading = dir.startsWith("/") ? dir : `/${dir}`;
    return withLeading.replace(/\/+/g, "/").replace(/\/?$/, "/");
  }

  return `/${normalized}`.replace(/\/+/g, "/");
}

function collectHtmlFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectHtmlFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".html") && isHtmlPage(fullPath)) {
        return [fullPath];
      }

      return [];
    });
}

function buildSitemapEntries(htmlFiles) {
  return Array.from(new Set(htmlFiles.map(formatRouteFromHtml))).sort();
}

function buildXml(urls) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((route) => `  <url><loc>${BASE_URL}${route}</loc></url>`),
    "</urlset>",
    "",
  ];

  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`[sitemap] public directory not found at ${PUBLIC_DIR}`);
    process.exit(1);
  }

  const htmlFiles = collectHtmlFiles(PUBLIC_DIR);
  const routes = buildSitemapEntries(htmlFiles);
  const xml = buildXml(routes);
  const outputPath = path.join(PUBLIC_DIR, "sitemap.xml");

  fs.writeFileSync(outputPath, xml, "utf8");
  console.log(`[sitemap] generated ${routes.length} urls -> ${outputPath}`);
}

main();
