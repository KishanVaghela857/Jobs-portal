import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'jobseeker',
    companyName: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        fullname: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
        role: formData.userType,
        phone: formData.phone.trim(),
        ...(formData.userType === 'employer' && { companyname: formData.companyName.trim() })
      };

      const result = await register(userData);

      if (result.success) {
        navigate(formData.userType === 'jobseeker' ? '/jobseeker-dashboard' : '/employer-dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-3xl p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Your Account</h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
              <div className="flex gap-4">
                {['jobseeker', 'employer'].map((type) => (
                  <label
                    key={type}
                    className={`flex-1 cursor-pointer border rounded-lg px-4 py-3 text-sm font-medium text-center transition shadow-sm ${
                      formData.userType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={formData.userType === type}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {type === 'jobseeker' ? 'Job Seeker' : 'Employer'}
                  </label>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Company Name */}
            {formData.userType === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl text-base font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
