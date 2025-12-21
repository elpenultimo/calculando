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
      path: '/mx/sueldo-neto/',
      seo: {
        title: 'Sueldo neto México – Calculadora rápida',
        description:
          'Calcula sueldo neto estimado en México considerando ISR e IMSS a partir de tu sueldo bruto mensual en MXN.',
        canonical: 'https://calculando.cl/mx/sueldo-neto/',
        ogTitle: 'Calculadora sueldo neto México',
        ogDescription:
          'Ingresa tu sueldo bruto mensual y obtén ISR, IMSS y sueldo neto estimado para México.',
        ogUrl: 'https://calculando.cl/mx/sueldo-neto/',
        twitterTitle: 'Sueldo neto MX – Calculadora',
        twitterDescription:
          'Herramienta para estimar sueldo neto en México con descuentos de ISR e IMSS.',
      },
    },
    aguinaldo: {
      path: '/mx/aguinaldo/',
      seo: {
        title: 'Calculadora de Aguinaldo en México 2026 | Calculando.mx',
        description:
          'Calcula tu aguinaldo en México de forma rápida. Estima aguinaldo bruto y proporcional según tu sueldo y días trabajados.',
        canonical: 'https://calculando.cl/mx/aguinaldo/',
        ogTitle: 'Calculadora de Aguinaldo en México',
        ogDescription:
          'Ingresa sueldo mensual, días trabajados y días de aguinaldo para ver montos brutos y proporcionales en MXN.',
        ogUrl: 'https://calculando.cl/mx/aguinaldo/',
        twitterTitle: 'Calculadora de Aguinaldo MX',
        twitterDescription:
          'Calcula aguinaldo bruto y proporcional en pesos mexicanos en segundos.',
      },
    },
  },
};

export default mxConfig;
