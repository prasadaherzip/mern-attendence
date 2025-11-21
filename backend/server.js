// server.js
require('dotenv').config();     //lets use .env files for later
const express = require('express'); //lib to help create a server
const cors = require('cors');       //react app to talk to backend
const mongoose = require('mongoose'); 

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// test route
app.get('/api/ping', (req, res) => {
  res.json({ msg: 'pong' });
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

//add students.js route to sever
const studentsRouter = require('./routes/students');
app.use('/api/students', studentsRouter);