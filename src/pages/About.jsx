import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BriefcaseIcon, 
  UserGroupIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const About = () => {
  const features = [
    {
      icon: <BriefcaseIcon className="h-8 w-8 text-primary-600" />,
      title: 'Job Search',
      description: 'Find your dream job with our smart and intuitive platform.'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      title: 'Talent Match',
      description: 'Connecting skilled professionals with the right opportunities.'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-600" />,
      title: 'Wide Reach',
      description: 'Opportunities for everyone, everywhere.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-600" />,
      title: 'Trusted Platform',
      description: 'Built with care and trust to protect your career journey.'
    }
  ]

  const stats = [
    { number: '120+', label: 'Trusted Companies' },
    { number: '500+', label: 'Live Jobs' },
    { number: '1000+', label: 'Registered Users' },
    { number: '100%', label: 'Data Privacy' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About JobPortal</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Built with passion to connect opportunities with talent. JobPortal helps job seekers and recruiters achieve more.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            We aim to bridge the gap between companies and candidates with a platform that is fast, secure, and reliable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Job Seekers</h3>
              <p className="text-gray-600">
                Discover jobs tailored to your skills and ambitions. Your next opportunity is just a search away.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Employers</h3>
              <p className="text-gray-600">
                Reach the right talent faster. Our tools simplify the hiring process for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JobPortal?</h2>
          <p className="text-lg text-gray-600">
            Designed for success and simplicity.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Progress So Far</h2>
          <p className="text-xl">
            A growing community and platform that evolves with your needs.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Creator</h2>
          <p className="text-lg text-gray-600">
            The mind behind JobPortal
          </p>
        </div>
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Kishan</h3>
          <p className="text-gray-600">Developer & Founder</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our platform today and take the next step in your career or hiring journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Create Account
            </Link>
            <Link to="/jobs" className="btn-secondary">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
