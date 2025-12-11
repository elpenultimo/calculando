import OpenAI from "openai";

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido." });
    }

    // Inicializar cliente OpenAI
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Llamada normal a la API (texto simple)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres el asistente oficial de Calculando.cl. Respondes dudas básicas sobre sueldo líquido, sueldo bruto, IVA, boletas de honorarios e impuestos en Chile. Responde en lenguaje simple.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No pude generar respuesta.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error en IA:", error);
    res.status(500).json({ error: "Error al consultar la IA." });
  }
}
