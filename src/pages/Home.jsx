import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
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
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const handleSearch = e => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm) params.append('q', searchTerm)
    if (location) params.append('location', location)
    window.location.href = `/jobs?${params.toString()}`
  }

  const popularCategories = [
    'Work From Home',
    'Jobs for Freshers',
    'Jobs for Women',
    'Part Time Jobs',
    'Full Time Jobs'
  ]

  const featuredCompanies = ['JobsPortal', 'VanaGrow']

  const testimonials = [
    { msg: 'Landed my dream job in just 3 weeks!', author: 'Anita Sharma' },
    { msg: 'We hired top talent faster than ever.', author: 'Rohit Singh' }
  ]

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-r from-blue-700 to-teal-500 text-white text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your job search ends here</h1>
          <p className="text-lg md:text-xl mb-8">Discover lakhs of jobs with top employers</p>
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Job title, skill or company"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-md text-gray-900"
              />
            </div>
            <div className="relative flex-1">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-md text-gray-900"
              />
            </div>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-md px-8 py-3 transition">
              Search Jobs
            </button>
          </form>

          {/* Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium">
            {popularCategories.map(cat => (
              <Link
                key={cat}
                to={`/jobs?q=${encodeURIComponent(cat)}`}
                className="bg-white/30 hover:bg-white/50 text-white rounded-full px-4 py-2 transition"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Top Companies Hiring</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {featuredCompanies.map(c => (
              <div key={c} className="p-4 bg-gray-100 rounded-md shadow-sm w-40 text-center">
                <span className="text-lg font-semibold">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Courses: CodeWithHarry & Apna College */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">Top YouTube Courses</h2>

          {/* CodeWithHarry Courses */}
          <div className="mb-12">
            {/* <h3 className="text-xl font-semibold mb-4 text-blue-600">CodeWithHarry</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <a href="https://www.youtube.com/watch?v=1BsVhumGlNc" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/1BsVhumGlNc/hqdefault.jpg" alt="HTML Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">HTML Full Course</h4>
                  <p className="text-sm text-gray-600">Start web dev with this beginner HTML course.</p>
                </div>
              </a>
              <a href="https://www.youtube.com/watch?v=ESnrn1kAD4E" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/ESnrn1kAD4E/hqdefault.jpg" alt="CSS Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">CSS in Hindi</h4>
                  <p className="text-sm text-gray-600">Master styling with this detailed CSS course.</p>
                </div>
              </a>
              <a href="https://www.youtube.com/watch?v=ZzaPdXTrSb8" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/ZzaPdXTrSb8/hqdefault.jpg" alt="JavaScript Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">C++ for Beginners</h4>
                  <p className="text-sm text-gray-600">Complete JS course with hands-on examples.</p>
                </div>
              </a>
            </div>
          </div>

          {/* Apna College Courses */}
          <div>
            {/* <h3 className="text-xl font-semibold mb-4 text-pink-600">Apna College</h3> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <a href="https://www.youtube.com/watch?v=ZxKM3DCV2kE" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/ZxKM3DCV2kE/hqdefault.jpg" alt="DSA Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">DSA in Java</h4>
                  <p className="text-sm text-gray-600">Complete Data Structures & Algorithms playlist.</p>
                </div>
              </a>
              <a href="https://www.youtube.com/watch?v=Bm2YI5VtV2Y" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/Bm2YI5VtV2Y/hqdefault.jpg" alt="C++ DSA Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">C++ DSA Course</h4>
                  <p className="text-sm text-gray-600">Complete guide to DSA in C++ from scratch.</p>
                </div>
              </a>
              <a href="https://www.youtube.com/watch?v=ORxmtlB7b2U" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src="https://img.youtube.com/vi/ORxmtlB7b2U/hqdefault.jpg" alt="SQL Course" className="w-full" />
                <div className="p-4">
                  <h4 className="font-semibold">SQL for Beginners</h4>
                  <p className="text-sm text-gray-600">Learn database queries in SQL for free.</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {loading ? (
              <div className="col-span-full flex justify-center items-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <p className="col-span-full text-red-600 font-medium">{error}</p>
            ) : stats ? (
              <>
                <div>
                  <BriefcaseIcon className="mx-auto h-10 w-10 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalJobs.toLocaleString()}</div>
                  <div className="text-gray-600">Active Jobs</div>
                </div>
                <div>
                  <BuildingOfficeIcon className="mx-auto h-10 w-10 text-green-600 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalEmployers.toLocaleString()}</div>
                  <div className="text-gray-600">Companies</div>
                </div>
                <div>
                  <UserIcon className="mx-auto h-10 w-10 text-indigo-600 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalJobSeekers.toLocaleString()}</div>
                  <div className="text-gray-600">Job Seekers</div>
                </div>
                <div>
                  <ClipboardDocumentCheckIcon className="mx-auto h-10 w-10 text-yellow-500 mb-2" />
                  <div className="text-3xl font-bold">{stats.successRate}%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">What Our Users Say</h2>
          <div className="space-y-6">
            {testimonials.map((t, idx) => (
              <blockquote key={idx} className="border-l-4 border-blue-600 pl-6 italic text-gray-700">
                “{t.msg}”<br />
                <span className="font-semibold text-gray-900">— {t.author}</span>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-700 to-teal-500 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make Your Move?</h2>
        <p className="text-lg mb-8">Join crores of job seekers and trusted employers today.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/register" className="bg-yellow-400 text-gray-900 font-semibold rounded-md px-8 py-3 hover:bg-yellow-500 transition">
            Create Account
          </Link>
          <Link to="/jobs" className="border-2 border-yellow-400 text-yellow-400 font-semibold rounded-md px-8 py-3 hover:bg-yellow-400 hover:text-gray-900 transition">
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
      </footer>
    </div>
  )
}

export default Home
