// api/calc-ai-chat.js

export default async function handler(req, res) {
  // Sólo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("X Falta GROQ_API_KEY en Vercel");
    return res
      .status(500)
      .json({ error: "Falta configuración de IA (GROQ_API_KEY)." });
  }

  try {
    const { message } = req.body || {};

    // Validar payload
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error:
          'Mensaje inválido. Envía por ejemplo: { "message": "¿Qué es el IVA en Chile?" }',
      });
    }

    // -------- LLAMADA A GROQ (endpoint OpenAI-compatible) --------
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // Modelo seguro que existe en Groq
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          max_tokens: 512,
          messages: [
            {
              role: "system",
              content:
                "Eres el asistente oficial de Calculando.cl. Respondes dudas simples sobre sueldo líquido, sueldo bruto, boletas de honorarios, AFP, salud, IVA e impuestos en Chile. Hablas en lenguaje simple, corto, y siempre en español de Chile.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    // Leemos SIEMPRE como texto, y después parseamos
    const rawText = await groqResponse.text();

    if (!groqResponse.ok) {
      console.error(
        "X Groq error:",
        groqResponse.status,
        groqResponse.statusText,
        rawText
      );
      return res
        .status(500)
        .json({ error: "Error al consultar la IA. (Groq no OK)" });
    }

    let answer = "Lo siento, no encontré respuesta útil para esa pregunta.";

    try {
      const data = JSON.parse(rawText);
      answer =
        data.choices?.[0]?.message?.content?.trim() ||
        answer;
    } catch (e) {
      console.error("X Error al parsear respuesta Groq:", e, rawText);
    }

    return res.status(200).json({ reply: answer });
  } catch (err) {
    console.error("X Error interno en handler calc-ai-chat:", err);
    return res
      .status(500)
      .json({ error: "Error interno en el asistente de Calculando." });
  }
}
