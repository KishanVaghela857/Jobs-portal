const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { verifyToken } = require('../middleware/auth');

// EMPLOYER: Get All Applications (raw data)
router.get('/employer/applications', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const jobs = await Job.find({ postedBy: req.user.id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId')
      .populate('jobSeekerId');

    res.status(200).json({ applications });
  } catch (err) {
    console.error('Error fetching employer applications:', err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// JOB SEEKER: Get Their Applications
router.get('/jobseeker', verifyToken, async (req, res) => {
  try {
    const jobSeekerId = req.user.id;
    const applications = await Application.find({ jobSeekerId })
      .populate('jobId');

    res.status(200).json({ applications });
  } catch (err) {
    console.error('Error fetching job seeker applications:', err);
    res.status(500).json({ error: 'Failed to fetch job seeker applications' });
  }
});




module.exports = router;
