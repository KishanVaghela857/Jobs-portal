const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const { verifyToken } = require('../middleware/auth');

/* ------------------- MULTER CONFIG ------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* ------------------- JOB SEEKER: GET ALL APPLICATIONS ------------------- */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const apps = await Application.find({ jobSeekerId: userId })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title company location type');

    res.json(apps);
  } catch (err) {
    console.error('Fetch Applications Error:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

/* ------------------- JOB SEEKER: APPLY FOR JOB ------------------- */
router.post('/apply-job', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user.id;

    if (!jobId || !req.file) {
      return res.status(400).json({ error: 'Missing jobId or resume' });
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
      resume: req.file.filename,
      appliedAt: new Date()
    });

    await newApp.save();

    // Remove from saved jobs after applying
    await SavedJob.deleteOne({ userId, jobId });

    res.status(201).json({ message: 'Application submitted', application: newApp });
  } catch (err) {
    console.error('Apply Error:', err);
    res.status(500).json({ error: 'Failed to apply' });
  }
});

/* ------------------- JOB SEEKER: DELETE SAVED JOB ------------------- */
router.delete('/savedjobs/:jobId', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    await SavedJob.deleteOne({ userId, jobId });
    res.json({ message: 'Removed from saved jobs' });
  } catch (err) {
    console.error('Delete Saved Job Error:', err);
    res.status(500).json({ error: 'Failed to remove saved job' });
  }
});

/* ------------------- EMPLOYER: GET ALL APPLICANTS ------------------- */
router.get('/employer/applicants', verifyToken, async (req, res) => {
  try {
    const employerJobs = await Job.find({ employerId: req.user.id });

    const jobIds = employerJobs.map(job => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobSeekerId', 'name email')
      .populate('jobId', 'title company');

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/applications/employer/:employerId
router.get('/employer/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    console.log('employerId:', employerId);

    const jobs = await Job.find({ employerId: employerId }).select('_id title');

    console.log('jobs found:', jobs.length);

    const jobIds = jobs.map(job => job._id);
    console.log('jobIds:', jobIds);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobSeekerId', 'name email')
      .populate('jobId', 'title');
    console.log('applications found:', applications.length);

    const grouped = jobs.map(job => {
      const appsForJob = applications.filter(app => app.jobId._id.equals(job._id));
      return {
        jobId: job._id,
        jobTitle: job.title,
        applicants: appsForJob.map(app => ({
          applicationId: app._id,
          fullname: app.jobSeekerId.name,
          email: app.jobSeekerId.email,
          resumeUrl: app.resume,
          coverLetter: app.coverLetter,
          appliedAt: app.appliedAt
        }))
      };
    });

    res.json(grouped);
  } catch (err) {
    console.error('Error in /employer/:employerId route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
