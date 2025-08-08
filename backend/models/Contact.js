// models/Contact.js
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema); // ✅ Fixed name
