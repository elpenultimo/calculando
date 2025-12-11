// api/calc-ai-chat.js

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("❌ Falta GROQ_API_KEY en Vercel");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    // --- IMPORTANTE: parsear bien el body ---
    let body = req.body;

    // En Vercel, a veces llega como string:
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
                "Eres el asistente oficial de Calculando.cl. Respondes dudas simples sobre sueldo líquido, sueldo bruto, boletas de honorarios, AFP, salud, IVA e impuestos en Chile. Usa lenguaje simple, chileno y cercano. Si la pregunta no es de estos temas, contesta breve y sugiere usar las calculadoras del sitio.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const txt = await groqResponse.text();
      console.error("❌ Error Groq:", groqResponse.status, txt);
      return res.status(500).json({ error: "Error al consultar la IA." });
    }

    const data = await groqResponse.json();

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Lo siento, esta vez no pude generar una respuesta útil.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Error en /api/calc-ai-chat:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
