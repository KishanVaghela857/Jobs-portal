const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const verifyToken = require('../middleware/authMiddleware'); // ✅ import
const mongoose = require('mongoose');
const User = require('../models/User');
const { Types } = require('mongoose');

// GET all jobs with filtering
// GET all jobs with filtering
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'UserId is required' });
  }

  try {
    const { q, location, type, experience } = req.query;

    let filter = {};

    if (q) filter.title = { $regex: q, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (experience) filter.experience = experience;

    // Find jobs matching the filter
    const jobs = await Job.find(filter);

    // If no jobs found, respond with message and empty array
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ message: 'No jobs found', jobs: [] });
    }

    // Otherwise return the list of jobs
    return res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Server error fetching jobs' });
  }
});



// post a job
router.post('/', verifyToken, async (req, res) => {
  console.log('Decoded token user:', req.user); // Debug

  const employerId = req.user._id || req.user.id || req.user.userId;

  if (!employerId) {
    return res.status(400).json({ message: 'employerId missing from token' });
  }

  try {
    const {
      title,
      description,
      location,
      type,
      postedDate,
      experience,
      salary,
      skills
    } = req.body;

    // Fetch employer profile
    const employer = await User.findById(employerId);
    const company = employer?.companyname || employer?.fullname || '';
    const companyDescription = employer?.companyDescription || '';

    if (!title || !description || !location || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newJob = await Job.create({
      title,
      description,
      location,
      type,
      postedDate,
      experience,
      salary,
      skills,
      employerId,
      company,
      companyDescription
    });

    res.status(201).json(newJob);

  } catch (err) {
    console.error('Error creating job:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});


// GET jobs by employerId with explicit empty check
router.get('/employer/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    console.log('Fetching jobs for employerId:', employerId);

    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      console.error('Invalid employerId:', employerId);
      return res.status(400).json({ error: 'Invalid employerId' });
    }

    const jobs = await Job.find({ employerId: new mongoose.Types.ObjectId(employerId) });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({ message: 'No jobs found for this employer', jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs for employer:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET job by id
router.get('/job/:id', async (req, res) => {
  const { id } = req.params;

  console.log('Request to fetch job by ID:', id);

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error('❌ Invalid job ID format:', id);
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(id);

    // If job is not found
    if (!job) {
      console.warn('⚠️ Job not found for ID:', id);
      return res.status(404).json({ error: 'Job not found' });
    }

    // Success
    console.log('✅ Job found:', job.title);
    res.json(job);
  } catch (err) {
    // Unexpected server/database error
    console.error('💥 Error while fetching job details:', err.message);
    res.status(500).json({ error: 'Server error while fetching job details' });
  }
});

// Update a job (employer only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (req.user.role !== 'employer' || String(job.employerId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this job' });
    }
    const allowedFields = ['title', 'description', 'location', 'type', 'postedDate', 'experience', 'salary', 'skills', 'company', 'companyDescription'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job', details: err.message });
  }
});

// Delete a job (employer only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid job id' });
    }
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (req.user.role !== 'employer' || String(job.employerId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job', details: err.message });
  }
});

module.exports = router;
