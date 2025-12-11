// api/calc-ai-chat.js

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("❌ Falta GROQ_API_KEY en Vercel");
      return res
        .status(500)
        .json({ error: "IA no configurada en el servidor." });
    }

    // --- Parsear body correctamente (puede venir como string) ---
    let body = req.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("❌ No se pudo parsear JSON:", e);
        return res.status(400).json({ error: "Mensaje inválido." });
      }
    }

    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Mensaje inválido." });
    }

    const { message } = body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido." });
    }

    // --- Llamada a Groq (compatible OpenAI) ---
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
                "Eres el asistente oficial de Calculando.cl. Respondes dudas simples sobre sueldo líquido, sueldo bruto, boletas de honorarios, AFP, salud, IVA e impuestos en Chile. Hablas en lenguaje simple chileno y cercano.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const rawText = await groqResponse.text();

    if (!groqResponse.ok) {
      // IMPORTANTE: log para ver estado exacto en Vercel
      console.error(
        "❌ Groq error:",
        groqResponse.status,
        groqResponse.statusText,
        rawText
      );
      return res
        .status(500)
        .json({ error: "Error al consultar la IA. (Groq no OK)" });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ No se pudo parsear respuesta Groq:", e, rawText);
      return res
        .status(500)
        .json({ error: "Respuesta de IA en formato inesperado." });
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Lo siento, esta vez no pude generar una respuesta útil.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Error en /api/calc-ai-chat:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
