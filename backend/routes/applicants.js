const express = require('express')
const router = express.Router()
const Applicant = require('../models/Applicant')

// Create new applicant
router.post('/', async (req, res) => {
  try {
    const { jobId, name, email, resumeUrl } = req.body
    if (!jobId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const newApplicant = new Applicant({ jobId, name, email, resumeUrl })
    await newApplicant.save()

    // You may want to increase applicationsCount in Job here

    res.status(201).json(newApplicant)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
