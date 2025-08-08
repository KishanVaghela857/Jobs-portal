import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import axios from 'axios';
import {
  MapPinIcon,
  BriefcaseIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:5000';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { hasApplied } = useApplications();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    resume: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJob() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/jobs/job/${id}`);
        if (!res.ok) throw new Error('Failed to fetch job');
        const data = await res.json();
        setJob(data);
      } catch (error) {
        setError('Failed to load job details. Please try again later.');
        setJob(null);
      }
      setLoading(false);
    }
    fetchJob();
  }, [id]);

  const handleApplicationChange = (e) => {
    const { name, value, files } = e.target;
    setApplication((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };


  const handleApply = async (e) => {
    e.preventDefault();
  
    if (!application.coverLetter.trim()) {
      alert('Please enter a cover letter');
      return;
    }
  
    if (!application.resume) {
      alert('Please upload your resume');
      return;
    }
  
    if (!job._id) {
      alert('Job ID is missing');
      return;
    }
  
    setApplying(true);
  
    try {
      const formData = new FormData();
      formData.append('userId', user._id); // ✅ Required by backend
      formData.append('jobId', job._id);
      formData.append('coverLetter', application.coverLetter);
      formData.append('resume', application.resume);
  
      const token = localStorage.getItem('token');
  
      await axios.post(
        'http://localhost:5000/api/dashboard/apply-job',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      setShowModal(true);
      setApplication({ coverLetter: '', resume: null });
    } catch (error) {
      console.error('Apply job error:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };
  

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error || 'Failed to load job details. Please try again later.'}
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
        <Link to="/jobs" className="btn-primary">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const alreadyApplied = hasApplied(job._id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/jobs"
          className="text-primary-600 hover:text-primary-500 mb-4 inline-block"
        >
          ← Back to Jobs
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title || 'No title provided'}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">
                    {job.company || job.employerName || 'Unknown Company'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {job.salary}
                </div>
                <div className="text-sm text-gray-500">Annual Salary</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span>{job.type}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{job.experience}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Job Description
            </h2>
            <div className="prose max-w-none">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Company Description */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About {job.company || job.employerName || 'the company'}
            </h2>
            <p className="text-gray-700">
              {job.companyDescription || 'No company description provided.'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Section */}
          {user?.role === 'jobseeker' ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Apply for this position
              </h3>

              {alreadyApplied ? (
                <div className="p-4 bg-green-100 border border-green-300 rounded text-green-700">
                  You have already applied to this job.
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6 p-6 rounded-2xl shadow-lg max-w-xl mx-auto border border-gray-100">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Apply for this Job</h2>
                  <p className="text-sm text-gray-500 mb-4">Fill in the details below to submit your application.</p>

                  {/* Cover Letter */}
                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      rows={6}
                      value={application.coverLetter}
                      onChange={handleApplicationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                      placeholder="Tell us why you're interested in this position..."
                      required
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                      Resume / CV <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleApplicationChange}
                      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>

              )}
            </div>
          ) : !user ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Apply for this position
              </h3>
              <p className="text-gray-600 mb-4">Sign in to apply for this job</p>
              <Link to="/login" className="btn-primary w-full text-center">
                Sign In to Apply
              </Link>
            </div>
          ) : null}

          {/* Job Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Job Type:</span>
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{job.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary:</span>
                <span className="font-medium">{job.salary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
            <ul className="space-y-2">
              {(job.benefits || []).map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Email:</span>
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  {job.contactEmail}
                </a>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="font-medium mr-2">Phone:</span>
                <a
                  href={`tel:${job.contactPhone}`}
                  className="text-primary-600 hover:text-primary-500"
                >
                  {job.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-semibold text-green-700">
              Application Submitted!
            </h3>
            <p>Your application has been successfully submitted.</p>
            <div>
              <strong>Cover Letter:</strong>
              <p className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-2">
                {application.coverLetter}
              </p>
            </div>
            <div>
              <strong>Resume File:</strong> {application.resume?.name || 'N/A'}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn-primary mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
