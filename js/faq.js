(() => {
  const COUNTRY_NAMES = {
    cl: 'Chile',
    mx: 'México',
    ar: 'Argentina',
    pe: 'Perú',
    co: 'Colombia',
    br: 'Brasil',
    bo: 'Bolivia',
    py: 'Paraguay',
    uy: 'Uruguay',
    ec: 'Ecuador',
    ve: 'Venezuela',
    pa: 'Panamá',
    cr: 'Costa Rica',
    ni: 'Nicaragua',
    hn: 'Honduras',
    sv: 'El Salvador',
    gt: 'Guatemala',
    do: 'República Dominicana',
    pr: 'Puerto Rico',
    cu: 'Cuba',
    us: 'Estados Unidos',
    es: 'España',
    gq: 'Guinea Ecuatorial',
    boleta: 'Bolivia',
  };

  const AUTHORITIES = {
    cl: { tax: 'SII', labor: 'Dirección del Trabajo' },
    mx: { tax: 'SAT', labor: 'STPS' },
    ar: { tax: 'AFIP', labor: 'ANSES' },
    pe: { tax: 'SUNAT', labor: 'MTPE' },
    co: { tax: 'DIAN', labor: 'MinTrabajo' },
    br: { tax: 'Receita Federal', labor: 'INSS' },
    bo: { tax: 'SIN', labor: 'Ministerio de Trabajo' },
    py: { tax: 'SET', labor: 'IPS' },
    uy: { tax: 'DGI', labor: 'BPS' },
    ec: { tax: 'SRI', labor: 'IESS' },
    ve: { tax: 'SENIAT', labor: 'IVSS' },
    pa: { tax: 'DGI', labor: 'CSS' },
    cr: { tax: 'Hacienda', labor: 'CCSS' },
    ni: { tax: 'DGI', labor: 'INSS' },
    hn: { tax: 'SAR', labor: 'IHSS' },
    sv: { tax: 'DGII', labor: 'ISSS' },
    gt: { tax: 'SAT', labor: 'IGSS' },
    do: { tax: 'DGII', labor: 'TSS' },
    pr: { tax: 'Hacienda PR', labor: 'DTRH' },
    cu: { tax: 'ONAT' },
    us: { tax: 'IRS', labor: 'Department of Labor' },
    es: { tax: 'Agencia Tributaria', labor: 'Seguridad Social' },
    gq: { tax: 'autoridad fiscal correspondiente', labor: 'autoridad laboral correspondiente' },
  };

  function getPathSegments() {
    if (typeof window === 'undefined') return [];
    return window.location.pathname.split('/').filter(Boolean);
  }

  function detectCountryCode() {
    const htmlCountry = document.documentElement.getAttribute('data-country');
    if (htmlCountry && COUNTRY_NAMES[htmlCountry.toLowerCase()]) {
      return htmlCountry.toLowerCase();
    }

    const segments = getPathSegments();
    const first = segments[0];
    if (first && COUNTRY_NAMES[first]) return first;

    return 'cl';
  }

  function toWords(slug = '') {
    return slug
      .replace(/[-_/]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanConcept(raw = '') {
    if (!raw) return '';
    let text = raw.replace(/\s+/g, ' ').trim();
    const cutTokens = [':', '–', '-', '|'];
    cutTokens.forEach(token => {
      if (text.includes(token)) {
        text = text.split(token)[0];
      }
    });
    text = text.replace(/\(.*?\)/g, '').trim();
    text = text.replace(/Calculadora\s+de\s+/i, '');
    text = text.replace(/Calculadora\s+/i, '');
    text = text.replace(/Tu\s*Cálculo\s*/i, '');
    text = text.replace(/\d{4}/g, '').trim();
    if (text.toLowerCase().startsWith('de ')) {
      text = text.slice(3);
    }
    return text.trim();
  }

  function detectConcept() {
    const h1 = document.querySelector('h1');
    const h1Text = cleanConcept(h1?.textContent || '');
    if (h1Text) return h1Text;

    const segments = getPathSegments();
    const slug = segments.length > 1 ? segments[segments.length - 1] : segments[0];
    const slugText = cleanConcept(toWords(slug || ''));
    if (slugText) return slugText;

    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const metaText = cleanConcept(metaDescription || '');
    if (metaText) return metaText;

    return 'este cálculo';
  }

  function detectCategory(concept = '') {
    const text = concept.toLowerCase();
    const payrollKeywords = [
      'sueldo',
      'salario',
      'liquido',
      'neto',
      'bruto',
      'finiquito',
      'liquidación',
      'aguinaldo',
      'vacaciones',
      'gratificacion',
      'gratificación',
      'cesantía',
      'cesantia',
      'inss',
      'ips',
      'cts',
      'renta liquida',
      'indemnización',
      'indemnizacion',
    ];
    const taxKeywords = ['impuesto', 'isr', 'iva', 'ganancias', 'renta', 'tributo'];
    const inflationKeywords = ['inflacion', 'inflación', 'ipc', 'uf', 'uvr'];

    if (inflationKeywords.some(k => text.includes(k))) return 'inflation';
    if (taxKeywords.some(k => text.includes(k))) return 'tax';
    if (payrollKeywords.some(k => text.includes(k))) return 'labor';
    return 'generic';
  }

  function resolveAuthority(code, category) {
    if (category === 'inflation') return 'las fuentes oficiales correspondientes';
    const entry = AUTHORITIES[code];
    if (!entry) return 'la autoridad correspondiente';

    if (category === 'tax' && entry.tax) return entry.tax;
    if ((category === 'labor' || category === 'generic') && entry.labor) return entry.labor;

    return entry.tax || entry.labor || 'la autoridad correspondiente';
  }

  function isCalculatorPage() {
    const main = document.querySelector('main');
    if (!main) return false;
    const hasInputs = main.querySelector('input, select, textarea');
    const hasResults = main.querySelector('.result-card, .result-grid, .result-block, .result');
    const hasCalculatorHints = main.querySelector('.tool-title, .tool-subtitle, .calculator');
    return Boolean((hasInputs || hasResults) && hasCalculatorHints);
  }

  function removeExistingFaqs() {
    document.querySelectorAll('.shell').forEach(section => {
      const title = section.querySelector('.tool-title');
      if (!title) return;
      const text = (title.textContent || '').toLowerCase();
      if (text.includes('preguntas rápidas')) {
        section.remove();
      }
    });
  }

  function buildFaqItem(question, answer) {
    const article = document.createElement('article');
    article.className = 'faq-item';

    const h3 = document.createElement('h3');
    h3.className = 'faq-question';
    h3.textContent = question;

    const p = document.createElement('p');
    p.className = 'faq-answer';
    p.textContent = answer;

    article.appendChild(h3);
    article.appendChild(p);
    return article;
  }

  function renderFaq() {
    if (!isCalculatorPage()) return;
    if (document.getElementById('standardFaq')) return;

    removeExistingFaqs();

    const countryCode = detectCountryCode();
    const countryName = COUNTRY_NAMES[countryCode] || 'tu país';
    const concept = detectConcept() || 'este cálculo';
    const category = detectCategory(concept);
    const authority = resolveAuthority(countryCode, category);

    const section = document.createElement('section');
    section.className = 'shell';
    section.id = 'standardFaq';

    const title = document.createElement('div');
    title.className = 'tool-title';
    title.textContent = 'Preguntas rápidas';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'faq-grid';

    const faqItems = [
      {
        q: `¿Qué es ${concept} en ${countryName}?`,
        a: `${concept} es una referencia para entender el cálculo en ${countryName} de manera sencilla y sin reemplazar la orientación oficial.`,
      },
      {
        q: `¿Cómo se calcula ${concept} de forma general?`,
        a: `La calculadora toma los valores que ingresas y aplica una fórmula simplificada para estimar ${concept}. Es un resultado referencial que puede variar.`,
      },
      {
        q: '¿Qué pasa si el período no es completo?',
        a: 'Puedes ajustar meses o días y el cálculo se prorratea con los datos editados, mostrando una aproximación proporcional.',
      },
      {
        q: `¿${concept} tiene impuestos o descuentos?`,
        a: 'Puede estar sujeto a impuestos o descuentos según la normativa vigente y tu situación particular. Este cálculo es referencial.',
      },
      {
        q: '¿Para qué sirve esta calculadora?',
        a: 'Ayuda a planificar y comparar escenarios rápidamente, dando una referencia para tomar decisiones sin hojas de cálculo.',
      },
      {
        q: '¿Este cálculo es oficial?',
        a: `No. Es una estimación referencial. Debes validar los resultados con ${authority}.`,
      },
    ];

    faqItems.forEach(item => {
      grid.appendChild(buildFaqItem(item.q, item.a));
    });

    section.appendChild(grid);

    const main = document.querySelector('main') || document.body;
    const footer = main.querySelector('footer') || document.querySelector('footer');

    if (footer && footer.parentElement === main) {
      main.insertBefore(section, footer);
    } else if (footer) {
      footer.parentElement.insertBefore(section, footer);
    } else {
      main.appendChild(section);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFaq);
  } else {
    renderFaq();
  }
})();
