const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';


const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true,
  },
  fullname: { type: String, required: true },
  companyname: { type: String }, // only for employer
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Password hashing before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token method
userSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email,
      fullname: this.fullname,
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = mongoose.model('User', userSchema);
