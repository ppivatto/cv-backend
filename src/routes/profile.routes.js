// profile.routes.js
import express from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import {
  getProfileById,
  getPublicCandidateProfileById,
  publishProfile,
  unpublishProfile,
} from "../services/db.service.js";

const router = express.Router();

/* =======================
  PERFIL PRIVADO (CANDIDATO)
======================= */

router.get("/profile/me", verifyUser, async (req, res) => {
  try {
    const profile = await getProfileById(req.user.id);

    return res.json({
      success: true,
      profile: profile || null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error obteniendo el perfil",
    });
  }
});

router.post("/publish", verifyUser, async (req, res) => {
  try {
    const profile = await publishProfile(req.user.id);

    return res.json({
      success: true,
      profileId: profile.id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "No se pudo publicar el perfil",
    });
  }
});

router.post("/unpublish", verifyUser, async (req, res) => {
  try {
    const profile = await unpublishProfile(req.user.id);

    return res.json({
      success: true,
      profileId: profile.id,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "No se pudo despublicar el perfil",
    });
  }
});

/* =======================
  PERFIL PÚBLICO (RECRUITER)
======================= */

router.get("/candidate-profile/:id", async (req, res) => {
  try {
    const profile = await getPublicCandidateProfileById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: "Perfil no encontrado o no publicado",
      });
    }

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error obteniendo el perfil público",
    });
  }
});

export default router;
