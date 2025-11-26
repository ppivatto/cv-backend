import { askGroq } from "../services/ai.service.js";

export const analyzeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const answer = await askGroq(text);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI analyze error:", error);
    res.status(500).json({ error: "Internal AI error" });
  }
};