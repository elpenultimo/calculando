function calcular() {
  const monto = Number(document.getElementById("monto").value);
  const tasa = Number(document.querySelector("input[name='rate']:checked").value) / 100;

  if (!monto || monto <= 0) {
    document.getElementById("resultado-liquido").textContent = "—";
    document.getElementById("resultado-bruto").textContent = "—";
    return;
  }

  // Líquido → Bruto
  const bruto = monto / (1 - tasa);
  document.getElementById("resultado-liquido").textContent =
    `Debes hacer la boleta por: $${Math.round(bruto).toLocaleString("es-CL")}`;

  // Bruto → Líquido
  const liquido = monto * (1 - tasa);
  document.getElementById("resultado-bruto").textContent =
    `Recibirás: $${Math.round(liquido).toLocaleString("es-CL")}`;
}

// Escucha cada vez que el usuario escribe o cambia tasa
document.getElementById("monto").addEventListener("input", calcular);
document.querySelectorAll("input[name='rate']").forEach(r => {
  r.addEventListener("change", calcular);
});