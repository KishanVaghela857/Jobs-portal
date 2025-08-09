const express = require('express');
const router = express.Router();
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Your User model path

const verificationCodes = {}; // In-memory store: { email: { code: '123456', expires: Date } }

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
}

// Send verification code (without user in DB)
router.post('/send-verification-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const code = generateCode();
  const expires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes

  verificationCodes[email.toLowerCase()] = { code, expires };

  try {
    await sendVerificationEmail(email, code);
    res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Verify code endpoint
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

  const record = verificationCodes[email.toLowerCase()];
  if (!record) return res.status(400).json({ error: 'No verification code sent to this email' });

  if (record.expires < Date.now()) {
    delete verificationCodes[email.toLowerCase()];
    return res.status(400).json({ error: 'Verification code expired' });
  }

  if (record.code !== code) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  // Code is valid — delete it
  delete verificationCodes[email.toLowerCase()];

  res.json({ verified: true, message: 'Email verified successfully' });
});

router.post('/register', async (req, res) => {
  try {
    let { fullname, email, phone, password, role, companyname } = req.body;

    if (!email || !password || !role || !fullname || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();
    fullname = fullname.trim();
    phone = phone.trim();
    password = password.trim();
    companyname = companyname?.trim() || '';

    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email and role' });
    }

    // Hash password before save
    // const bcrypt = require('bcryptjs');
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      phone,
      password,      // plain password here
      role,
      companyname,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();
    password = password.trim();

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT (directly here instead of relying on model)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        companyname: user.companyname,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
