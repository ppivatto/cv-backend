import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { CV_ANALYSIS_PROMPT } from './prompts.js';
// 👇 importamos el parser que ya creaste
import { parseGroqCV } from '../utils/parseCvResponse.js';
import { buildCandidateChatPrompt } from './prompts/chatCandidate.prompt.js';
import { buildRecruiterSuggestionsPrompt } from "./prompts/chatRecruiterSuggest.prompt.js";


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
      { role: 'system', content: CV_ANALYSIS_PROMPT },
      { role: 'user', content: cvText },
    ],
  });
}

export async function askGroq(cvText) {
  try {
    const primary = process.env.GROQ_MODEL_PRIMARY || 'llama-3.1-8b-instant';

    const completion = await client.chat.completions.create({
      model: primary,
      temperature: 0.2,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: CV_ANALYSIS_PROMPT },
        { role: 'user', content: cvText },
      ],
    });

    const raw = completion.choices[0].message.content;

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error('❌ Error parseando JSON:', err);
    }

    // ⬇️⬇️ **ACÁ está lo nuevo** ⬇️⬇️
    return {
      raw,
      parsed,
      model: primary,
      tokens: {
        input: completion?.usage?.prompt_tokens || null,
        output: completion?.usage?.completion_tokens || null,
        total: completion?.usage?.total_tokens || null,
      },
    };
  } catch (err) {
    console.error('Groq error:', err);
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

export async function generateCandidateAnswer({
  profile,
  question,
  history = [],
}) {
  const prompt = buildCandidateChatPrompt({
    profile,
    question,
    history,
  });

  const model = process.env.GROQ_MODEL_CHAT || 'llama-3.1-8b-instant';

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    max_tokens: 350,
    messages: [
      {
        role: 'system',
        content:
          'Sos un candidato profesional respondiendo preguntas de un reclutador.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // 👇 log simple
  console.log('🧠 Groq tokens:', completion.usage);

  return completion.choices[0].message.content.trim();
}


export async function generateRecruiterSuggestions({
  profile,
  history = [],
  count = 5,
}) {
  const prompt = buildRecruiterSuggestionsPrompt({ profile, history, count });

  const model = process.env.GROQ_MODEL_CHAT || "llama-3.1-8b-instant";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 350,
    messages: [
      {
        role: "system",
        content:
          "Sos un reclutador senior. Respondés estrictamente en JSON válido según el formato pedido.",
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim() || "";

  // Intentamos parsear JSON (si falla, devolvemos fallback)
  try {
    const parsed = JSON.parse(raw);
    const suggestions = Array.isArray(parsed?.suggestions)
      ? parsed.suggestions.filter(Boolean).slice(0, count)
      : [];

    if (suggestions.length > 0) return suggestions;
  } catch (e) {
    // ignoramos
  }

  // Fallback si el modelo devolvió cualquier cosa
  return [
    "Contame un ejemplo concreto de un cambio cultural que lideraste. ¿Qué hiciste y qué impacto tuvo?",
    "¿Cómo medís el impacto de tu trabajo? ¿Qué métricas usaste (DORA/OKRs/lead time, etc.)?",
    "Describí un conflicto fuerte entre roles (PM/DEV/UX). ¿Cómo lo destrabaste?",
    "¿Cuál fue tu mayor desafío facilitando líderes? ¿Qué aprendiste?",
    "Contame un caso donde tuviste que influir sin autoridad formal.",
  ].slice(0, count);
}