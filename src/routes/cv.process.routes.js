import { Router } from 'express';
import multer from 'multer';
import { extractText } from '../services/extract.service.js';
import { uploadToSupabase } from '../services/supabase.service.js';
import { askGroq } from '../services/ai.service.js';
import { parseGroqCV } from '../utils/parseCvResponse.js';
import { logInfo, logError, logStep } from '../utils/logger.js';
import { v4 as uuidv4 } from "uuid";

const router = Router();
const upload = multer();

router.post('/process', upload.single('file'), async (req, res) => {
  const reqId = uuidv4();
  const t0 = Date.now();

  try {
    logInfo("⚡ CV_PROCESS_START", { reqId });

    if (!req.file) {
      logError("📄 No file uploaded", { reqId });
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        requestId: reqId
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // 1) Extract text
    const tExtract0 = Date.now();
    logStep(`(${reqId}) Extrayendo texto del CV...`);
    const extracted = await extractText(originalname, buffer);
    const tExtract = Date.now() - tExtract0;

    // 2) Upload file to Supabase
    const tUpload0 = Date.now();
    logStep(`(${reqId}) Subiendo archivo a Supabase...`);
    const fileUrl = await uploadToSupabase(originalname, buffer);
    const tUpload = Date.now() - tUpload0;

    // 3) Send to AI for structured analysis
    const tAI0 = Date.now();
    logStep(`(${reqId}) Enviando texto a Groq...`);
    const aiResponse = await askGroq(extracted);
    const tAI = Date.now() - tAI0;

    // 4) Parsear la respuesta con nuestro parser robusto
    const tParse0 = Date.now();
    logStep(`(${reqId}) Parseando respuesta de la IA...`);
    const parsed = parseGroqCV(aiResponse.raw);
    const tParse = Date.now() - tParse0;

    // TOTAL
    const total = Date.now() - t0;

    // Logging final
    logInfo("📊 CV_PROCESS_METRICS", {
      reqId,
      total_ms: total,
      extract_ms: tExtract,
      upload_ms: tUpload,
      ai_ms: tAI,
      parse_ms: tParse,
      ai_model: aiResponse.model || "llama-3.1-8b-instant",
      ai_tokens: aiResponse.tokens || null,
      file: { name: originalname, size, type: mimetype }
    });

    return res.json({
      success: true,
      requestId: reqId,
      file: {
        name: originalname,
        url: fileUrl,
        size,
        type: mimetype,
      },
      extraction: { text: extracted },
      analysis: {
        parsed,
        raw: aiResponse.raw,
        model: aiResponse.model || "llama-3.1-8b-instant",
        tokens: aiResponse.tokens ?? null
      },
      metrics: {
        total,
        extract: tExtract,
        upload: tUpload,
        ai: tAI,
        parse: tParse,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    logError("❌ CV_PROCESS_ERROR", { reqId, error: err.message });

    return res.status(500).json({
      success: false,
      error: err.message,
      requestId: reqId
    });
  }
});

export default router;
