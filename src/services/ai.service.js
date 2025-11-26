import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🧠 Función que llama a Groq y devuelve texto limpio
export async function askGroq(extractedText) {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
Sos un analista experto en Recursos Humanos y ATS.
Tu tarea es analizar el contenido textual extraído de un CV.
Devolvés siempre un análisis claro, estructurado y profesional.
`
        },
        {
          role: "user",
          content: `
Analiza este CV y devuélveme:

1) Resumen profesional (3–5 líneas)
2) Principales habilidades técnicas
3) Habilidades blandas
4) Áreas de expertise
5) Seniority aproximado
6) Idiomas detectados
7) Puntos destacados
8) Posibles mejoras del CV

Texto extraído:
${extractedText}
`
        }
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    return {
      clean_text: completion.choices[0].message.content,
      raw: completion, // opcional, útil para logs
    };

  } catch (err) {
    console.error("❌ Groq error:", err);
    throw new Error("Groq API failed");
  }
}
