export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://www.calculando.cl");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: 'Mensaje inválido. Envia por ejemplo: { "message": "¿Qué es el IVA?" }',
    });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("ERROR: GROQ_API_KEY no encontrada");
      return res.status(500).json({ error: "API Key no configurada" });
    }

    // ---------- LLAMADA A GROQ (formato OpenAI) ----------
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `
Eres el asistente oficial de Calculando.cl.

Tu función es responder únicamente preguntas simples y rápidas sobre:
- Sueldo líquido y sueldo bruto.
- Cálculo de boletas de honorarios.
- AFP y salud (Fonasa/Isapres).
- Impuesto Único.
- IVA y otros impuestos básicos de Chile.
- Conceptos simples de UTM, UTA y UF.
- Normas laborales simples relacionadas al cálculo de sueldos.

Reglas estrictas:
1. No respondes temas personales, existenciales, emocionales, médicos, legales avanzados, psicológicos, políticos, ni de opinión.
2. No especulas ni inventas datos.
3. Si la pregunta está fuera del ámbito laboral/tributario chileno, responde EXACTAMENTE:
   "Solo puedo ayudarte con dudas simples sobre sueldo, honorarios, AFP, salud e impuestos básicos en Chile."
4. Responde siempre en lenguaje simple, directo y ciudadano.
5. No mencionas modelos de IA ni cómo fuiste creado.
6. No explicas tu funcionamiento interno.
7. No das asesoría profesional compleja.
8. Mantén respuestas breves y prácticas.

Tu objetivo es ayudar rápido, claro y sin errores.
            `,
          },
          { role: "user", content: message },
        ],
      }),
    });

    const rawText = await groqResponse.text();

    if (!groqResponse.ok) {
      console.error("Groq error:", groqResponse.status, groqResponse.statusText, rawText);
      return res
        .status(500)
        .json({ error: "Error al consultar la IA (Groq no OK)" });
    }

    const data = JSON.parse(rawText);
    const reply = data.choices?.[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
