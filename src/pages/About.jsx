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
      description: 'Find your dream job with our comprehensive search and filtering options.'
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      title: 'Talent Pool',
      description: 'Connect with qualified candidates from diverse backgrounds and experiences.'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-600" />,
      title: 'Global Reach',
      description: 'Access opportunities and talent from around the world.'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8 text-primary-600" />,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Active Jobs' },
    { number: '5,000+', label: 'Companies' },
    { number: '50,000+', label: 'Job Seekers' },
    { number: '95%', label: 'Success Rate' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About JobPortal</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're on a mission to connect talented professionals with amazing opportunities. 
          Our platform makes job hunting and hiring simple, efficient, and effective.
        </p>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-8">
            To create the most trusted and efficient job marketplace that empowers both job seekers 
            and employers to find their perfect match. We believe that everyone deserves to work 
            in a role they love, and every company deserves to find the right talent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Job Seekers</h3>
              <p className="text-gray-600">
                Find opportunities that match your skills, experience, and career goals. 
                Our advanced search and recommendation system helps you discover the perfect role.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Employers</h3>
              <p className="text-gray-600">
                Access a diverse pool of qualified candidates. Our platform streamlines the 
                hiring process and helps you find the right talent quickly and efficiently.
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
            We provide the tools and features you need for successful job hunting and hiring.
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
      <section className="py-16 bg-gray-500 text-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-primary-100">
            Trusted by thousands of job seekers and employers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-primary-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600">
            Meet the passionate team behind JobPortal
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">John Smith</h3>
            <p className="text-gray-600">CEO & Founder</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
            <p className="text-gray-600">CTO</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Mike Davis</h3>
            <p className="text-gray-600">Head of Product</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of job seekers and employers who trust our platform
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