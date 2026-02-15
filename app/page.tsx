"use client";

import { Player } from "@remotion/player";
import { useState, useMemo, useEffect } from "react";
import { MyVideo } from "@/remotion/video";
import { saveEvent, saveFeedback, saveEmail } from "@/lib/validation";
import { Video, Palette, Music, Sparkles, Wand2, BadgeCheck, Image, LayoutTemplate } from "lucide-react";

const FRAMES_PER_LINE = 60;
const FPS = 30;

export default function Home() {
  const [script, setScript] = useState("");

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Email state
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Like/Dislike state
  const [voted, setVoted] = useState(false);
  const [voteType, setVoteType] = useState<"like" | "dislike" | null>(null);

  const lines = useMemo(() => {
    const filtered = script.split("\n").filter((line) => line.trim() !== "");
    // If empty, return placeholder
    if (filtered.length === 0) {
      return ["Enter your script"];
    }
    return filtered;
  }, [script]);

  const durationInFrames = useMemo(() => {
    // Ensure minimum of 1 frame to prevent Player errors
    return Math.max(lines.length * FRAMES_PER_LINE, FRAMES_PER_LINE);
  }, [lines]);

  // Log visit event on page load
  useEffect(() => {
    saveEvent("visit");
  }, []);

  // Handle script change
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript(e.target.value);
    saveEvent("script_paste");
  };

  // Handle like/dislike
  const handleVote = (type: "like" | "dislike") => {
    if (!voted) {
      setVoted(true);
      setVoteType(type);
      saveEvent(type);
    }
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (feedback.trim()) {
      try {
        await saveFeedback(feedback);
        await saveEvent("feedback_submit");
        setFeedbackSubmitted(true);
        setTimeout(() => {
          setFeedback("");
          setFeedbackSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Failed to submit feedback:", error);
      }
    }
  };

  // Handle email submission
  const handleEmailSubmit = async () => {
    setEmailError("");
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await saveEmail(email);
      await saveEvent("email_submit");
      setEmailSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setShowEmailInput(false);
        setEmailSubmitted(false);
      }, 3000);
    } catch (error) {
      setEmailError("Failed to save email. Please try again.");
      console.error("Failed to submit email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-50 text-zinc-900">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-20" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-zinc-200 backdrop-blur-xl bg-white/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 flex items-center justify-center shadow-lg shadow-zinc-900/20">
                  <span className="text-white font-bold text-xs">MS</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-zinc-900">MotionScripts</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-700 uppercase tracking-wider font-semibold">Beta</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 mb-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now in early access
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-700">
                Transform text into
              </span>
              <span className="block mt-2 sm:mt-3 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600">
                stunning videos
              </span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
              Create clean, professional typography videos in seconds. Perfect for social media, presentations, and more.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Input Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <label htmlFor="script" className="block text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wide">
                  Your Script
                </label>
                <textarea
                  id="script"
                  value={script}
                  onChange={handleScriptChange}
                  className="w-full h-[300px] sm:h-[400px] p-4 sm:p-6 bg-white backdrop-blur-xl border border-zinc-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 text-sm sm:text-base leading-relaxed transition-all duration-200 placeholder:text-zinc-400 hover:border-zinc-300 text-zinc-900"
                  placeholder="Paste your script here. One line per sentence."
                />
              </div>

              <div className="flex items-center gap-4 sm:gap-8 px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-zinc-100 to-zinc-50 backdrop-blur-xl border border-zinc-200 rounded-xl sm:rounded-2xl shadow-lg">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-900 tabular-nums">{lines.length}</span>
                  <span className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wide font-medium">lines</span>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-zinc-300 to-transparent" />
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-900 tabular-nums">{(durationInFrames / FPS).toFixed(1)}</span>
                  <span className="text-xs sm:text-sm text-zinc-600 uppercase tracking-wide font-medium">seconds</span>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wide">Live Preview</h2>
                <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-900/10 hover:shadow-zinc-900/20 transition-shadow duration-300 [&_iframe]:touch-none [&_div]:touch-none" style={{ WebkitTouchCallout: "none" }}>
                  <Player
                    component={MyVideo}
                    inputProps={{ lines }}
                    durationInFrames={durationInFrames}
                    fps={FPS}
                    compositionWidth={1080}
                    compositionHeight={1920}
                    style={{
                      width: "100%",
                      aspectRatio: "9/16",
                      WebkitTouchCallout: "none",
                    }}
                    controls
                    allowFullscreen
                  />
                </div>
              </div>

              {/* Like/Dislike Buttons */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => handleVote("like")}
                  disabled={voted}
                  className={`group relative overflow-hidden py-3 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 ${
                    voted && voteType === "like"
                      ? "bg-emerald-100 border-2 border-emerald-400 text-emerald-700 shadow-lg shadow-emerald-500/20"
                      : voted
                      ? "bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-900 hover:shadow-lg hover:shadow-zinc-900/10"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-2.5">
                    <span className="text-lg sm:text-xl">👍</span>
                    <span className="text-xs sm:text-sm font-semibold">Useful</span>
                  </span>
                </button>
                <button
                  onClick={() => handleVote("dislike")}
                  disabled={voted}
                  className={`group relative overflow-hidden py-3 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 ${
                    voted && voteType === "dislike"
                      ? "bg-red-100 border-2 border-red-400 text-red-700 shadow-lg shadow-red-500/20"
                      : voted
                      ? "bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed"
                      : "bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-900 hover:shadow-lg hover:shadow-zinc-900/10"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2 sm:gap-2.5">
                    <span className="text-lg sm:text-xl">👎</span>
                    <span className="text-xs sm:text-sm font-semibold">Not useful</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="max-w-2xl mx-auto mt-20 sm:mt-32 space-y-4 sm:space-y-6 px-4 sm:px-0">
            <div className="text-center space-y-2 sm:space-y-3 mb-8 sm:mb-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900">Help us improve</h3>
              <p className="text-base sm:text-lg text-zinc-600">Your feedback shapes the future of MotionScripts</p>
            </div>
            
            <div className="p-6 sm:p-8 bg-gradient-to-br from-zinc-100 to-zinc-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-2xl">
              <label htmlFor="feedback" className="block text-xs sm:text-sm font-semibold text-zinc-700 mb-4 sm:mb-5 uppercase tracking-wide">
                What would make this more useful for you?
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  id="feedback"
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFeedbackSubmit()}
                  className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white border border-zinc-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent transition-all placeholder:text-zinc-400 hover:border-zinc-300 text-zinc-900"
                  placeholder="Share your thoughts..."
                  disabled={feedbackSubmitted}
                />
                <button
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim() || feedbackSubmitted}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-zinc-800 transition-all duration-200 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed shadow-xl shadow-zinc-900/20 hover:shadow-2xl hover:shadow-zinc-900/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {feedbackSubmitted ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-2.5">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Sent
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
              {feedbackSubmitted && (
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-emerald-600 flex items-center gap-2 font-medium">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Thanks for your feedback!
                </p>
              )}
            </div>
          </div>

          {/* Email Capture Section */}
          <div className="max-w-2xl mx-auto mt-8 sm:mt-10 px-4 sm:px-0">
            <div className="p-6 sm:p-10 bg-gradient-to-br from-zinc-100 to-zinc-50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-900/10">
              {!showEmailInput ? (
                <div className="text-center space-y-6 sm:space-y-8">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-100 border border-zinc-300 mb-3 sm:mb-4">
                      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900">Coming soon: Video downloads</h3>
                    <p className="text-zinc-600 text-sm sm:text-base">Be the first to know when you can export your videos</p>
                  </div>
                  <button
                    onClick={() => setShowEmailInput(true)}
                    className="w-full py-4 sm:py-5 px-6 sm:px-8 bg-zinc-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-zinc-800 transition-all duration-200 shadow-2xl shadow-zinc-900/30 hover:shadow-zinc-900/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get notified
                  </button>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-zinc-700 uppercase tracking-wide">
                    Enter your email address
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      className="flex-1 px-4 sm:px-5 py-3 sm:py-4 bg-white border border-zinc-200 rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-transparent transition-all placeholder:text-zinc-400 hover:border-zinc-300 text-zinc-900"
                      placeholder="you@example.com"
                      disabled={emailSubmitted}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      disabled={!email.trim() || emailSubmitted}
                      className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm sm:text-base hover:bg-zinc-800 transition-all duration-200 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed shadow-xl shadow-zinc-900/20 hover:shadow-2xl hover:shadow-zinc-900/30 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {emailSubmitted ? (
                        <span className="flex items-center justify-center gap-2 sm:gap-2.5">
                          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Saved
                        </span>
                      ) : (
                        "Notify me"
                      )}
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center gap-2 font-medium">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                  {emailSubmitted && (
                    <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-2 font-medium">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      You're on the list! We'll notify you soon.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Features Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-sm text-indigo-700 mb-6 backdrop-blur-sm">
              <span className="text-lg">🚀</span>
              <span className="font-semibold">What's Next</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-4 tracking-tight">
              Upcoming Features
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
              We're constantly shipping. Here's what's coming next.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-20 sm:mb-24">
            {[
              { icon: Video, title: "Full HD video export", desc: "Download in crisp 1080p quality" },
              { icon: LayoutTemplate, title: "Curated typography templates", desc: "Pre-designed styles that look amazing" },
              { icon: Palette, title: "Custom background & text colors", desc: "Match your brand perfectly" },
              { icon: Music, title: "Background music support", desc: "Add audio tracks to your videos" },
              { icon: Wand2, title: "AI-powered pacing and Script Generation", desc: "Automatically time your scenes" },
              { icon: Sparkles, title: "Keyword auto-highlight", desc: "Emphasize important words" },
              { icon: Image, title: "Logo watermark upload", desc: "Brand your videos" }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-7 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                        <IconComponent size={22} strokeWidth={1.5} className="text-zinc-700" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-base sm:text-lg font-semibold text-zinc-900 mb-1.5 group-hover:text-zinc-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Templates Section */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-8 sm:p-12 border border-zinc-700 shadow-2xl">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white mb-6 backdrop-blur-sm">
                <LayoutTemplate size={16} strokeWidth={1.5} className="text-white" />
                <span className="font-semibold">Coming Soon</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Curated Typography Templates
              </h3>
              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
                Designed for builders and creators who value clean motion.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
              {["Minimal", "Editorial", "Bold", "Dark", "Highlight"].map((template) => (
                <div
                  key={template}
                  className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-sm sm:text-base text-white font-semibold hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-default"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <span className="relative">{template}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-lg sm:text-xl text-white font-semibold mb-2">
                Which feature should we build first?
              </p>
              <p className="text-sm sm:text-base text-zinc-400">
                Your feedback helps us prioritize what matters most
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-200 backdrop-blur-xl bg-white/80 mt-20 sm:mt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-100 flex items-center justify-center">
                  <span className="text-zinc-700 font-bold text-[10px]">MS</span>
                </div>
                <p className="text-zinc-600">© 2026 MotionScripts. Built with care.</p>
              </div>
              <div className="flex items-center gap-8">
                <a href="#" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Privacy</a>
                <a href="#" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Terms</a>
                <a href="#" className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}