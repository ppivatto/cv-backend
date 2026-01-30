// src/services/db.service.js
import { supabase } from "./supabase.service.js";

/**
 * =========================
 * PROFILES (candidate_profiles)
 * =========================
 */

/**
 * Guarda un perfil de candidato
 * - published por defecto: false
 */
export async function saveProfileToDB(userId, fullText, analysisJson) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .insert({
      user_id: userId,
      text_full: fullText,
      analysis_json: analysisJson,
      published: false,
    })
    .select("*")
    .single();

  if (error) {
    console.error("❌ saveProfileToDB error:", error);
    throw new Error("Error guardando perfil");
  }

  return data;
}

/**
 * Perfil por ID (privado / interno)
 * - Útil para el candidato, para chat, etc.
 * - NO filtra por published
 */
export async function getCandidateProfileById(profileId) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    console.error("❌ getCandidateProfileById error:", error);
    return null;
  }

  return data; // puede ser null
}

/**
 * Perfil público por ID (recruiter)
 * - Solo devuelve si published = true
 */
export async function getPublicCandidateProfileById(profileId) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("id", profileId)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("❌ getPublicCandidateProfileById error:", error);
    return null;
  }

  return data; // puede ser null
}

/**
 * Último perfil generado por usuario (privado / candidato)
 */
export async function getProfileByUser(userId) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("❌ getProfileByUser error:", error);
    return null;
  }

  return data; // puede ser null
}

/**
 * Publicar / despublicar un perfil (solo owner)
 * - Si no matchea (id + user_id) -> null
 */
/**
 * Publicar perfil
 */
export async function publishProfile(userId) {
  console.log("publishProfile =>", userId);
  
  const { data, error } = await supabase
    .from("candidate_profiles")
    .update({ published: true })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Despublicar perfil
 */
export async function unpublishProfile(userId) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .update({ published: false })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}


/**
 * (Opcional útil) Listar perfiles del usuario (más nuevos primero)
 */
export async function listProfilesByUser(userId, limit = 20) {
  const { data, error } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ listProfilesByUser error:", error);
    throw new Error("Error listando perfiles del usuario");
  }

  return data || [];
}

/**
 * =========================
 * CHAT (chat_messages)
 * =========================
 */

export async function saveChatMessage({ profileId, role, message }) {
  const { error } = await supabase.from("chat_messages").insert({
    profile_id: profileId,
    role,
    message,
  });

  if (error) {
    console.error("❌ saveChatMessage error:", error);
    throw new Error("Error guardando mensaje");
  }
}

export async function getChatHistory(profileId) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ getChatHistory error:", error);
    throw new Error("Error obteniendo historial");
  }

  return data || [];
}

/**
 * =========================
 * BACKWARD COMPAT (para no romper imports viejos)
 * =========================
 * Si en algún lugar del BE todavía importás getProfileById,
 * lo dejamos apuntando al privado (sin filtro published).
 */
export async function getProfileById(profileId) {
  return getCandidateProfileById(profileId);
}
