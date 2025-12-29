/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // TuCalculo
      {
        source: "/sitemap.xml",
        has: [{ type: "host", value: "tucalculo.com" }],
        destination: "/sitemap-tucalculo.xml",
      },
      {
        source: "/sitemap.xml",
        has: [{ type: "host", value: "www.tucalculo.com" }],
        destination: "/sitemap-tucalculo.xml",
      },

      // Calculando
      {
        source: "/sitemap.xml",
        has: [{ type: "host", value: "calculando.cl" }],
        destination: "/sitemap-calculando.xml",
      },
      {
        source: "/sitemap.xml",
        has: [{ type: "host", value: "www.calculando.cl" }],
        destination: "/sitemap-calculando.xml",
      },
    ];
  },
};

module.exports = nextConfig;
