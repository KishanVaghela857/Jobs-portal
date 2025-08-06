import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { PencilIcon } from '@heroicons/react/24/outline'

const Profile = () => {
  const { user, updateProfile } = useAuth()

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    companyname: '',
  })

  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phone: user.phone || '',
        companyname: user.companyname || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-500 mt-2">Keep your account information up-to-date</p>
        </div>
        {/* <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button> */}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.fullname || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.email || 'Not provided'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                />
              ) : (
                <p className="text-gray-900 text-lg">{user?.phone || 'Not provided'}</p>
              )}
            </div>

            {user?.role === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="companyname"
                    value={formData.companyname}
                    onChange={handleChange}
                    className="w-full border rounded-md px-4 py-2"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{user?.companyname || 'Not provided'}</p>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
