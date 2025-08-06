const express = require('express');
const router = express.Router();

// For demo, just log the contact form data
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Here you could save to DB or send email
    console.log('Contact form submission:', { name, email, subject, message });
    res.status(200).json({ message: 'Message received. Thank you for contacting us!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;