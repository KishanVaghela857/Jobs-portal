import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  UserIcon,
  BookmarkIcon,
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

const JobSeekerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [applications, setApplications] = useState([])
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showApplySuccess, setShowApplySuccess] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      setError(null) // Clear previous errors
      try {
        const res1 = await fetch(`http://localhost:5000/api/applications?userId=${user._id}`)
        // const res2 = await fetch(`http://localhost:5000/api/savedjobs?userId=${user._id}`)

        // Check for errors except 404 (which means no data)
        if (!res1.ok && res1.status !== 404) throw new Error('Applications fetch failed')
        // if (!res2.ok && res2.status !== 404) throw new Error('Saved jobs fetch failed')

        // Parse responses if ok
        const apps = res1.ok ? (await res1.json()).map(app => ({ ...app, id: app._id || app.id })) : []
        // const saved = res2.ok ? (await res2.json()).map(job => ({ ...job, id: job._id || job.id })) : []

        setApplications(apps)
        // setSavedJobs(saved)
      } catch (err) {
        console.error(err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchDashboardData()
    }
  }, [user])

  const handleApplyToJob = async (job) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_BASE_URL}/api/apply-job`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        },
        body: JSON.stringify({
          userId: user._id,
          jobId: job.jobId || job.id,
          jobTitle: job.title,
          company: job.company,
          resume: 'N/A',
          coverLetter: ''
        })
      })

      if (!res.ok) throw new Error('Application failed')

      const newApplication = await res.json()
      setApplications(prev => [newApplication, ...prev])
      setSavedJobs(prev => prev.filter(saved => saved.jobId !== (job.jobId || job.id)))

      setShowApplySuccess(true)
      setTimeout(() => setShowApplySuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert('Failed to apply to job.')
    }
  }

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const res = await fetch(`${API_BASE_URL}/api/savedjobs/${jobId}?userId=${user._id}`, {
        method: 'DELETE',
        headers: user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {}
      })
      if (!res.ok) throw new Error('Remove failed')

      setSavedJobs(prev => prev.filter(job => job.jobId !== jobId && job.id !== jobId))
    } catch (err) {
      console.error(err)
      alert('Failed to remove saved job.')
    }
  }

  if (loading) return <div className="text-center py-20 text-lg">Loading dashboard data...</div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'applications', name: 'My Applications', icon: DocumentTextIcon },
    { id: 'saved', name: 'Saved Jobs', icon: BookmarkIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon }
  ]

  const renderOverview = () => {
    if (applications.length === 0) {
      return (
        <div className="bg-white p-6 shadow rounded-xl text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Applications Yet</h3>
          <p className="text-gray-600 mb-4">
            You have not applied to any jobs yet. Start exploring and applying to jobs now!
          </p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow rounded-xl text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{applications.length}</div>
            <div className="text-gray-600">Applications</div>
          </div>
          <div className="bg-white p-6 shadow rounded-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{savedJobs.length}</div>
            <div className="text-gray-600">Saved Jobs</div>
          </div>
          <div className="bg-white p-6 shadow rounded-xl text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
            <div className="text-gray-600">Profile Views</div>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {applications.slice(0, 3).map(app => (
              <div key={app._id || app.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                  <Link to={`/job/${app.jobId?._id || app.jobId || app.id}`} className="text-indigo-600 hover:text-indigo-500 text-sm">View Job</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderApplications = () => (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        applications.map(app => (
          <div key={app._id || app.id} className="bg-white p-6 shadow rounded-xl">
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
                <Link to={`/job/${app.jobId?._id || app.jobId || app.id}`} className="text-indigo-600 hover:text-indigo-500 text-sm">View Job</Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderSavedJobs = () => (
    <div className="space-y-4">
      {savedJobs.length === 0 ? (
        <p className="text-center text-gray-500">No saved jobs found.</p>
      ) : (
        savedJobs.map(job => (
          <div key={job._id || job.id} className="bg-white p-6 shadow rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location} • {job.salary}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link to={`/job/${app.jobId?._id || app.jobId || app.id}`} className="text-indigo-600 hover:text-indigo-500 text-sm">View Job</Link>
                <button onClick={() => handleRemoveSavedJob(job.jobId || job.id)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                <button onClick={() => handleApplyToJob(job)} className="text-green-600 hover:text-green-700 text-sm">Apply</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const renderProfile = () => (
    <div className="bg-white p-6 shadow rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
        {/* <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
          <PencilIcon className="h-4 w-4 mr-1" /> Edit Profile
        </button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <p className="text-gray-900">{user?.name || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Seeker Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" /> {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      {showApplySuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-bold mb-4">Application Submitted!</h2>
            <p>Your application has been successfully submitted.</p>
            <button
              onClick={() => setShowApplySuccess(false)}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
