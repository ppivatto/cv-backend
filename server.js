import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from "./src/routes/ai.routes.js";
import cvsRoutes from "./src/routes/cvs.routes.js";
import cvProcessRoutes from "./src/routes/cv.process.routes.js";

// Rutas
import uploadRoutes from './src/routes/upload.routes.js';
import authRoutes from './src/routes/auth.routes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",   // o el puerto donde corre tu FE
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/upload', uploadRoutes);
app.use('/auth', authRoutes);
app.use("/ai", aiRoutes);
app.use("/cvs", cvsRoutes);
app.use("/cv", cvProcessRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
