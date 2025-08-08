const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { verifyToken: authMiddleware } = require('../middleware/auth');
const { verifyToken } = require('../middleware/auth');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const Job = require('../models/Job');

// Resume file storage setup using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


console.log('authMiddleware:', typeof authMiddleware);
console.log('upload.single:', typeof upload.single);
router.post('/apply-job', upload.single('resume'), async (req, res) =>  {
    try {
      console.log('✅ Apply Job Endpoint Hit');
      console.log('User:', req.user);
      console.log('Body:', req.body);
      console.log('File:', req.file);

      const { jobId, coverLetter } = req.body;
      const resume = req.file ? `uploads/${req.file.filename}` : null;
      const userId = req.body.userId;

      if (!userId || !jobId || !coverLetter || !req.file) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const alreadyApplied = await Application.findOne({ jobSeekerId: userId, jobId });
      if (alreadyApplied) {
        return res.status(409).json({ error: 'Already applied' });
      }

      const application = new Application({
        jobSeekerId: userId,
        jobId,
        coverLetter,
        resume,
      });

      await application.save();
      console.log('✅ Application saved successfully');
      res.status(201).json({ message: 'Application submitted successfully' });

    } catch (error) {
      console.error('❌ Error applying for job:', error);
      res.status(500).json({ error: 'Failed to apply' });
    }
  }
);

/* ---------------------- GET APPLICATIONS BY USER ---------------------- */
router.get('/applications', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    const apps = await Application.find({ jobSeekerId: userId })
      .sort({ appliedAt: -1 })
      .populate('jobId', 'title company location type');

    res.json(apps);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

/* ---------------------- GET SAVED JOBS ---------------------- */
router.get('/api/savedjobs', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const savedJobs = await SavedJob.find({ userId });
    res.status(200).json(savedJobs);
  } catch (err) {
    console.error('Error fetching saved jobs:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ---------------------- DELETE SAVED JOB ---------------------- */
router.delete('/savedjobs/:jobId', async (req, res) => {
  try {
    const { userId } = req.query;
    const { jobId } = req.params;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });

    await SavedJob.deleteOne({ userId, jobId });
    res.json({ message: 'Removed from saved jobs' });
  } catch (err) {
    console.error('Error removing saved job:', err);
    res.status(500).json({ error: 'Failed to remove saved job' });
  }
});

/* ---------------------- STATS ---------------------- */
router.get('/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalJobSeekers = await User.countDocuments({ role: 'jobseeker' });
    const successRate = 95; // Static for now

    res.json({
      totalJobs,
      totalEmployers,
      totalJobSeekers,
      successRate
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});



module.exports = router;
