// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { employerId, fullName, emailAddress, subject, description } = req.body;

    if (!employerId || !fullName || !emailAddress || !subject || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({
      employerId,
      fullName,
      emailAddress,
      subject,
      description,
    });

    await newContact.save();

    res.status(200).json({ message: 'Message received. Thank you for contacting us!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;
