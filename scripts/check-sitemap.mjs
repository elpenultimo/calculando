const sitemapUrl = process.env.SITEMAP_URL ?? "http://localhost:3000/sitemap.xml";

const response = await fetch(sitemapUrl, {
  headers: {
    Accept: "application/xml",
  },
});

if (!response.ok) {
  throw new Error(`Sitemap request failed: ${response.status} ${response.statusText}`);
}

const body = await response.text();
const lowerBody = body.toLowerCase();
const errors = [];

if (lowerBody.includes("<script")) {
  errors.push('Sitemap contains "<script".');
}

if (lowerBody.includes("chrome-extension://")) {
  errors.push('Sitemap contains "chrome-extension://".');
}

if (!lowerBody.includes("<urlset")) {
  errors.push('Sitemap missing "<urlset".');
}

if (!lowerBody.includes("<url>")) {
  errors.push('Sitemap missing "<url>".');
}

if (errors.length > 0) {
  throw new Error(errors.join(" "));
}

console.log(`Sitemap checks passed for ${sitemapUrl}`);
