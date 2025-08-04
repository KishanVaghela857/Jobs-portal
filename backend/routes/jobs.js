const express = require('express')
const router = express.Router()
const Job = require('../models/Job')

// Create new job post
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/jobs body:', req.body)  // Debug log
    const { employerId, title, description, location, type } = req.body
    if (!employerId || !title || !description || !location) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newJob = new Job({ employerId, title, description, location, type })
    await newJob.save()
    res.status(201).json(newJob)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all jobs for an employer
router.get('/:employerId', async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId }).sort({ postedDate: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update job post by ID
router.put('/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId
    const updates = req.body
    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, { new: true })
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' })
    res.json(updatedJob)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete job post by ID
router.delete('/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId
    const deletedJob = await Job.findByIdAndDelete(jobId)
    if (!deletedJob) return res.status(404).json({ error: 'Job not found' })
    res.json({ message: 'Job deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
