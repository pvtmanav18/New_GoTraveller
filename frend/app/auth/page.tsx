"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/auth-provider";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";

export default function AuthPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If user is already authenticated, redirect to home/planner
  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleFirebaseError = (error: any) => {
    console.error("Firebase auth error:", error);
    const code = error.code || "";
    if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password")) {
      return "Invalid email address or password.";
    }
    if (code.includes("auth/email-already-in-use")) {
      return "An account with this email address already exists.";
    }
    if (code.includes("auth/weak-password")) {
      return "Password should be at least 6 characters.";
    }
    if (code.includes("auth/invalid-email")) {
      return "Please enter a valid email address.";
    }
    if (code.includes("auth/popup-closed-by-user")) {
      return "Google sign-in popup was closed before completion.";
    }
    return error.message || "An unexpected error occurred during authentication.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setAuthLoading(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setErrorMsg("");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err: any) {
      setErrorMsg(handleFirebaseError(err));
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading || (user && !authLoading)) {
    return (
      <div className="min-h-screen bg-[#02050a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02050a] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Abstract Glowing Backdrop */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 space-y-6 border border-slate-800/80 shadow-2xl relative z-10 bg-[#070b16]/30">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-2 select-none">
            <Sparkles className="w-3.5 h-3.5" />
            AI Travel Concierge
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-slate-50">
            {isSignUp ? "Begin Your Journey" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 font-sans max-w-[80%] mx-auto leading-relaxed">
            {isSignUp 
              ? "Create your GoTraveller account to plan, coordinate, and save global itineraries." 
              : "Sign in to access your curated Travel Vault and active itineraries."}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex justify-between items-center animate-fade-in select-text">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg("")} className="font-bold hover:text-white transition-colors pl-2">
              ✕
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050810]/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-xs focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20 transition-all font-medium placeholder-slate-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050810]/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 text-xs focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20 transition-all font-medium placeholder-slate-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-550 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050810]/70 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-slate-100 text-xs focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20 transition-all font-medium placeholder-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/40 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md shadow-yellow-400/5 hover:shadow-yellow-400/10 active:scale-[0.99] select-none mt-2"
          >
            {authLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-850"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold font-sans select-none">
            or continue with
          </span>
          <div className="flex-grow border-t border-slate-850"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
          className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-200 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.99] select-none"
        >
          {/* Flat Google logo icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.63 5.63 0 0 1 8.35 13a5.63 5.63 0 0 1 5.64-5.6c1.55 0 2.96.6 4.02 1.575l3.226-3.225A9.95 9.95 0 0 0 13.99 2C8.47 2 4 6.47 4 12s4.47 10 9.99 10c5.805 0 9.65-4.085 9.65-9.815 0-.585-.05-1.285-.15-1.9H12.24Z"
            />
          </svg>
          <span>Google Account</span>
        </button>

        {/* Form Toggle Link */}
        <div className="text-center text-xs font-sans mt-2">
          <span className="text-slate-500">
            {isSignUp ? "Already have an account? " : "New to GoTraveller? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
            }}
            className="text-yellow-400 font-bold hover:underline transition-all"
          >
            {isSignUp ? "Sign In" : "Register Now"}
          </button>
        </div>

      </div>
    </div>
  );
}
