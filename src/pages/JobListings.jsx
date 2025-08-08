import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const navigate = useNavigate()

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    experience: searchParams.get('experience') || '',
  })

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    successRate: 0,
  })

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('q', filters.search)
    if (filters.location) params.set('location', filters.location)
    if (filters.type) params.set('type', filters.type)
    if (filters.experience) params.set('experience', filters.experience)
    setSearchParams(params)
  }, [filters, setSearchParams])

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (filters.search) params.append('q', filters.search)
        if (filters.location) params.append('location', filters.location)
        if (filters.type) params.append('type', filters.type)
        if (filters.experience) params.append('experience', filters.experience)
        if (user?._id) params.append('userId', user._id)

        const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {}

        const response = await fetch(`${API_BASE_URL}/api/jobs?${params.toString()}`, {
          headers,
        })

        if (!response.ok) throw new Error(`Error fetching jobs: ${response.statusText}`)

        const data = await response.json()

        if (Array.isArray(data)) {
          setJobs(data)
        } else if (Array.isArray(data.jobs)) {
          setJobs(data.jobs)
        } else {
          setJobs([])
          setError(data.message || 'Invalid response from server')
        }
      } catch (err) {
        setError(err.message)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [filters, user, API_BASE_URL])

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        let successRate = 0
        if (data.totalApplications && data.totalJobs) {
          successRate = Math.min(100, Math.round((data.totalApplications / data.totalJobs) * 100))
        }
        setStats({ ...data, successRate })
      } catch {
        setError('Unable to load stats at the moment. Please try again later.')
      }
    }
    fetchStats()
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleClearExperience = () => {
    setFilters((prev) => ({ ...prev, experience: '' }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error || 'Failed to load jobs. Please try again later.'}
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">
          Available Jobs ({stats.totalJobs.toLocaleString()})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside className="bg-white p-4 rounded shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            <div className="mb-4">
              <label className="block font-medium text-sm mb-2">Job Type</label>
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={filters.type === type}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span>{type}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block font-medium text-sm mb-2">Experience</label>
              <div className="flex items-center mb-2">
                <button
                  onClick={handleClearExperience}
                  className="text-sm text-dark-600 hover:pointer"
                >
                  Select All (Clear Experience Filter)
                </button>
              </div>
              {['Entry Level', '1-3 years', '3-5 years', '5+ years'].map((exp) => (
                <div key={exp} className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="experience"
                    value={exp}
                    checked={filters.experience === exp}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Job Listing Section */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded shadow mb-4">
              <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Job title or keywords"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-2 bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
                >
                  Search Jobs
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white p-4 rounded-md shadow border hover:border-green-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-green-800">
                        <Link to={`/job/${job._id}`}>{job.title}</Link>
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {job.company || job.employerName} • {job.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {job.type}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          {job.experience}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {job.salary}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{job.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(job.skills || []).slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 4 && (
                          <span className="text-xs text-gray-500">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-sm text-gray-500">
                      <div>Posted: {new Date(job.postedDate).toLocaleDateString()}</div>
                      <button
                        onClick={() => {
                          if (!user) {
                            alert('Please login to view job details.')
                            navigate('/login')
                          } else {
                            navigate(`/job/${job._id}`)
                          }
                        }}
                        className="inline-block mt-2 text-white bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobListings
