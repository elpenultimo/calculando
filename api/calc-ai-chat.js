// api/calc-ai-chat.js

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("Falta GROQ_API_KEY en las variables de entorno");
      return res
        .status(500)
        .json({ error: "Falta configuración del servidor (API Key)." });
    }

    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido." });
    }

    // Llamada a la API de Groq (formato compatible con OpenAI)
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
                "Eres el asistente de Calculando.cl. Respondes dudas básicas sobre sueldo líquido, sueldo bruto, boletas de honorarios, AFP, salud, impuestos e IVA en Chile. Usa un tono simple, chileno y cercano. Si la pregunta no tiene que ver con estos temas, responde brevemente y sugiere usar las calculadoras de Calculando.cl.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Error Groq:", groqResponse.status, errorText);

      return res
        .status(500)
        .json({ error: "Error al consultar el modelo de IA." });
    }

    const data = await groqResponse.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Lo siento, no pude generar una respuesta útil esta vez.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Error en /api/calc-ai-chat:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
