const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String },
  postedDate: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Job', jobSchema)
