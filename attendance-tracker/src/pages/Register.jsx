import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  User, 
  Mail, 
  Lock, 
  ArrowRight
} from 'lucide-react';

import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
  
    
    const res = await API.post("/auth/register", {
      name: formData.fullName,
      email: formData.email,
      password: formData.password
    });

    alert("Account created successfully ✅");

    navigate("/home"); // already logged in

  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">

      {/* LEFT SIDE */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-white p-2 rounded-lg">
              <BarChart3 className="text-blue-600 w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">SmartStudent</span>
          </div>

          <h2 className="text-4xl font-bold mb-6">
            Join the elite circle of <br />
            <span className="text-blue-200">organized students.</span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="text-blue-300" size={20} />
              <p className="text-blue-100 italic">
                "Boost your CGPA with smart tracking."
              </p>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="text-blue-300" size={20} />
              <p className="text-blue-100">
                Smart attendance + bunk prediction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">

          <h1 className="text-3xl font-extrabold mb-2">
            Create Account
          </h1>

          <p className="text-slate-500 mb-8">
            Start managing your academic life.
          </p>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-bold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  name="fullName"
                  className="w-full pl-10 py-3 border rounded-xl"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-bold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  className="w-full pl-10 py-3 border rounded-xl"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-10 py-3 border rounded-xl"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2"
            >
              {loading ? "Creating..." : "Sign Up"}
              {!loading && <ArrowRight size={20} />}
            </button>

          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?
            <span 
              onClick={() => navigate("/login")}
              className="text-blue-600 ml-1 cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;