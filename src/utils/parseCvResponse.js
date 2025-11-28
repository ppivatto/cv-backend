// utils/parseCvResponse.js

export function parseGroqCV(rawText = "") {
  if (!rawText || typeof rawText !== "string") return null;

  let cleaned = rawText.trim();

  // Quitar wrappers Markdown
  cleaned = cleaned
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Intentar JSON directo
  try {
    return JSON.parse(cleaned);
  } catch (_) {}

  // Buscar { ... }
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first !== -1 && last !== -1 && last > first) {
    const candidate = cleaned.substring(first, last + 1);
    try {
      return JSON.parse(candidate);
    } catch (_) {}
  }

  // Intento final: arreglar comas colgantes
  try {
    const fixed = cleaned.replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(fixed);
  } catch (_) {}

  return null;
}
