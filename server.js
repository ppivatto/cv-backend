import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rutas
import uploadRoutes from './src/routes/upload.routes.js';
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/upload', uploadRoutes);
app.use('/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
