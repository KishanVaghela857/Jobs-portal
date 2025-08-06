const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  salary: { type: String, required: true },
  type: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
  skills: {
    type: [String], // Array of skills
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Under Review', 'Rejected', 'Accepted'],
    default: 'New',
  },
});

module.exports = mongoose.model('Application', applicationSchema);
