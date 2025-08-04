import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    type: '',
    experience: '',
    salary: ''
  })

  // Mock job data - replace with API call
  const mockJobs = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$80,000 - $120,000',
      experience: '3-5 years',
      description: 'We are looking for a senior React developer to join our team...',
      postedDate: '2024-01-15',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js']
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$70,000 - $100,000',
      experience: '1-3 years',
      description: 'Join our fast-growing startup as a frontend developer...',
      postedDate: '2024-01-14',
      skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML']
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'BigTech Solutions',
      location: 'Remote',
      type: 'Contract',
      salary: '$90,000 - $130,000',
      experience: '5+ years',
      description: 'We need a full stack engineer with strong backend skills...',
      postedDate: '2024-01-13',
      skills: ['React', 'Node.js', 'Python', 'MongoDB']
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Design Studio',
      location: 'Los Angeles, CA',
      type: 'Part-time',
      salary: '$60,000 - $80,000',
      experience: '2-4 years',
      description: 'Creative UI/UX designer needed for our design team...',
      postedDate: '2024-01-12',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research']
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs)
      setLoading(false)
    }, 1000)
  }, [])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.search) params.append('q', filters.search)
    if (filters.location) params.append('location', filters.location)
    setSearchParams(params)
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !filters.search ||
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesLocation = !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase())

    const matchesType = !filters.type || job.type === filters.type
    const matchesExperience = !filters.experience || job.experience === filters.experience

    return matchesSearch && matchesLocation && matchesType && matchesExperience
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Job</h1>
        <p className="text-gray-600">Browse thousands of job opportunities</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Job title, company, or keywords"
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field pl-10"
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
                className="input-field pl-10"
              />
            </div>

            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Job Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>

            <select
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Experience Level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="btn-primary"
            >
              Search Jobs
            </button>

            <div className="text-sm text-gray-600">
              {filteredJobs.length} jobs found
            </div>
          </div>
        </form>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-3 text-lg font-semibold text-gray-800">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  </h2>
                  <div className="text-gray-500 text-sm mt-1 flex items-center flex-wrap gap-2">
                    <span className="font-medium">{job.company}</span>
                    <span className="text-gray-400">•</span>
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{job.location}</span>
                  </div>

                  <p className="text-gray-600 mt-3 mb-4 line-clamp-2">{job.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                      {job.type}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                      {job.experience}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                      {job.salary}
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {job.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 4 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-between items-end text-right">
                  <span className="text-sm text-gray-400">
                    Posted: {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default JobListings 