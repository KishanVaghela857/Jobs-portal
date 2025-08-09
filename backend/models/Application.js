const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
jobSeekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  coverLetter: { type: String },
  resume: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
