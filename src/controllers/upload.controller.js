import { uploadToSupabase } from '../services/supabase.service.js';

export const handleUpload = async (req, res) => {
  try {
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    const data = await uploadToSupabase(fileName, fileBuffer);

    res.status(200).json({
      message: 'Upload successful',
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload error' });
  }
};
