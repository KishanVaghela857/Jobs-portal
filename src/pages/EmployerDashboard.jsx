import React, { useState, useEffect } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const [postedJobs, setPostedJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState(null)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [Experience, setSelectedExperience] = useState('');

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experience = ['Entry Level', '1-3 years', '3-5 years', '5+ years', 'Remote'];
  const skillOptions = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'AWS'];

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    type: '',
    experience: '',
    skills: '',  // comma separated string
  })

  const employerId = user?._id

  const fetchDashboardData = async () => {

    
  const token = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')).token
  : null;

    try {
      setLoading(true);
      setError(null);
  
      const headers = user.token ? { Authorization: `Bearer ${user.token}` } : {};
  
      const res = await fetch(`/api/jobs/employer/${employerId}`, { headers });
      const data = await res.json();
      // console.log('Jobs API response:', data);
  
      if (Array.isArray(data)) {
        setPostedJobs(data);
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setPostedJobs(data.jobs);
      } else {
        setPostedJobs([]);
      }
  
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const fetchApplicants = async () => {
    try {
      // Get user from localStorage
      const userFromStorage = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null;
  
      if (!userFromStorage || !userFromStorage.token || !userFromStorage.id) {
        throw new Error("Token or user ID not found in localStorage");
      }

  
      const backendUrl = 'http://localhost:5000'; 
  
      const response = await fetch(`${backendUrl}/api/applications/employer/${userFromStorage.id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error(errorData.message || 'Failed to fetch applicants');
      }
  
      const data = await response.json();
      setApplicants(data);
    } catch (err) {
      console.error("Fetch Applicants Error:", err.message);
      setApplicants([]);
    }
  };
  
  
  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
      fetchApplicants();
    }
  }, [user])

  const [showForm, setShowForm] = useState(false)

  const handlePostNewJob = () => setShowForm(true)

  const handleFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value })
  }


  const handleSubmitJob = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const token = user?.token || savedUser?.token;
    const userId = user?._id || savedUser?._id;

    if (!token) {
      alert('Authentication token missing. Please login again.');
      return;
    }

    const skillsArray = jobForm.skills.split(',').map(s => s.trim()).filter(Boolean);

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...jobForm,
        skills: skillsArray,
        employerId: userId,
        postedDate: new Date().toISOString(),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(data.message || 'Failed to post job');
      return;
    }

    await fetchDashboardData();

    setShowForm(false);
    setJobForm({
      title: '',
      description: '',
      location: '',
      salary: '',
      type: '',
      experience: '',
      skills: '',
    });
    setSelectedSkills([]);
    setSelectedJobType('');
    setSelectedExperience('');

    alert('Job posted successfully');
  };

  const handleEditJob = (jobId) => {
    alert(`Open edit form for job ID: ${jobId}`)
  }

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?')
    if (!confirmDelete) return

    try {
      const headers = user.token ? { Authorization: `Bearer ${user.token}` } : {}

      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: 'DELETE',
        headers,
      })

      const text = await response.text()
      if (!response.ok) throw new Error(`Failed to delete job: ${text}`)

      setPostedJobs(prev => prev.filter(job => job._id !== jobId))
      alert('Job deleted successfully.')
    } catch (error) {
      alert(error.message || 'Failed to delete job.')
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BuildingOfficeIcon },
    { id: 'jobs', name: 'Posted Jobs', icon: BriefcaseIcon },
    { id: 'applicants', name: 'Applicants', icon: UserGroupIcon },
    { id: 'profile', name: 'Company Profile', icon: BuildingOfficeIcon },
  ]

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setJobForm(form => {
      const newSkills = selectedSkills.includes(skill)
        ? selectedSkills.filter(s => s !== skill)
        : [...selectedSkills, skill];
      return {
        ...form,
        skills: newSkills.join(', ')
      }
    });
  };

  const handleJobTypeChange = (e) => {
    setSelectedJobType(e.target.value);
    setJobForm(form => ({ ...form, type: e.target.value }));
  };
  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
    setJobForm(form => ({ ...form, experience: e.target.value }));
  };

  const renderOverview = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <p>Welcome to your dashboard. Use the tabs above to manage jobs, view applicants, and update your company profile.</p>
    </div>
  )

  const renderPostedJobs = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        <button
          onClick={handlePostNewJob}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Job Post
        </button>
      </div>
  
      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-xl mx-auto">
          <input
            name="title"
            placeholder="Job Title"
            value={jobForm.title}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={jobForm.description}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            name="location"
            placeholder="Location"
            value={jobForm.location}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            name="salary"
            placeholder="Salary (e.g., 60000-80000)"
            value={jobForm.salary}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
  
          {/* Job Type Dropdown */}
          <label className="block mb-1 font-medium text-gray-700">Job Type</label>
          <select
            value={selectedJobType}
            onChange={handleJobTypeChange}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="" disabled>Select job type</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
  
          {/* Skills Multi-select */}
          <label className="block mb-1 font-medium text-gray-700">Skills</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {skillOptions.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
  
          <label className="block mb-1 font-medium text-gray-700">Experience</label>
<select
  value={Experience}
  onChange={handleExperienceChange}
  className="block w-full mb-4 p-2 border rounded"
>
  <option value="" disabled>Select Experience</option>
  {experience.map(Etype => (
    <option key={Etype} value={Etype}>{Etype}</option>
  ))}
</select>
  
          <button
            onClick={handleSubmitJob}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Submit Job
          </button>
        </div>
      )}
  
      {postedJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You have not posted any jobs yet.</p>
          <button
            onClick={handlePostNewJob}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {postedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link to={`/job/${job._id}`}>{job.title}</Link>
                  </h2>
                  <div className="text-gray-500 text-sm mt-1 flex items-center flex-wrap gap-2">
                    <span className="font-medium">{job.company || job.employerName || 'Company'}</span>
                    <span className="text-gray-400">•</span>
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{job.location || 'Location not specified'}</span>
                  </div>
  
                  <p className="text-gray-600 mt-3 mb-4 line-clamp-2">{job.description || 'No description provided'}</p>
  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.type && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {job.type}
                      </span>
                    )}
                    {job.experience && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                        {job.experience}
                      </span>
                    )}
                    {job.salary && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        {job.salary}
                      </span>
                    )}
                  </div>
  
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {(job.skills || []).slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.skills && job.skills.length > 4) && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
  
                {/* Right Side */}
                <div className="flex flex-col justify-between items-end text-right">
                  <span className="text-sm text-gray-400">
                    Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Unknown'}
                  </span>
                  <Link
                    to={`/job/${job._id}`}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderApplicants = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants have applied to your jobs yet.</p>
      ) : (
        applicants.map((jobApplicationGroup, index) => (
          <div key={index} className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Job: {jobApplicationGroup.jobTitle || 'Untitled Job'}
            </h3>
            {jobApplicationGroup.applicants.length === 0 ? (
              <p className="text-sm text-gray-500">No applicants for this job.</p>
            ) : (
              <ul className="space-y-3">
                {jobApplicationGroup.applicants.map((applicant, idx) => (
                  <li key={idx} className="border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-800">{applicant.fullname}</p>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm text-gray-600">Resume: <a href={applicant.resumeUrl} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">View</a></p>
                    <p className="text-sm text-gray-600">Applied on: {new Date(applicant.appliedAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderProfile = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
      <p>This section is under construction.</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center focus:outline-none ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'jobs' && renderPostedJobs()}
        {activeTab === 'applicants' && renderApplicants()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  )
}

export default EmployerDashboard
