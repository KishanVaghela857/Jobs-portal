const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');


router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const apps = await Application.find({ jobSeekerId: userId })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title company location type');

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Setup Multer upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/apply-job', upload.single('resume'), async (req, res) => {
  try {
    const { userId, jobId, coverLetter } = req.body;

    if (!userId || !jobId || !req.file) {
      return res.status(400).json({ error: 'Missing required fields: userId, jobId, or resume' });
    }

    // Prevent duplicate application
    const exists = await Application.findOne({ jobSeekerId: userId, jobId });
    if (exists) {
      return res.status(409).json({ error: 'Already applied for this job' });
    }

    // Validate job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const newApp = new Application({
      jobSeekerId: userId,
      jobId,
      coverLetter,
      resume: req.file.path, // Store file path
      appliedAt: new Date()
    });

    await newApp.save();

    // Optional: remove saved job after applying
    await SavedJob.deleteOne({ userId, jobId });

    return res.status(201).json({ message: 'Application submitted', application: newApp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to apply' });
  }
});

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

router.get('/employer/:employerId', verifyToken, async (req, res) => {
  try {
    const { employerId } = req.params;

    const jobs = await Job.find({ employerId });

    const applicants = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ jobId: job._id }).populate('jobSeekerId');
        return {
          jobId: job._id,
          jobTitle: job.title,
          applicants: applications.map((app) => ({
            name: app.jobSeekerId?.name || 'N/A',
            email: app.jobSeekerId?.email || 'N/A',
            resumeUrl: `${req.protocol}://${req.get('host')}/${app.resume}`,
            appliedAt: app.createdAt,
          })),
        };
      })
    );

    res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
