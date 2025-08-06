const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { verifyToken } = require('../middleware/auth');

// 6. Apply for a Job (Job Seeker)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { jobId, jobseekerId, resume, coverLetter } = req.body;
    const newApplication = new Application({ jobId, jobseekerId, resume, coverLetter });
    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

// 7. Employer: Get All Applications for Their Jobs
router.get('/employer/applications', verifyToken, async (req, res) => {
  try {
    // You can filter by employer's ID in a real use-case
    const applications = await Application.find().populate('jobId jobseekerId');
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// 8. Job Seeker: Get All Applied Jobs
router.get('/jobseeker/applications', verifyToken, async (req, res) => {
  try {
    const jobseekerId = req.user.id;
    const applications = await Application.find({ jobseekerId }).populate('jobId');
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch job seeker applications' });
  }
});

// Get all applicants for an employer's jobs
router.get('/employer/applicants', verifyToken, async (req, res) => {
  try {
    const { employerId } = req.query;
    if (!employerId) return res.status(400).json({ error: 'Missing employerId' });
    // Find all jobs posted by this employer
    const jobs = await require('../models/Job').find({ employerId });
    const jobIds = jobs.map(job => job._id);
    // Find all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } }).populate('jobId jobseekerId');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employer applicants' });
  }
});

module.exports = router;
