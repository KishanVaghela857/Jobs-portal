const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Your existing auth routes
app.use('/api/auth', require('./routes/auth'));

// Add job routes
app.use('/api/jobs', require('./routes/jobs'));

// Add applicant routes
app.use('/api/applicants', require('./routes/applicants'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
