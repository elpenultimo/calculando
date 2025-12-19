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
        title: 'Calculadora IVA México (beta)',
        description:
          'Plantilla inicial para cálculo de IVA en México. Resultado referencial y pendiente de tasas oficiales.',
        canonical: 'https://calculando.cl/mx/iva/',
        ogTitle: 'Calculadora IVA México (beta)',
        ogDescription:
          'Prueba la experiencia de cálculo de IVA pensada para México. Cálculo real pendiente.',
        ogUrl: 'https://calculando.cl/mx/iva/',
        twitterTitle: 'IVA México – Calculadora beta',
        twitterDescription:
          'Vista previa de la calculadora de IVA para México. Próximamente cálculo con tasa 16%.',
      },
    },
    sueldo: {
      path: '/mx/sueldo-liquido/',
      seo: {
        title: 'Sueldo neto México – Calculadora rápida',
        description:
          'Calcula sueldo neto estimado en México considerando ISR e IMSS a partir de tu sueldo bruto mensual en MXN.',
        canonical: 'https://calculando.cl/mx/sueldo-liquido/',
        ogTitle: 'Calculadora sueldo neto México',
        ogDescription:
          'Ingresa tu sueldo bruto mensual y obtén ISR, IMSS y sueldo líquido estimado para México.',
        ogUrl: 'https://calculando.cl/mx/sueldo-liquido/',
        twitterTitle: 'Sueldo neto MX – Calculadora',
        twitterDescription:
          'Herramienta para estimar sueldo líquido en México con descuentos de ISR e IMSS.',
      },
    },
  },
};

export default mxConfig;
