export const mxConfig = {
  code: 'mx',
  name: 'Calculando México',
  basePath: '/mx',
  pages: {
    home: {
      path: '/mx',
      seo: {
        title: 'Calculando México – Calculadoras y guías (beta)',
        description:
          'Versión preliminar de Calculando para México: navegación y calculadoras en construcción. Pruebas de IVA, sueldo y más.',
        canonical: 'https://calculando.cl/mx/',
        ogTitle: 'Calculando México – Beta',
        ogDescription:
          'Explora la versión beta de Calculando enfocada en herramientas para México.',
        ogUrl: 'https://calculando.cl/mx/',
        twitterTitle: 'Calculando México – Beta',
        twitterDescription:
          'Base técnica para calculadoras de México. IVA y sueldos próximamente.',
      },
    },
    iva: {
      path: '/mx/iva/',
      seo: {
        title: 'Calculadora de IVA (16%) México',
        description:
          'Calcula IVA 16% en México: convierte precio con IVA a sin IVA y viceversa, y obtén el monto de IVA.',
        canonical: 'https://calculando.cl/mx/iva/',
        ogTitle: 'Calculadora de IVA (16%) México',
        ogDescription:
          'Convierte precios sin IVA a con IVA (16%) y al revés, además del monto de IVA.',
        ogUrl: 'https://calculando.cl/mx/iva/',
        twitterTitle: 'Calculadora de IVA (16%) México',
        twitterDescription:
          'Calcula precios netos, brutos y el IVA al 16% en México con una sola herramienta.',
      },
    },
  },
};

export default mxConfig;
