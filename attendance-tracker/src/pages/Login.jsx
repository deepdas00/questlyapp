import React, { useState, useContext } from "react";
import {
  BarChart3,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  ShieldCheck,
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
      const res = await API.post("/auth/login", formData);
      setUser(res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v2H20v-2h16zm0-8v2H20v-2h16zm10-8v2H10v-2h36zM46 10v2H10v-2h36zM20 42v2h16v-2H20zm0 8v2h16v-2H20z' fill='%23000'/%3E%3C/svg%3E")` }} 
      />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-100/40 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-100/40 rounded-full blur-[120px]" />

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Subtle Progress Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 h-1.5 w-full" />

          <div className="p-10">
            {/* Logo Section */}
            <div className="flex justify-between items-start mb-10">
              <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-sm">
                <BarChart3 className="h-7 w-7 text-indigo-600" />
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Secure Link</span>
              </div>
            </div>

            {/* Typography */}
            <div className="mb-10">
              <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-none">
                Welcome back
              </h1>
              <p className="text-slate-500 mt-3 text-base">
                Please enter your details to access your portal.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@university.edu"
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <button 
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white/70" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-bold text-slate-900 hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;