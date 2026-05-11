import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // { type: 'error' | 'success', message: '' }

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const notify = (type, message) => {
    setStatus({ type, message });
    if (type === "success") setTimeout(() => setStatus({ type: "", message: "" }), 5000);
  };

  const handleSendOtp = async () => {
    if (!email) return notify("error", "Please enter your email address");
    try {
      setLoading(true);
      await API.post("/auth/send-otp", { email });
      setStep(2);
      setTimer(30);
      notify("success", "Security code sent to your inbox");
    } catch (err) {
      notify("error", "We couldn't find an account with that email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await API.post("/auth/verify-otp", { email, otp });
      setStep(3);
      notify("success", "Identity verified successfully");
    } catch {
      notify("error", "Invalid or expired security code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) return notify("error", "Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return notify("error", "Passwords do not match");

    try {
      setLoading(true);
      await API.post("/auth/reset-password", { email, newPassword });
      setStep(4); // Success state
    } catch {
      notify("error", "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Progress Header */}
          <div className="h-1.5 w-full bg-slate-100 flex">
             <div className={`h-full transition-all duration-500 bg-indigo-600 ${
               step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
             }`} />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900">
                {step === 1 && "Reset your password"}
                {step === 2 && "Enter security code"}
                {step === 3 && "Set new password"}
                {step === 4 && "All set!"}
              </h2>
              <p className="text-slate-500 mt-2 text-sm">
                {step === 1 && "We'll send a recovery code to your email."}
                {step === 2 && `We sent a 6-digit code to ${email}`}
                {step === 3 && "Choose a strong password to protect your account."}
              </p>
            </div>

            {/* Error/Success Messages */}
            {status.message && step !== 4 && (
              <div className={`mb-6 p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {status.message}
              </div>
            )}

            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Link"}
                </button>
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-center tracking-[0.5em] font-mono text-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify Code"}
                </button>
                <div className="text-center">
                  <button
                    onClick={handleSendOtp}
                    disabled={timer > 0 || loading}
                    className="text-sm font-medium text-indigo-600 disabled:text-slate-400"
                  >
                    {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code? Resend"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Update Password"}
                </button>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="text-center space-y-6 py-4">
                <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <p className="text-slate-600">Your password has been successfully updated. You can now log in with your new credentials.</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-slate-900 hover:bg-black text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        {step < 4 && (
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : window.history.back()}
            className="w-full mt-8 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;