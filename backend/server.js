const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');
const blockRoutes = require('./routes/blocks');

// API Routes (MUST come before static files)
app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/blocks', blockRoutes);

// Serve login page as default
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Serve main app
app.get('/app', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve static files LAST (for CSS, JS, etc.)
app.use(express.static('public'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});