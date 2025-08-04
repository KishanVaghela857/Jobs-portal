const mongoose = require('mongoose')

const applicantSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  resumeUrl: { type: String }, // optional
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['New', 'Under Review', 'Rejected', 'Hired'], default: 'New' }
})

module.exports = mongoose.model('Applicant', applicantSchema)
