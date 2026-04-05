const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log('Mounting Auth Routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Mounting Job Routes...');
app.use('/api/jobs', require('./routes/jobs'));
console.log('Mounting Bid Routes...');
app.use('/api/bids', require('./routes/bids'));
console.log('Mounting Profile Routes...');
app.use('/api/profile', require('./routes/profile'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Freelance Marketplace API is running');
});

app.get('/ping', (req, res) => {
    res.send(`pong from pid ${process.pid}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with PID ${process.pid}`);
});
