(function () {
  const salarioBrutoInput = document.getElementById('salarioBruto');
  const isrEstimadoNode = document.getElementById('isrEstimado');
  const imssTrabajadorNode = document.getElementById('imssTrabajador');
  const totalDescuentosNode = document.getElementById('totalDescuentos');
  const sueldoNetoNode = document.getElementById('sueldoNeto');

  const ISR_RATE = 0.16; // Lógica simplificada
  const IMSS_RATE = 0.0975; // Lógica simplificada

  function formatMXN(value) {
    if (!isFinite(value)) return '$0.00';
    try {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch (e) {
      const safeValue = Number(value) || 0;
      return '$' + safeValue.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  }

  function resetFields() {
    if (!isrEstimadoNode || !imssTrabajadorNode || !totalDescuentosNode || !sueldoNetoNode) return;
    isrEstimadoNode.textContent = '$0.00';
    imssTrabajadorNode.textContent = '$0.00';
    totalDescuentosNode.textContent = '$0.00';
    sueldoNetoNode.textContent = '$0.00';
  }

  function actualizar() {
    if (!salarioBrutoInput || !isrEstimadoNode || !imssTrabajadorNode || !totalDescuentosNode || !sueldoNetoNode) return;
    const raw = (salarioBrutoInput.value || '').trim();

    if (!raw) {
      resetFields();
      return;
    }

    const bruto = Math.max(0, Number(raw));
    if (!isFinite(bruto)) {
      resetFields();
      return;
    }

    const isr = Math.max(0, bruto * ISR_RATE);
    const imss = Math.max(0, bruto * IMSS_RATE);
    const total = isr + imss;
    const neto = Math.max(0, bruto - total);

    isrEstimadoNode.textContent = formatMXN(isr);
    imssTrabajadorNode.textContent = formatMXN(imss);
    totalDescuentosNode.textContent = formatMXN(total);
    sueldoNetoNode.textContent = formatMXN(neto);
  }

  function init() {
    if (!salarioBrutoInput) return;
    salarioBrutoInput.addEventListener('input', actualizar);
    actualizar();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
