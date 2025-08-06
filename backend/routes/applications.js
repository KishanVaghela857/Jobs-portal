// backend/routes/applications.js

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');

// Multer disk storage for uploading resumes to backend/uploads/resumes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET /applications?userId=123 - get all applications for a user
router.get('/applications', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const apps = await Application.find({ jobSeekerId: userId })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title company location type');

    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// POST /apply-job - apply for a job with resume upload
router.post('/apply-job', upload.single('resume'), async (req, res) => {
  try {
    const { userId, jobId, coverLetter } = req.body;
    if (!userId || !jobId || !req.file) {
      return res.status(400).json({ error: 'Missing required fields or resume' });
    }

    // Check if already applied
    const exists = await Application.findOne({ jobSeekerId: userId, jobId });
    if (exists) return res.status(409).json({ error: 'Already applied for this job' });

    // Find job info for jobTitle and company (needed by your schema)
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const newApp = new Application({
      jobSeekerId: userId,
      jobId,
      jobTitle: job.title,
      company: job.company,
      coverLetter,
      resume: req.file.path, // save path string to DB
      status: 'Applied',
    });

    await newApp.save();

    // Remove from saved jobs if exists
    await SavedJob.deleteOne({ userId, jobId });

    res.status(201).json({ message: 'Application submitted', application: newApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

// GET /api/savedjobs?userId=123 - get saved jobs for user
router.get('/savedjobs', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const savedJobs = await SavedJob.find({ userId });
    return res.status(200).json(savedJobs);
  } catch (err) {
    console.error('Error fetching saved jobs:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /savedjobs/:jobId?userId=123 - delete saved job
router.delete('/savedjobs/:jobId', async (req, res) => {
  try {
    const { userId } = req.query;
    const { jobId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    await SavedJob.deleteOne({ userId, jobId });
    res.json({ message: 'Removed from saved jobs' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove saved job' });
  }
});

module.exports = router;
