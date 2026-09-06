import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, ArrowRight, ShieldCheck, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/dashboard";

  const handleGoogleSignIn = async () => {
    try {
      setError(""); setSubmitting(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in both fields."); return; }
    try {
      setError(""); setSubmitting(true);
      if (isRegister) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const perks = [
    "Upload & store your policy documents",
    "Ask any coverage or claim question",
    "Get plain-language answers, instantly",
    "Your data stays private and secure",
  ];

  return (
    <div className="min-h-[90vh] flex">

      {/* Left panel — navy branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary-900 dark:bg-primary-950 flex-col justify-between p-12">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-14">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-secondary-400" />
            </div>
            <span className="font-serif text-xl text-white">Finesse</span>
          </div>

          {/* Headline */}
          <h2 className="font-serif text-3xl text-white leading-snug mb-4">
            Know Your Policy.<br />Know Your Rights.
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-10">
            Stop guessing what your insurance covers. Get clear, cited answers
            from your own policy document — in seconds.
          </p>

          {/* Perk list */}
          <ul className="space-y-3.5">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle className="w-4 h-4 text-secondary-400 mt-0.5 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        </div>

        {/* Document card illustration */}
        <div className="bg-white/8 border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <FileText className="w-4 h-4 text-secondary-400" />
            <span className="text-xs text-primary-200 font-medium">Health Policy — FY 2024-25</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1.5">
            <div className="flex justify-between">
              <span>Sum Insured</span>
              <span className="text-white">₹10,00,000</span>
            </div>
            <div className="flex justify-between">
              <span>Waiting Period</span>
              <span className="text-secondary-400">2 years (specific)</span>
            </div>
            <div className="flex justify-between">
              <span>Day-Care Cover</span>
              <span className="text-green-400">Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-primary-700 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-lg text-slate-900 dark:text-white">Finesse</span>
          </div>

          <h1 className="font-serif text-2xl text-slate-900 dark:text-white mb-1">
            {isRegister ? "Create your account" : "Sign in to Finesse"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-7">
            {isRegister
              ? "Start understanding your insurance policy today."
              : "Welcome back — your documents and chats are waiting."}
          </p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-60 mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 dark:bg-slate-900 px-3 text-xs text-slate-400 uppercase tracking-wide">or with email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-60"
            >
              {isRegister ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="text-primary-700 dark:text-primary-400 font-semibold hover:underline"
            >
              {isRegister ? "Sign In" : "Create one"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
