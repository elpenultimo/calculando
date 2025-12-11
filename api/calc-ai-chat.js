// api/calc-ai-chat.js
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};
  if (!message) {
    res.statusCode = 400;
    return res.json({ error: "Missing message" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Eres el asistente de Calculando.cl. Respondes dudas básicas sobre sueldo, impuestos, cotizaciones e IVA en Chile. " +
            "Explicas en lenguaje simple y breve. Si algo requiere un cálculo avanzado o una ley específica, sugieres usar las calculadoras del sitio o hablar con un contador. " +
            "Responde siempre en español chileno."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 400,
      temperature: 0.3
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    res.statusCode = 200;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.json({ error: "Error calling Groq API" });
  }
};
