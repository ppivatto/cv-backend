import { Router } from "express";
import multer from "multer";
import { extractText } from "../services/extract.service.js";
import { uploadToSupabase } from "../services/supabase.service.js";
import { askGroq } from "../services/ai.service.js";

const router = Router();
const upload = multer();

router.post("/process", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // 1) Extract text
    const extracted = await extractText(originalname, buffer);

    // 2) Upload file to Supabase
    const fileUrl = await uploadToSupabase(originalname, buffer);

    // 3) Send to AI for structured analysis
    const aiResponse = await askGroq(extracted);

    // 4) Return clean JSON
    return res.json({
      success: true,
      metadata: {
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        supabaseUrl: fileUrl
      },
      extraction: {
        text: extracted
      },
      analysis: aiResponse.parsed,
      raw_ai_response: aiResponse.raw,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error("CV PROCESS ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
});

export default router;
