// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksRoutes = require('./routes/marksRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
connectDB();

// routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/export', exportRoutes);

// test route
app.get('/api/ping', (req, res) => {
  res.json({ msg: 'pong' });
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});