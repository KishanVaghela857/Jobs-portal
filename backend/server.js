const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicantRoutes = require('./routes/applicant');
const applicationRoutes = require('./routes/applications'); // <- important
const dashboardRoutes = require('./routes/dashboard');
const contactRoutes = require('./routes/contact');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/applications', applicationRoutes);  // Make sure applications route is used once
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
