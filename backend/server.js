const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const fileRoutes = require('./routes/fileRoutes');


const app = express();
app.use(cors());
app.use(express.json());
// rate limiting to prevent Uplods flood
const ratelimiter = rateLimit({
    windowMs: 1 * 60 * 1000,  //currently limited to 1 minutes per 200 requests.
    max: 200,
    message: { error: "Rate limiting in action. Try after 1 min." }
});
// MongoDB Connection 
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('🔗 MongoDB connected successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    // exit after 3 seconds timeout, just in case, 
    setTimeout(() => process.exit(1), 3000);
});
app.use(ratelimiter);

// base endpoint
app.get('/', (req, res) => {
    res.send('📦 File service API is up and running');
});

// Routes
app.use('/api/files', fileRoutes);
// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
