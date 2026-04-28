import React, { useState, useContext } from "react";
import {
  BarChart3,
  Lock,
  Mail,
  ArrowRight,
} from "lucide-react";

import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔥 Login API

      console.log(formData);
      
      const res = await API.post("/auth/login", formData);

      // 🔥 Save user in context
      setUser(res.data.user);

      // 🔥 Redirect
      navigate("/home");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-md z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-blue-600 p-3 rounded-2xl shadow-xl mb-4">
            <BarChart3 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-500 mt-2">
            Access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border rounded-[32px] p-8 shadow-xl">

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@university.edu"
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border rounded-2xl py-4 pl-12"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border rounded-2xl py-4 pl-12"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={20} />}
            </button>

          </form>

          {/* REGISTER LINK */}
          <p className="mt-6 text-center text-sm">
            New user?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer"
            >
              Create Account
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;