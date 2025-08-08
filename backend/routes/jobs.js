const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const verifyToken = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const User = require('../models/User');
// GET all jobs with filtering and excluding applied jobs if userId is present
router.get('/', async (req, res) => {
  try {
    const { q, location, type, experience, userId } = req.query;

    let query = {};

    if (q) {
      query.title = { $regex: q, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (experience) {
      query.experience = experience;
    }

    // ✅ Exclude applied jobs only if userId is passed
    if (userId) {
      const appliedJobs = await Application.find({ jobseekerId: userId }).distinct('jobId');
      query._id = { $nin: appliedJobs };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// Post a job
router.post('/', verifyToken, async (req, res) => {
  const employerId = req.user._id || req.user.id || req.user.userId;
  if (!employerId) return res.status(400).json({ message: 'employerId missing from token' });

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

    const employer = await User.findById(employerId);
    const company = employer?.companyname || employer?.fullname || '';
    const companyDescription = employer?.companyDescription || '';

    if (!title || !description || !location || !type) {
      return res.status(400).json({ error: 'Required fields are missing' });
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

// GET jobs by employerId
router.get('/employer/:employerId', async (req, res) => {
  try {
    const { employerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employerId)) {
      return res.status(400).json({ error: 'Invalid employerId' });
    }

    const jobs = await Job.find({ employerId });
    if (!jobs.length) {
      return res.status(200).json({ message: 'No jobs found for this employer', jobs: [] });
    }

    res.json(jobs);
  } catch (err) {
    console.error('Error fetching jobs for employer:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// GET job by ID
router.get('/job/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid job ID' });
  }

  try {
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching job details' });
  }
});

// Update a job
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid job id' });

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (req.user.role !== 'employer' || String(job.employerId) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to edit this job' });
    }

    const allowedFields = [
      'title', 'description', 'location', 'type', 'postedDate',
      'experience', 'salary', 'skills', 'company', 'companyDescription'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update job', details: err.message });
  }
});

// Delete a job
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid job id' });

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
