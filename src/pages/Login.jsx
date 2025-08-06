import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "jobseeker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password, formData.userType);
      if (result.success) {
        navigate(formData.userType === "jobseeker" ? "/jobseeker-dashboard" : "/employer-dashboard");
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Side */}
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Hire top talent in 48 hours with Jobs Portal.</h2>
          <p className="text-gray-600 mb-4">
            Streamline your recruitment with AI-driven precision.<br />
            Single solution from Fresher to experienced hiring.
          </p>
          <hr className="my-4" />
          <div className="flex gap-8 text-green-700 font-semibold text-lg">
            {/* <div>
              <div>6 crore+</div>
              <div className="text-sm text-gray-600">Qualified candidates</div>
            </div> */}
            <div>
              <div>10+</div>
              <div className="text-sm text-gray-600">Employers use apna</div>
            </div>
            <div>
              <div>50+</div>
              <div className="text-sm text-gray-600">Available Jobs</div>
            </div>
          </div>
        </div>

        {/* Right Side (Login Form) */}
        <div className="bg-gray-50 p-8">
          <h2 className="text-xl font-bold mb-4">Let’s get started</h2>
          <p className="text-sm text-gray-600 mb-6">Hire top talent faster with apna</p>
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1">I am a</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white p-2 rounded disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
