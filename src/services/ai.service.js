import Groq from "groq-sdk";
import dotenv from "dotenv";
import { CV_ANALYSIS_PROMPT } from "./prompts.js";
// 👇 importamos el parser que ya creaste
import { parseGroqCV } from "../utils/parseCvResponse.js";

dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper para llamar a un modelo específico
async function callGroqModel(model, cvText) {
  return await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_tokens: 1200,
    messages: [
      { role: "system", content: CV_ANALYSIS_PROMPT },
      { role: "user", content: cvText },
    ],
  });
}

export async function askGroq(cvText) {
  try {
    const primary = process.env.GROQ_MODEL_PRIMARY || "llama-3.1-8b-instant";

    const completion = await client.chat.completions.create({
      model: primary,
      temperature: 0.2,
      max_tokens: 1200,
      messages: [
        { role: "system", content: CV_ANALYSIS_PROMPT },
        { role: "user", content: cvText }
      ]
    });

    const raw = completion.choices[0].message.content;

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Error parseando JSON:", err);
    }

    // ⬇️⬇️ **ACÁ está lo nuevo** ⬇️⬇️
    return {
      raw,
      parsed,
      model: primary,
      tokens: {
        input: completion?.usage?.prompt_tokens || null,
        output: completion?.usage?.completion_tokens || null,
        total: completion?.usage?.total_tokens || null
      }
    };

  } catch (err) {
    console.error("Groq error:", err);
    throw err;
  }
}

// Parser interno
function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
