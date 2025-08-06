const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

async function migrateEmployerIds() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const jobs = await Job.find();
  for (const job of jobs) {
    if (!mongoose.Types.ObjectId.isValid(job.employerId)) {
      // Try to find employer by email or name if possible (customize as needed)
      const employer = await User.findOne({ email: job.employerEmail });
      if (employer) {
        job.employerId = employer._id;
        await job.save();
        console.log(`Fixed employerId for job ${job._id}`);
      } else {
        console.warn(`Could not fix employerId for job ${job._id}`);
      }
    }
  }
  console.log('Migration complete.');
  process.exit();
}

migrateEmployerIds();
