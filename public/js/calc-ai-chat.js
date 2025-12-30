(function () {
  const toggleBtn = document.getElementById("calc-ai-toggle");
  const chatBox = document.getElementById("calc-ai-chat");
  const closeBtn = document.getElementById("calc-ai-close");
  const input = document.getElementById("calc-ai-input");
  const sendBtn = document.getElementById("calc-ai-send");
  const messages = document.getElementById("calc-ai-messages");

  function appendMessage(text, role) {
    const div = document.createElement("div");
    div.className = "calc-ai-msg " + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  let greeted = false;
  function showWelcome() {
    if (greeted) return;
    greeted = true;
    appendMessage(
      "¡Hola! Soy el asistente de Calculando.cl. Puedo ayudarte con dudas básicas sobre sueldo líquido, bruto, IVA e impuestos en Chile. ¿Qué quieres saber?",
      "bot"
    );
  }

  toggleBtn.addEventListener("click", () => {
    if (chatBox.classList.contains("hidden")) {
      chatBox.classList.remove("hidden");
      showWelcome();
    } else {
      chatBox.classList.add("hidden");
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      chatBox.classList.add("hidden");
    });
  }

  async function sendMessage() {
    const question = input.value.trim();
    if (!question) return;
    appendMessage(question, "user");
    input.value = "";
    input.focus();

    appendMessage("Pensando…", "bot");
    const loadingNode = messages.lastChild;

    try {
      const res = await fetch("/api/calc-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();
      messages.removeChild(loadingNode);
      appendMessage(
        data.reply ||
          "No pude responder bien esta vez. Intenta preguntar de otra forma o usa las calculadoras del sitio.",
        "bot"
      );
    } catch (err) {
      console.error(err);
      messages.removeChild(loadingNode);
      appendMessage(
        "Ups, hubo un error de conexión. Intenta de nuevo más tarde.",
        "bot"
      );
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
