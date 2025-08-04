import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  BuildingOfficeIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const EmployerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const [postedJobs, setPostedJobs] = useState([])
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Replace these with your real API endpoints
        const jobsResponse = await fetch('/api/employer/jobs')
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs')
        const jobsData = await jobsResponse.json()

        const applicantsResponse = await fetch('/api/employer/applicants')
        if (!applicantsResponse.ok) throw new Error('Failed to fetch applicants')
        const applicantsData = await applicantsResponse.json()

        setPostedJobs(jobsData)
        setApplicants(applicantsData)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Placeholder action handlers
  const handlePostNewJob = () => {
    alert('Open job posting form or modal here.')
  }

  const handleEditJob = (jobId) => {
    alert(`Open edit form for job ID: ${jobId}`)
  }

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?')
    if (!confirmDelete) return

    try {
      // Replace with your DELETE API call
      // await fetch(`/api/employer/jobs/${jobId}`, { method: 'DELETE' })

      // For demo, just filter out the job locally
      setPostedJobs(prev => prev.filter(job => job.id !== jobId))
      alert('Job deleted successfully.')
    } catch (error) {
      alert('Failed to delete job.')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  // Count for Overview tab
  const activeJobsCount = postedJobs.length
  const totalApplicantsCount = applicants.length
  const profileViewsCount = 5 // You can fetch or calculate this dynamically
  const interviewsCount = 3    // Same here

  // Tabs config
  const tabs = [
    { id: 'overview', name: 'Overview', icon: BuildingOfficeIcon },
    { id: 'jobs', name: 'Posted Jobs', icon: BriefcaseIcon },
    { id: 'applicants', name: 'Applicants', icon: UserGroupIcon },
    { id: 'profile', name: 'Company Profile', icon: BuildingOfficeIcon }
  ]

  // --- Render functions ---

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{activeJobsCount}</div>
          <div className="text-gray-600">Active Jobs</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{totalApplicantsCount}</div>
          <div className="text-gray-600">Total Applicants</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{profileViewsCount}</div>
          <div className="text-gray-600">Profile Views</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{interviewsCount}</div>
          <div className="text-gray-600">Interviews</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            {applicants.slice(0, 3).map(applicant => (
              <div key={applicant.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{applicant.name}</h4>
                  <p className="text-sm text-gray-600">{applicant.jobTitle}</p>
                  <p className="text-xs text-gray-500">
                    Applied {new Date(applicant.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  applicant.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  applicant.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {applicant.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Job Postings</h3>
          <div className="space-y-3">
            {postedJobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.location} • {job.type}</p>
                  <p className="text-xs text-gray-500">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-primary-600">{job.applications} applications</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderPostedJobs = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Posted Jobs</h3>
        <button className="btn-primary flex items-center" onClick={handlePostNewJob}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Post New Job
        </button>
      </div>

      {postedJobs.map(job => (
        <div key={job.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.location} • {job.type}</p>
              <p className="text-sm text-gray-500">
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-semibold text-primary-600">{job.applications}</div>
                <div className="text-sm text-gray-500">applications</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
                <button className="text-primary-600 hover:text-primary-700" onClick={() => handleEditJob(job.id)}>
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="text-red-600 hover:text-red-700" onClick={() => handleDeleteJob(job.id)}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderApplicants = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">All Applicants</h3>
      
      {applicants.map(applicant => (
        <div key={applicant.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{applicant.name}</h3>
              <p className="text-gray-600">{applicant.email}</p>
              <p className="text-sm text-gray-500">
                Applied for {applicant.jobTitle} on {new Date(applicant.appliedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                applicant.status === 'New' ? 'bg-blue-100 text-blue-800' :
                applicant.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {applicant.status}
              </span>
              <button className="btn-secondary text-sm">View Profile</button>
              <button className="btn-primary text-sm">Contact</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderProfile = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Company Profile</h3>
        <button className="btn-secondary text-sm">
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <p className="text-gray-900">{user?.companyName || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
          <p className="text-gray-900">{user?.name || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
          <p className="text-gray-900">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
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
