// /api/calc-ai-chat.js

export default async function handler(req, res) {
  // --- CORS (permite calculando.cl y www.calculando.cl) ---
  const allowedOrigins = [
    "https://calculando.cl",
    "https://www.calculando.cl",
    "http://localhost:3000",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // --- Leer mensaje del usuario ---
  const { message } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error:
        "Mensaje inválido. Envía por ejemplo: { \"message\": \"Qué es el IVA en Chile?\" }",
    });
  }

  // --- Obtener API Key ---
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ GROQ_API_KEY NO DEFINIDA");
    return res.status(500).json({ error: "Falta configuración interna del servidor." });
  }

  try {
    // --- Llamada a Groq ---
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          temperature: 0.3,
          max_tokens: 512,
          messages: [
            {
              role: "system",
              content:
                "Eres el asistente oficial de Calculando.cl. Solo respondes preguntas básicas sobre sueldo líquido, sueldo bruto, boletas de honorarios, AFP, salud, cesantía, impuesto único, IVA e impuestos en Chile. Si te preguntan algo que no sea de esos temas, responde: 'No puedo responder eso, intenta preguntar otra cosa o usa las calculadoras del sitio.' Responde corto, claro y en lenguaje simple.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const rawText = await groqResponse.text();

    if (!groqResponse.ok) {
      console.error("❌ Groq error:", groqResponse.status, groqResponse.statusText);
      console.error("Body:", rawText);
      return res.status(500).json({
        error: "Error al consultar la IA. (Groq no OK)",
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ Error parseando JSON desde Groq:", rawText);
      return res.status(500).json({
        error: "Error interpretando respuesta de la IA.",
      });
    }

    const reply = data.choices?.[0]?.message?.content || "Sin respuesta generada.";

    // --- Respuesta final ---
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return res.status(500).json({
      error: "Error interno del servidor.",
    });
  }
}
