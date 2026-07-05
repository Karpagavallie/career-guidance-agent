require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const careerRoutes = require('./routes/careerRoutes');
const userRoutes = require('./routes/userRoutes');
//const chatRoutes = require('./routes/chatRoutes');   // NEW

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/career', careerRoutes);
app.use('/api/users', userRoutes);
//app.use('/api/chat', chatRoutes);     // NEW

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy.'
    });
});

// Serve index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
});