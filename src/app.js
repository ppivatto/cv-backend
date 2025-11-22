const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
