const FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatMXN(value = 0) {
  if (!isFinite(value)) return '$0.00';
  return FORMATTER.format(value);
}

function estimateImssTrabajador(bruto) {
  if (!isFinite(bruto) || bruto <= 0) return 0;

  // Aprox. 2.75% del sueldo y un componente suave para sueldos más altos
  const base = bruto * 0.0275;
  const ajusteSolidario = bruto > 20000 ? (bruto - 20000) * 0.0025 : 0;

  return Math.max(0, base + ajusteSolidario);
}

function estimateIsr(bruto) {
  if (!isFinite(bruto) || bruto <= 0) return 0;

  const brackets = [
    { limit: 0, top: 7500, rate: 0, fixed: 0 },
    { limit: 7500, top: 15000, rate: 0.06, fixed: 0 },
    { limit: 15000, top: 30000, rate: 0.1, fixed: 450 },
    { limit: 30000, top: 50000, rate: 0.15, fixed: 1950 },
    { limit: 50000, top: Infinity, rate: 0.2, fixed: 4950 },
  ];

  const current = brackets.find(b => bruto <= b.top) || brackets[brackets.length - 1];
  const excedente = Math.max(0, bruto - current.limit);
  const subtotal = current.fixed + excedente * current.rate;

  return Math.max(0, subtotal);
}

function setOpacity(el, value) {
  if (!el) return;
  el.style.opacity = value;
}

function updateResults(root, values) {
  const { isr, imss, total, neto } = values;
  root.querySelector('[data-result="isr"]').textContent = formatMXN(isr);
  root.querySelector('[data-result="imss"]').textContent = formatMXN(imss);
  root.querySelector('[data-result="total"]').textContent = formatMXN(total);
  root.querySelector('[data-result="neto"]').textContent = formatMXN(neto);
}

export function initMxSueldoCalculator(rootId = 'mxSueldoCalc') {
  const root = document.getElementById(rootId);
  if (!root) return;

  const input = root.querySelector('[data-role="bruto-input"]');
  const error = root.querySelector('[data-role="error"]');
  const resultsBox = root.querySelector('[data-role="results-box"]');

  const reset = () => {
    if (error) error.textContent = '';
    updateResults(root, { isr: 0, imss: 0, total: 0, neto: 0 });
    setOpacity(resultsBox, 0.5);
  };

  const handleInput = () => {
    const raw = (input.value || '').trim();
    if (error) error.textContent = '';

    if (!raw) {
      reset();
      return;
    }

    const bruto = Number(raw);
    if (!isFinite(bruto) || bruto < 0) {
      if (error) error.textContent = 'Ingresa un monto válido mayor o igual a 0.';
      reset();
      return;
    }

    const isr = estimateIsr(bruto);
    const imss = estimateImssTrabajador(bruto);
    const total = Math.max(0, isr + imss);
    const neto = Math.max(0, bruto - total);

    updateResults(root, { isr, imss, total, neto });
    setOpacity(resultsBox, 1);
  };

  input.addEventListener('input', handleInput);
  handleInput();
}

export default initMxSueldoCalculator;
