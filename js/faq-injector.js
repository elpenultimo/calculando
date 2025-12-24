(function faqInjector() {
  const COUNTRY_CODES = [
    'mx',
    'cl',
    'br',
    'py',
    'uy',
    'ec',
    've',
    'pa',
    'cr',
    'gq',
    'ni',
    'hn',
    'sv',
    'pr',
    'es',
    'cu',
    'gt',
    'do',
    'us',
    'bo',
    'co',
    'ar',
    'pe',
  ];

  const COUNTRY_NAMES = {
    mx: 'México',
    cl: 'Chile',
    br: 'Brasil',
    py: 'Paraguay',
    uy: 'Uruguay',
    ec: 'Ecuador',
    ve: 'Venezuela',
    pa: 'Panamá',
    cr: 'Costa Rica',
    gq: 'Guinea Ecuatorial',
    ni: 'Nicaragua',
    hn: 'Honduras',
    sv: 'El Salvador',
    pr: 'Puerto Rico',
    es: 'España',
    cu: 'Cuba',
    gt: 'Guatemala',
    do: 'República Dominicana',
    us: 'Estados Unidos',
    bo: 'Bolivia',
    co: 'Colombia',
    ar: 'Argentina',
    pe: 'Perú',
  };

  const FAQ_CONTENT = {
    salary: {
      title: 'el salario neto',
      items: [
        {
          q: '¿Qué descuentos se consideran?',
          a: 'Se usa un porcentaje general de impuestos y cotizaciones para aproximar los descuentos habituales. Puede variar según tablas vigentes, topes y beneficios específicos de cada contrato.',
        },
        {
          q: '¿Cómo agrego bonos o comisiones?',
          a: 'Puedes sumarlos al monto bruto o ajustarlos en el campo de otros descuentos. El efecto real depende de cómo tu empleador los grava o cotiza, por lo que puede variar.',
        },
        {
          q: '¿Por qué puede cambiar el neto entre meses?',
          a: 'Las retenciones dependen de tramos, topes y días trabajados. El resultado aquí es referencial y puede diferir de la nómina oficial si hay subsidios, licencias o beneficios particulares.',
        },
        {
          q: '¿Sirve para jornadas parciales o variables?',
          a: 'Sí como aproximación proporcional. Cotizaciones mínimas, aportes obligatorios o incentivos específicos pueden modificar el neto real.',
        },
        {
          q: '¿Incluye aportes del empleador?',
          a: 'No. Solo muestra descuentos estimados del trabajador. Las contribuciones patronales y beneficios adicionales no se suman al neto mostrado.',
        },
        {
          q: '¿Puedo usarlo para trámites oficiales?',
          a: 'Es un cálculo informativo. Las cifras oficiales dependen de la legislación y de tu situación personal; valida siempre con RR.HH., tu contador o la entidad correspondiente.',
        },
      ],
    },
    inflation: {
      title: 'el cálculo de inflación',
      items: [
        {
          q: '¿Cómo se calcula la variación?',
          a: 'Se compara el índice o precio inicial versus el final para obtener la variación porcentual. El resultado es referencial y puede diferir de cifras oficiales del IPC.',
        },
        {
          q: '¿Qué período usa el cálculo?',
          a: 'Depende de los valores que ingreses (mensuales o anuales). Los ajustes reales consideran la serie oficial y pueden variar según la base o el mes de referencia.',
        },
        {
          q: '¿Sirve para reajustar salarios o arriendos?',
          a: 'Entrega una guía rápida de variación. Las condiciones contractuales, topes y normativa local pueden cambiar el reajuste efectivo.',
        },
        {
          q: '¿Qué pasa si el índice cambia de base?',
          a: 'Algunas series se reescalan o corrigen. El cálculo mostrado no ajusta automáticamente esas modificaciones, por lo que el resultado puede variar.',
        },
        {
          q: '¿Puedo proyectar inflación futura?',
          a: 'No. Solo calcula con los valores ingresados; no predice cifras oficiales ni decisiones de política monetaria.',
        },
      ],
    },
    aguinaldo: {
      title: 'el aguinaldo o gratificación',
      items: [
        {
          q: '¿Sobre qué base se estima el monto?',
          a: 'Se toma la remuneración ingresada y se prorratea según el período trabajado. La normativa local puede definir bases distintas o topes máximos.',
        },
        {
          q: '¿Qué pasa si trabajé solo parte del año?',
          a: 'El cálculo prorratea según meses o días referenciales. Cada país puede exigir mínimos de antigüedad o reglas especiales para suspensiones.',
        },
        {
          q: '¿Incluye impuestos o retenciones?',
          a: 'Se muestra un valor estimado sin retenciones específicas. Algunas jurisdicciones aplican impuestos o aportes; confirma con tu empleador o contador.',
        },
        {
          q: '¿Cómo se consideran ausencias o licencias?',
          a: 'El impacto depende de si fueron justificadas, no remuneradas o cubiertas por seguros. La legislación local define qué días computan.',
        },
        {
          q: '¿Cuándo debería pagarse?',
          a: 'Usualmente existen fechas o plazos definidos en la normativa o contrato. Este cálculo es solo referencial y no reemplaza esas reglas.',
        },
        {
          q: '¿Sirve para trabajadores independientes?',
          a: 'Está pensado como orientación para relaciones laborales formales. Para honorarios o freelancers, las condiciones pueden ser distintas.',
        },
      ],
    },
    iva: {
      title: 'el IVA',
      items: [
        {
          q: '¿Cómo se calcula el IVA en el precio?',
          a: 'Se aplica la tasa ingresada para obtener valores con y sin impuesto. El resultado es referencial y no considera regímenes especiales.',
        },
        {
          q: '¿Incluye bienes exentos o tasas reducidas?',
          a: 'No. Se asume una tasa general. Exenciones, afectaciones parciales o tratamientos especiales pueden cambiar el cálculo real.',
        },
        {
          q: '¿Sirve para facturación o declaraciones?',
          a: 'Es una guía rápida para visualizar montos. Los comprobantes oficiales deben seguir la normativa tributaria vigente.',
        },
        {
          q: '¿Puedo usarlo si soy contribuyente simplificado?',
          a: 'El cálculo funciona como referencia. Régimenes simplificados o monotributos pueden tener reglas distintas.',
        },
        {
          q: '¿Los precios incluyen retenciones adicionales?',
          a: 'No. Solo muestra la separación de IVA. Retenciones, percepciones u otros impuestos deben revisarse según corresponda.',
        },
      ],
    },
    vacaciones: {
      title: 'el cálculo de vacaciones',
      items: [
        {
          q: '¿Cómo se calculan los días disponibles?',
          a: 'Se estiman con base en los días o meses trabajados y la tasa anual referencial. Cada país define mínimos, feriados y reglas de acumulación.',
        },
        {
          q: '¿Qué ocurre con la antigüedad?',
          a: 'Algunas legislaciones otorgan más días por años de servicio. Este cálculo no sustituye lo que indica tu contrato o la ley.',
        },
        {
          q: '¿Se pagan las vacaciones?',
          a: 'Normalmente se paga la remuneración habitual y, en algunos casos, un extra. Puede variar según convenios y topes locales.',
        },
        {
          q: '¿Cómo se prorratean permisos o licencias?',
          a: 'Las licencias médicas, permisos sin goce o suspensiones pueden afectar el saldo. La aplicación exacta depende de la normativa local.',
        },
        {
          q: '¿Sirve para contratos parciales o temporales?',
          a: 'Entrega una referencia proporcional. Las jornadas parciales o contratos a plazo fijo pueden tener reglas particulares.',
        },
      ],
    },
    liquidation: {
      title: 'la liquidación o finiquito',
      items: [
        {
          q: '¿Qué conceptos se incluyen?',
          a: 'Generalmente contempla indemnizaciones, salarios pendientes, vacaciones y bonos proporcionales. Cada país define qué rubros son obligatorios.',
        },
        {
          q: '¿Cómo se calculan los años de servicio?',
          a: 'Se usa la antigüedad ingresada como referencia. Los topes y fracciones de año pueden variar según la legislación.',
        },
        {
          q: '¿Incluye descuentos o retenciones?',
          a: 'El cálculo mostrado es bruto referencial. Descuentos por aportes, impuestos o deudas laborales pueden aplicarse al monto final.',
        },
        {
          q: '¿Qué pasa con vacaciones no tomadas?',
          a: 'Suelen pagarse de forma proporcional. La forma exacta depende de la normativa y de lo pactado en el contrato.',
        },
        {
          q: '¿Cuándo se debe pagar la liquidación?',
          a: 'Existen plazos legales o contractuales para el pago. Usa este resultado solo como guía y confirma los tiempos oficiales.',
        },
      ],
    },
    generic: {
      title: 'este cálculo referencial',
      items: [
        {
          q: '¿Qué tan exacto es el resultado?',
          a: 'Es una aproximación pensada para guiar decisiones rápidas. Factores legales, topes o beneficios personales pueden cambiar la cifra final.',
        },
        {
          q: '¿Puedo adaptar las tasas o porcentajes?',
          a: 'Sí, ajusta los campos disponibles para reflejar tu caso. El resultado sigue siendo informativo y puede variar según la normativa de tu país.',
        },
        {
          q: '¿Sirve para trámites oficiales?',
          a: 'No. Es un apoyo informativo. Para efectos legales o declaraciones revisa siempre las fuentes oficiales o consulta a un profesional.',
        },
        {
          q: '¿Qué datos se guardan?',
          a: 'El cálculo se ejecuta en tu navegador. Si guardas preferencias, se hace de forma local y puede variar según la configuración del sitio.',
        },
        {
          q: '¿Qué hago si obtengo un resultado extraño?',
          a: 'Revisa que los montos y porcentajes ingresados sean correctos. Si persiste, confirma el cálculo con tablas oficiales o con RR.HH./contador.',
        },
      ],
    },
  };

  function detectCountry() {
    const declared = document.documentElement.dataset.country;
    if (declared) return declared;

    const parts = (window.location.pathname || '').split('/').filter(Boolean);
    if (parts.length && COUNTRY_CODES.includes(parts[0])) return parts[0];

    const host = window.location.hostname || '';
    if (host.includes('calculando')) return 'cl';
    if (host.includes('tucalculo')) return 'mx';
    return 'generic';
  }

  function detectConcept() {
    const path = (window.location.pathname || '').toLowerCase();
    const checks = [
      { key: 'inflation', words: ['inflacion'] },
      {
        key: 'aguinaldo',
        words: ['aguinaldo', 'regalia', 'gratificacion', 'pagas-extra', 'decimo', 'utilidades'],
      },
      { key: 'iva', words: ['iva'] },
      { key: 'vacaciones', words: ['vacaciones', 'bono-vacacional'] },
      {
        key: 'liquidation',
        words: ['liquidacion', 'finiquito', 'cesantia', 'despido', 'indemnizacion'],
      },
    ];

    for (const { key, words } of checks) {
      if (words.some((w) => path.includes(w))) {
        if (key === 'inflation') return 'inflation';
        if (key === 'aguinaldo') return 'aguinaldo';
        if (key === 'iva') return 'iva';
        if (key === 'vacaciones') return 'vacaciones';
        if (key === 'liquidation') return 'liquidation';
      }
    }

    const salaryWords = ['sueldo', 'salario', 'nomina'];
    if (salaryWords.some((w) => path.includes(w))) return 'salary';

    return 'generic';
  }

  function removeLegacyFaqs() {
    const legacyGrids = document.querySelectorAll('.faq-grid');
    legacyGrids.forEach((grid) => {
      const section = grid.closest('section');
      if (section) {
        section.remove();
      } else {
        grid.remove();
      }
    });
  }

  function ensureStyles() {
    if (document.getElementById('faq-injector-style')) return;
    const style = document.createElement('style');
    style.id = 'faq-injector-style';
    style.textContent = `
      .faq-shell { margin-top: 16px; }
      .faq-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; }
      .faq-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 12px; }
      .faq-item { border: 1px solid var(--border-subtle, rgba(148, 163, 184, 0.5)); border-radius: var(--radius-md, 12px); padding: 12px 14px; background: var(--card, rgba(15, 23, 42, 0.9)); box-shadow: var(--shadow-card, 0 18px 42px rgba(15, 23, 42, 0.65)); }
      .faq-question { font-size: 14px; margin-bottom: 6px; }
      .faq-answer { font-size: 13px; color: var(--muted, #9ca3af); line-height: 1.6; }
      .faq-disclaimer { margin-top: 12px; font-size: 12px; color: var(--muted, #9ca3af); }
      @media (max-width: 640px) { .faq-grid { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
  }

  function buildFaqSection(content, country) {
    const section = document.createElement('section');
    section.className = 'shell faq-shell';
    section.setAttribute('data-faq-injected', 'true');

    const title = document.createElement('div');
    title.className = 'tool-title faq-title';
    title.textContent = `Preguntas rápidas sobre ${content.title}`;

    const grid = document.createElement('div');
    grid.className = 'faq-grid';

    content.items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'faq-item';

      const question = document.createElement('h3');
      question.className = 'faq-question';
      question.textContent = item.q;

      const answer = document.createElement('p');
      answer.className = 'faq-answer';
      const caution = country && country !== 'generic' && COUNTRY_NAMES[country]
        ? ` Valídalo con la normativa vigente en ${COUNTRY_NAMES[country]}.`
        : ' Valídalo con fuentes oficiales o con RR.HH./contador.';
      answer.textContent = `${item.a} ${caution}`;

      card.appendChild(question);
      card.appendChild(answer);
      grid.appendChild(card);
    });

    const disclaimer = document.createElement('p');
    disclaimer.className = 'faq-disclaimer';
    disclaimer.textContent = 'Contenido informativo. Verifica con la normativa/entidad de tu país.';

    section.appendChild(title);
    section.appendChild(grid);
    section.appendChild(disclaimer);
    return section;
  }

  function mountFaq() {
    if (document.querySelector('[data-faq-injected="true"]')) return;

    const country = detectCountry();
    const concept = detectConcept();
    const content = FAQ_CONTENT[concept] || FAQ_CONTENT.generic;

    ensureStyles();
    removeLegacyFaqs();

    const section = buildFaqSection(content, country);
    const footer = document.querySelector('footer');
    const main = document.querySelector('main') || document.body;

    if (footer && footer.parentElement) {
      footer.parentElement.insertBefore(section, footer);
    } else {
      main.appendChild(section);
    }
  }

  const readyStates = ['interactive', 'complete'];
  if (readyStates.includes(document.readyState)) {
    mountFaq();
  } else {
    document.addEventListener('DOMContentLoaded', mountFaq);
  }
})();
