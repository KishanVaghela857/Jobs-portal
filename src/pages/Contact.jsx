import React, { useState } from 'react'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const user = JSON.parse(localStorage.getItem('user'));
const employerId = user?._id; 

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    subject: '',
    description: ''
  });
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Add employerId here (replace with your actual ID or fetch it from context)
      const payload = {
        ...formData,
        employerId: employerId
      };
      console.log(formData)
  
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error('Failed to submit contact form');
      setSubmitted(true);
      setFormData({ fullName: '', emailAddress: '', subject: '', description: '' });
    } catch (err) {
      alert('Failed to submit contact form');
    } finally {
      setLoading(false);
    }
  };
  const contactInfo = [
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: 'Email',
      content: 'vaghelakishan857@gmail.com',
      link: 'mailto:vaghelakishan857@gmail.com'
    },
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: 'Phone',
      content: '+91 9723405985',
      link: 'tel:+9723405985'
    },
    // {
    //   icon: <MapPinIcon className="h-6 w-6" />,
    //   title: 'Address',
    //   content: '123 Job Street, Tech City, TC 12345',
    //   link: null
    // },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-6PM IST',
      link: null
    }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600">Get in touch with our team for any questions or support</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">


  {/* Contact Form */}
  <div className=" rounded-2xl p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a message</h2>

    {submitted ? (
      <div className="text-center py-12">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for contacting us. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
        >
          Send Another Message
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="How can we help you?"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Write your message here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    )}
  </div>


        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our platform? Need help with your account? 
              We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 text-primary-600">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">Need immediate help?</h3>
            <p className="text-primary-700 mb-4">
              Check out our FAQ section for quick answers to common questions.
            </p>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View FAQ →
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I create an account?</h3>
            <p className="text-gray-600">
              Click the "Register" button in the top navigation and fill out the registration form. 
              You can choose to register as either a job seeker or employer.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I apply for a job?</h3>
            <p className="text-gray-600">
              Browse jobs on our platform, click on a job that interests you, and use the "Apply" 
              button to submit your application with a resume and cover letter.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I post a job?</h3>
            <p className="text-gray-600">
              Register as an employer, go to your dashboard, and click "Post New Job" to create 
              a detailed job listing with all the necessary information.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my information secure?</h3>
            <p className="text-gray-600">
              Yes, we use industry-standard security measures to protect your personal information 
              and ensure your data is safe and confidential.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact 