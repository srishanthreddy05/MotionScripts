"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { LogOut } from "lucide-react";

interface Metrics {
  totalVisits: number;
  likes: number;
  dislikes: number;
  scriptPastes: number;
  waitlistEmails: number;
  feedbackCount: number;
}

interface Event {
  type: "visit" | "like" | "dislike" | "script_paste";
  timestamp: number;
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    totalVisits: 0,
    likes: 0,
    dislikes: 0,
    scriptPastes: 0,
    waitlistEmails: 0,
    feedbackCount: 0,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const isAuth = typeof window !== "undefined" && localStorage.getItem("ms_admin") === "true";
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  // Set up real-time listeners when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribers: (() => void)[] = [];

    // Listen to events
    const eventsRef = ref(database, "validation/events");
    const unsubscribeEvents = onValue(
      eventsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const eventsData = snapshot.val();
          const eventsList = Object.values(eventsData) as Event[];

          const newMetrics = {
            totalVisits: eventsList.filter((e) => e.type === "visit").length,
            likes: eventsList.filter((e) => e.type === "like").length,
            dislikes: eventsList.filter((e) => e.type === "dislike").length,
            scriptPastes: eventsList.filter((e) => e.type === "script_paste").length,
            waitlistEmails: 0,
            feedbackCount: 0,
          };

          setMetrics((prev) => ({ ...prev, ...newMetrics }));
        }
      },
      (error) => {
        console.error("Error fetching events:", error);
      }
    );
    unsubscribers.push(unsubscribeEvents);

    // Listen to emails
    const emailsRef = ref(database, "validation/emails");
    const unsubscribeEmails = onValue(
      emailsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const emailsData = snapshot.val();
          const emailCount = Object.keys(emailsData).length;
          setMetrics((prev) => ({ ...prev, waitlistEmails: emailCount }));
        } else {
          setMetrics((prev) => ({ ...prev, waitlistEmails: 0 }));
        }
      },
      (error) => {
        console.error("Error fetching emails:", error);
      }
    );
    unsubscribers.push(unsubscribeEmails);

    // Listen to feedback
    const feedbackRef = ref(database, "validation/feedback");
    const unsubscribeFeedback = onValue(
      feedbackRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const feedbackData = snapshot.val();
          const feedbackCount = Object.keys(feedbackData).length;
          setMetrics((prev) => ({ ...prev, feedbackCount }));
        } else {
          setMetrics((prev) => ({ ...prev, feedbackCount: 0 }));
        }
      },
      (error) => {
        console.error("Error fetching feedback:", error);
      }
    );
    unsubscribers.push(unsubscribeFeedback);

    // Cleanup
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const correctKey = process.env.NEXT_PUBLIC_DASHBOARD_KEY;

    if (!correctKey) {
      setError("Dashboard key not configured");
      return;
    }

    if (key === correctKey) {
      localStorage.setItem("ms_admin", "true");
      setIsAuthenticated(true);
      setKey("");
    } else {
      setError("Invalid key. Please try again.");
      setKey("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ms_admin");
    setIsAuthenticated(false);
    setMetrics({
      totalVisits: 0,
      likes: 0,
      dislikes: 0,
      scriptPastes: 0,
      waitlistEmails: 0,
      feedbackCount: 0,
    });
  };

  const conversionRate =
    metrics.totalVisits > 0 ? ((metrics.waitlistEmails / metrics.totalVisits) * 100).toFixed(2) : "0.00";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-zinc-400 text-sm">Enter your secret key to access</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="key" className="block text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wide">
                  Secret Key
                </label>
                <input
                  id="key"
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-3 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter your key..."
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-800/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-white font-bold text-lg">MS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MotionScripts Admin</h1>
                <p className="text-xs text-zinc-400">Real-time Analytics Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all duration-200"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Visits */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Total Visits</p>
                <p className="text-4xl font-bold text-white tabular-nums">{metrics.totalVisits.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl">
                👁️
              </div>
            </div>
          </div>

          {/* Likes */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Likes</p>
                <p className="text-4xl font-bold text-emerald-400 tabular-nums">{metrics.likes.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl">
                👍
              </div>
            </div>
          </div>

          {/* Dislikes */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Dislikes</p>
                <p className="text-4xl font-bold text-red-400 tabular-nums">{metrics.dislikes.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-xl">
                👎
              </div>
            </div>
          </div>

          {/* Script Pastes */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Script Pastes</p>
                <p className="text-4xl font-bold text-purple-400 tabular-nums">
                  {metrics.scriptPastes.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-xl">
                📝
              </div>
            </div>
          </div>

          {/* Waitlist Emails */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Waitlist Emails</p>
                <p className="text-4xl font-bold text-yellow-400 tabular-nums">
                  {metrics.waitlistEmails.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center text-xl">
                ✉️
              </div>
            </div>
          </div>

          {/* Feedback Count */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-zinc-600">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-zinc-400 text-sm font-medium mb-2">Feedback</p>
                <p className="text-4xl font-bold text-pink-400 tabular-nums">{metrics.feedbackCount.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center text-xl">
                💬
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-3">Conversion Rate</p>
              <p className="text-5xl font-bold text-emerald-400 tabular-nums">{conversionRate}%</p>
              <p className="text-xs text-zinc-500 mt-2">
                {metrics.waitlistEmails} emails → {metrics.totalVisits} visits
              </p>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">{conversionRate}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-700 bg-zinc-800/30 backdrop-blur-xl mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-center text-zinc-400 text-sm">
            Last updated: {new Date().toLocaleTimeString()} | Real-time updates enabled
          </p>
        </div>
      </footer>
    </div>
  );
}
