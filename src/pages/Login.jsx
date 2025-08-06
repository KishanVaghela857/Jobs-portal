import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "jobseeker", // or "employer"
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
  
    // Debug logs
    console.log("Logging in with:", {
      email: formData.email,
      password: formData.password,
      userType: formData.userType,
    });
  
    try {
      const result = await login(formData.email, formData.password, formData.userType);
      console.log('Login result:', result);
      if (result.success) {
        navigate(formData.userType === "jobseeker" ? "/jobseeker-dashboard" : "/employer-dashboard");
      } else {
        setError(result.error || "Login failed")
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login");
    }
};

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-center text-2xl font-bold mb-4">Login</h2>
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
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
