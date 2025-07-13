const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const fileRoutes = require('./routes/fileRoutes');


const app = express();
// NOT: useing rate limiter for now, but can be added later
// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (future for Exponetial Backoff)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('🔗 MongoDB connected successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    // Graceful shutdown after short delay (in case of transient issue)
    setTimeout(() => process.exit(1), 3000);
});


// base endpoint
app.get('/', (req, res) => {
    res.send('📦 File service API is up and running');
});


// Global error handler
app.use((err, req, res, next) => {
    console.error('💥 Unexpected error:', err.stack);
    res.status(500).json({ error: 'Server error on the server, check stack trace' });
});
// Routes
app.use('/api/files', fileRoutes);
// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
