const nextConfig = {
  async rewrites() {
    return [{ source: "/sitemap.xml", destination: "/sitemap" }];
  },
};

module.exports = nextConfig;
