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
    sueldoLiquido: {
      path: '/mx/sueldo-liquido',
      seo: {
        title: 'Calculadora de Sueldo Neto México 2026',
        description:
          'Calcula tu sueldo neto mensual en México: estimamos ISR, IMSS trabajador y total de descuentos a partir del sueldo bruto.',
        canonical: 'https://calculando.cl/mx/sueldo-liquido',
        ogTitle: 'Calculadora de Sueldo Neto en México',
        ogDescription:
          'Ingresa tu sueldo bruto y obtén ISR, IMSS y sueldo líquido estimado. Referencia rápida para 2026.',
        ogUrl: 'https://calculando.cl/mx/sueldo-liquido',
        twitterTitle: 'Sueldo Neto México 2026 – Calculadora',
        twitterDescription:
          'Herramienta rápida para estimar ISR e IMSS mensual y conocer tu sueldo neto en MXN.',
      },
    },
  },
};

export default mxConfig;
