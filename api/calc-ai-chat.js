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

    // -------- LEER BODY DE FORMA SÚPER TOLERANTE --------
    let rawBody = req.body;
    let data = null;

    // Puede venir como string o como objeto
    if (typeof rawBody === "string") {
      try {
        data = JSON.parse(rawBody);
      } catch {
        // Si no es JSON, ignoramos y seguimos
        data = {};
      }
    } else if (typeof rawBody === "object" && rawBody !== null) {
      data = rawBody;
    } else {
      data = {};
    }

    // Aceptamos varias claves posibles
    let message =
      data.message ||
      data.text ||
      data.prompt ||
      data.input ||
      "";

    if (typeof message !== "string") {
      message = String(message || "");
    }

    message = message.trim();

    if (!message) {
      return res.status(400).json({
        error:
          'Mensaje inválido. Envía por ejemplo: { "message": "Qué es el IVA en Chile?" }',
      });
    }

    // -------- LLAMADA A GROQ (OpenAI compatible) --------
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

    let groqData;
    try {
      groqData = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ No se pudo parsear respuesta Groq:", e, rawText);
      return res
        .status(500)
        .json({ error: "Respuesta de IA en formato inesperado." });
    }

    const reply =
      groqData?.choices?.[0]?.message?.content?.trim() ||
      "Lo siento, esta vez no pude generar una respuesta útil.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Error en /api/calc-ai-chat:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
}
