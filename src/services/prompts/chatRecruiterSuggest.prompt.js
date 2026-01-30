export function buildRecruiterSuggestionsPrompt({
  profile,
  history = [],
  count = 5,
}) {
  const summary = profile?.analysis_json?.summary || "";
  const skills = profile?.analysis_json?.skills?.join(", ") || "";
  const experience = profile?.analysis_json?.experience || [];

  const historyText = history
    .map((m) => `${m.role === "recruiter" ? "Recruiter" : "Candidate"}: ${m.message}`)
    .join("\n");

  const experienceText = Array.isArray(experience)
    ? experience
        .slice(0, 8)
        .map((e) => `- ${e.role || "Rol"} en ${e.company || "Empresa"} (${e.dates || "s/f"})`)
        .join("\n")
    : "";

  return `
Sos un reclutador senior. Tu tarea es sugerir próximas preguntas para entrevistar a este candidato.

Reglas:
- Devolvé SOLO un JSON válido (sin backticks).
- El JSON debe tener esta forma: {"suggestions":["...","..."]}.
- Las preguntas deben ser concretas y útiles.
- Evitá repetir temas ya cubiertos en el historial.
- Mezclá: conducta (STAR), métricas/impacto, conflictos, liderazgo, gestión del cambio, casos reales.
- Cantidad de preguntas: ${count}

=== PERFIL (RESUMEN) ===
${summary}

=== SKILLS ===
${skills}

=== EXPERIENCIA ===
${experienceText || "(sin experiencia)"}

=== HISTORIAL ===
${historyText || "Sin historial previo"}

Respondé ahora con el JSON.
`.trim();
}
