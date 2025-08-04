const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register route
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

    // Check if user already exists with same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Create user - password will be hashed automatically by pre('save')
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
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    let { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();
    password = password.trim();

    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
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
