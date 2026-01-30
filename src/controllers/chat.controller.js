import {
  getProfileById,
  saveChatMessage,
  getChatHistory as getChatHistoryFromDB,
} from "../services/db.service.js";

import {
  generateCandidateAnswer,
  generateRecruiterSuggestions,
} from "../services/ai.service.js";

/**
 * POST /chat/recruiter/:profileId
 * Body: { message: "pregunta del reclutador" }
 */
export async function recruiterChat(req, res) {
  const { profileId } = req.params;
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Falta el campo "message" en el body',
      });
    }

    const profile = await getProfileById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Perfil no encontrado",
      });
    }

    // Guardamos pregunta del recruiter
    await saveChatMessage({ profileId, role: "recruiter", message });

    // Traemos historial actualizado (incluye la pregunta recién guardada)
    const history = await getChatHistoryFromDB(profileId);

    // Generamos respuesta del candidato con IA
    const answer = await generateCandidateAnswer({
      profile,
      question: message,
      history,
    });

    // Guardamos respuesta del candidato
    await saveChatMessage({ profileId, role: "candidate", message: answer });

    return res.json({
      success: true,
      mode: "recruiter",
      profileId,
      question: message,
      answer,
    });
  } catch (err) {
    console.error("❌ CHAT_RECRUITER_ERROR", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error interno en el chat del reclutador",
    });
  }
}

/**
 * GET /chat/:profileId/history
 * Devuelve historial completo
 */
export async function getChatHistory(req, res) {
  const { profileId } = req.params;

  try {
    const messages = await getChatHistoryFromDB(profileId);

    return res.json({
      success: true,
      profileId,
      messages,
    });
  } catch (err) {
    console.error("❌ CHAT_HISTORY_ERROR", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error obteniendo historial del chat",
    });
  }
}

/**
 * POST /chat/recruiter/:profileId/suggestions
 * Body opcional: { count: 5 }
 */
export async function recruiterSuggestions(req, res) {
  const { profileId } = req.params;
  const count = Number(req.body?.count || 5);

  try {
    const profile = await getProfileById(profileId);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Perfil no encontrado",
      });
    }

    const history = await getChatHistoryFromDB(profileId);

    const suggestions = await generateRecruiterSuggestions({
      profile,
      history,
      count: Number.isFinite(count) ? Math.min(Math.max(count, 1), 10) : 5,
    });

    return res.json({
      success: true,
      profileId,
      suggestions,
    });
  } catch (err) {
    console.error("❌ CHAT_SUGGESTIONS_ERROR", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Error generando sugerencias",
    });
  }
}
