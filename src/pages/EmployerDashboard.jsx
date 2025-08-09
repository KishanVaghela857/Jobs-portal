import React, { useState, useEffect } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'
import axios from 'axios';
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom';

const API_URL = "http://localhost:5000/api"; // Adjust for your backend

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [postedJobs, setPostedJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
  const experienceLevels = ["Entry Level", "1-3 years", "3-5 years", "5+ years"];
  const skillOptions = ["JavaScript", "React", "Node.js", "CSS", "HTML", "Python", "AWS"];

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "",
    experience: "",
    skills: "", // comma separated string
  });

  const employerId = user?._id;
  const role = user?.role || "employer"; // fallback

  // Fetch posted jobs
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const res = await fetch(`${API_URL}/jobs/employer/${employerId}`, { headers });
      const data = await res.json();

      if (Array.isArray(data)) {
        setPostedJobs(data);
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setPostedJobs(data.jobs);
      } else {
        setPostedJobs([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).token : null;
      const employerId = user?._id;
  
      if (!token || !employerId) {
        console.error("No token or employer ID found");
        return;
      }
  
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      const res = await axios.get(`${API_URL}/applications/employer/${employerId}`, config);
  
      setApplicants(res.data); // res.data will be grouped by job, as returned by backend
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };
  

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
      fetchApplicants();
    }
  }, [user]);

  const [showForm, setShowForm] = useState(false);
  const handlePostNewJob = () => setShowForm(true);

  const handleFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleSubmitJob = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = user?.token || savedUser?.token;
    const userId = user?._id || savedUser?._id;

    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }

    const skillsArray = jobForm.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...jobForm,
          skills: skillsArray,
          employerId: userId,
          postedDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to post job");
        return;
      }

      await fetchDashboardData();
      setShowForm(false);
      setJobForm({
        title: "",
        description: "",
        location: "",
        salary: "",
        type: "",
        experience: "",
        skills: "",
      });
      setSelectedSkills([]);
      setSelectedJobType("");
      setSelectedExperience("");
      alert("Job posted successfully");
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

    // After you fetch postedJobs and applicants
    const totalJobsPosted = postedJobs.length;
    const totalApplicants = applicants.reduce((sum, jobGroup) => sum + jobGroup.applicants.length, 0);

  const handleEditJob = (jobId) => {
    alert(`Open edit form for job ID: ${jobId}`);
  };

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      const response = await fetch(`${API_URL}/employer/jobs/${jobId}`, {
        method: "DELETE",
        headers,
      });

      const text = await response.text();
      if (!response.ok) throw new Error(`Failed to delete job: ${text}`);

      setPostedJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("Job deleted successfully.");
    } catch (error) {
      alert(error.message || "Failed to delete job.");
    }
  };

  const tabs = [
    { id: "overview", name: "Overview", icon: BuildingOfficeIcon },
    { id: "jobs", name: "Posted Jobs", icon: BriefcaseIcon },
    { id: "applicants", name: "Applicants", icon: UserGroupIcon },
    { id: "profile", name: "Company Profile", icon: BuildingOfficeIcon },
  ];

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setJobForm((form) => {
      const newSkills = selectedSkills.includes(skill)
        ? selectedSkills.filter((s) => s !== skill)
        : [...selectedSkills, skill];
      return {
        ...form,
        skills: newSkills.join(", "),
      };
    });
  };

  const handleJobTypeChange = (e) => {
    setSelectedJobType(e.target.value);
    setJobForm((form) => ({ ...form, type: e.target.value }));
  };

  const handleExperienceChange = (e) => {
    setSelectedExperience(e.target.value);
    setJobForm((form) => ({ ...form, experience: e.target.value }));
  };

  const renderOverview = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <p>Welcome to your dashboard, <strong>{user?.name || 'User'}</strong>. Here's a quick summary of your activity:</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <BuildingOfficeIcon className="mx-auto h-10 w-10 text-blue-600 mb-2" />
          <p className="text-3xl font-bold">{totalJobsPosted}</p>
          <p className="text-gray-600">Jobs Posted</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center">
          <UserGroupIcon className="mx-auto h-10 w-10 text-green-600 mb-2" />
          <p className="text-3xl font-bold">{totalApplicants}</p>
          <p className="text-gray-600">Total Applicants</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 text-center">
          <BriefcaseIcon className="mx-auto h-10 w-10 text-purple-600 mb-2" />
          <p className="text-base text-gray-700 mt-2">
            {postedJobs.length === 0
              ? "No jobs posted yet"
              : "Check 'Posted Jobs' tab to manage your job posts and applicants."}
          </p>
        </div>
      </div>
    </div>
  );

  const renderPostedJobs = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
        <button
          onClick={handlePostNewJob}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Job Post
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-xl mx-auto">
          <input
            name="title"
            placeholder="Job Title"
            value={jobForm.title}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={jobForm.description}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            name="location"
            placeholder="Location"
            value={jobForm.location}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            name="salary"
            placeholder="Salary (e.g., 60000-80000)"
            value={jobForm.salary}
            onChange={handleFormChange}
            className="block w-full mb-4 p-2 border rounded"
          />

          {/* Job Type Dropdown */}
          <label className="block mb-1 font-medium text-gray-700">Job Type</label>
          <select
            value={selectedJobType}
            onChange={handleJobTypeChange}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="" disabled>Select job type</option>
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Skills Multi-select */}
          <label className="block mb-1 font-medium text-gray-700">Skills</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {skillOptions.map(skill => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                    }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          <label className="block mb-1 font-medium text-gray-700">Experience</label>
          <select
            value={selectedExperience}
            onChange={handleExperienceChange}
            className="block w-full mb-4 p-2 border rounded"
          >
            <option value="" disabled>Select Experience</option>
            {experienceLevels.map(Etype => (
              <option key={Etype} value={Etype}>{Etype}</option>
            ))}
          </select>

          <button
            onClick={handleSubmitJob}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Submit Job
          </button>
        </div>
      )}

      {postedJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You have not posted any jobs yet.</p>
          <button
            onClick={handlePostNewJob}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {postedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Left Side */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link to={`/job/${job._id}`}>{job.title}</Link>
                  </h2>
                  <div className="text-gray-500 text-sm mt-1 flex items-center flex-wrap gap-2">
                    <span className="font-medium">{job.company || job.employerName || 'Company'}</span>
                    <span className="text-gray-400">•</span>
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    <span>{job.location || 'Location not specified'}</span>
                  </div>

                  <p className="text-gray-600 mt-3 mb-4 line-clamp-2">{job.description || 'No description provided'}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.type && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {job.type}
                      </span>
                    )}
                    {job.experience && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                        {job.experience}
                      </span>
                    )}
                    {job.salary && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {(job.skills || []).slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {(job.skills && job.skills.length > 4) && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col justify-between items-end text-right">
                  <span className="text-sm text-gray-400">
                    Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Unknown'}
                  </span>
                  <Link
                    to={`/job/${job._id}`}
                    className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderApplicants = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Applicants</h2>
      {applicants.length === 0 ? (
        <p className="text-gray-500">No applicants have applied to your jobs yet.</p>
      ) : (
        applicants.map((jobGroup) => (
          <div key={jobGroup.jobId} className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">
              Job: {jobGroup.jobTitle}
            </h3>
            <p className="mb-2 text-sm text-gray-600">
              Total Applicants: {jobGroup.applicants.length}
            </p>
            {jobGroup.applicants.length === 0 ? (
              <p className="text-sm text-gray-500">No applicants for this job.</p>
            ) : (
              <ul className="space-y-3">
                {jobGroup.applicants.map((applicant) => (
                  <li key={applicant.applicationId} className="border border-gray-200 rounded p-3">
                    <p className="font-medium text-gray-800">{applicant.fullname}</p>
                    <p className="text-sm text-gray-600">{applicant.email}</p>
                    <p className="text-sm text-gray-600">
                      Resume:{" "}
                      <a
                        href={`http://localhost:5000/${applicant.resumeUrl}`}  // adjust base URL if needed
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                        download
                      >
                        Download
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      Applied on: {new Date(applicant.appliedAt).toLocaleDateString()}
                    </p>
                    {applicant.coverLetter && (
                      <p className="text-sm text-gray-600 italic">Cover Letter: {applicant.coverLetter}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
  

  const renderProfile = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
      <p>This section is under construction.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center focus:outline-none ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </nav>
      </div>

      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'jobs' && renderPostedJobs()}
        {activeTab === 'applicants' && renderApplicants()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  )
}

export default EmployerDashboard
