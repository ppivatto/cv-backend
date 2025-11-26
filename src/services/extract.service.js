// src/services/extract.service.js

import PDFParser from "pdf2json";
import mammoth from "mammoth";

// Detectar extensión a partir del nombre de archivo
function getExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

export async function extractText(fileName, fileBuffer) {
  const ext = getExtension(fileName);

  switch (ext) {
    case "pdf":
      return await extractPDF(fileBuffer);

    case "docx":
      return await extractDOCX(fileBuffer);

    case "txt":
      // Archivo de texto plano
      return fileBuffer.toString("utf8");

    default:
      throw new Error(`Unsupported file type: .${ext}`);
  }
}

/* -------------------------
 *        PDF (pdf2json)
 * ------------------------*/
function extractPDF(buffer) {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err) => {
        return reject(err?.parserError || err);
      });

      pdfParser.on("pdfParser_dataReady", (data) => {
        // Si no hay páginas, devolvemos string vacío
        if (!data.Pages || data.Pages.length === 0) {
          return resolve("");
        }

        const pages = data.Pages;

        const raw = pages
          .map((p) =>
            p.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
          )
          .join("\n");

        resolve(raw.trim());
      });

      pdfParser.parseBuffer(buffer);
    } catch (err) {
      reject(err);
    }
  });
}

/* -------------------------
 *        DOCX (mammoth)
 * ------------------------*/
async function extractDOCX(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

// Export por default opcional
export default {
  extractText,
};
