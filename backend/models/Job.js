const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  type: String,
  postedDate: Date,
  experience: String,
  salary: String,
  skills: [String],  // array of strings
  company: String,
  companyDescription: String,
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
