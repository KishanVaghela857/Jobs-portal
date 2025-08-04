import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import {
  UserIcon,
  BriefcaseIcon,
  BookmarkIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

const JobSeekerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  // Replace with your real API call or context fetching
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showApplySuccess, setShowApplySuccess] = useState(false)

  // Example fetching user data - replace with real fetch
  useEffect(() => {
    setLoading(true)
    setError(null)

    // Simulate fetching from backend
    setTimeout(() => {
      // Mock data, replace with API results
      setApplications([
        {
          id: 1,
          jobTitle: 'Senior React Developer',
          company: 'TechCorp Inc.',
          status: 'Applied',
          appliedDate: '2024-01-15',
          jobId: 1
        },
        {
          id: 2,
          jobTitle: 'Frontend Developer',
          company: 'StartupXYZ',
          status: 'Under Review',
          appliedDate: '2024-01-10',
          jobId: 2
        }
      ])

      setSavedJobs([
        {
          id: 1,
          title: 'Full Stack Engineer',
          company: 'BigTech Solutions',
          location: 'Remote',
          salary: '$90,000 - $130,000',
          jobId: 3
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  // Simulate Apply Job function
  const handleApplyToJob = (job) => {
    // Here call your API to apply to the job, then update state
    const newApplication = {
      id: Date.now(),
      jobTitle: job.title,
      company: job.company,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      jobId: job.jobId || job.id,
    }
    setApplications(prev => [newApplication, ...prev])

    // Optionally remove from saved jobs on apply
    setSavedJobs(prev => prev.filter(saved => saved.jobId !== job.jobId))

    setShowApplySuccess(true)
    setTimeout(() => setShowApplySuccess(false), 3000) // auto close modal after 3s
  }

  // Remove saved job handler
  const handleRemoveSavedJob = (jobId) => {
    // Call API if needed, then update state
    setSavedJobs(prev => prev.filter(job => job.jobId !== jobId))
  }

  if (loading) return <div className="text-center py-20">Loading...</div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'applications', name: 'My Applications', icon: DocumentTextIcon },
    { id: 'saved', name: 'Saved Jobs', icon: BookmarkIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">{applications.length}</div>
          <div className="text-gray-600">Applications</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{savedJobs.length}</div>
          <div className="text-gray-600">Saved Jobs</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
          <div className="text-gray-600">Profile Views</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
        <div className="space-y-4">
          {applications.slice(0, 3).map(app => (
            <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{app.jobTitle}</h4>
                <p className="text-gray-600">{app.company}</p>
                <p className="text-sm text-gray-500">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>{app.status}</span>
                <Link to={`/jobs/${app.jobId}`} className="text-primary-600 hover:text-primary-500 text-sm">View Job</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderApplications = () => (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{app.jobTitle}</h3>
              <p className="text-gray-600">{app.company}</p>
              <p className="text-sm text-gray-500">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>{app.status}</span>
              <Link to={`/jobs/${app.jobId}`} className="btn-secondary text-sm">View Job</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderSavedJobs = () => (
    <div className="space-y-4">
      {savedJobs.map(job => (
        <div key={job.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location} • {job.salary}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Link to={`/jobs/${job.jobId}`} className="btn-primary text-sm">View Job</Link>
              <button
                onClick={() => handleRemoveSavedJob(job.jobId)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
              <button
                onClick={() => handleApplyToJob(job)}
                className="btn-secondary text-sm ml-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderProfile = () => (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        <button className="btn-secondary text-sm">
          <PencilIcon className="h-4 w-4 mr-1" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
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
          <p className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Seeker Dashboard</h1>
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

      {/* Apply success modal */}
      {showApplySuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-bold mb-4">Application Submitted!</h2>
            <p>Your application has been successfully submitted.</p>
            <button
              onClick={() => setShowApplySuccess(false)}
              className="btn-primary mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'saved' && renderSavedJobs()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  )
}

export default JobSeekerDashboard
