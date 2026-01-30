import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from "./src/routes/ai.routes.js";
import cvsRoutes from "./src/routes/cvs.routes.js";
import cvProcessRoutes from "./src/routes/cv.process.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from './src/routes/profile.routes.js';
import candidateProfileRoutes from './src/routes/candidate.profile.routes.js';
import chatRoutes from "./src/routes/chat.routes.js";

// Rutas
import uploadRoutes from './src/routes/upload.routes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",   // o el puerto donde corre tu FE
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/upload', uploadRoutes);
app.use('/auth', authRoutes);
app.use("/ai", aiRoutes);
app.use("/cvs", cvsRoutes);
app.use("/cv", cvProcessRoutes);
app.use('/profile', profileRoutes);
app.use('/candidate-profile', candidateProfileRoutes);
app.use("/chat", chatRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
