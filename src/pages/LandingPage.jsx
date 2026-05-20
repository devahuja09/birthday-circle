// src/pages/LandingPage.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { emoji: "🎂", title: "Birthday Countdowns", desc: "See exactly how many days until each friend's birthday" },
    { emoji: "🎉", title: "Birthday Mode", desc: "Special celebration page with confetti when it's someone's day" },
    { emoji: "💌", title: "Wish Board", desc: "Post heartfelt birthday messages for your group members" },
    { emoji: "🔗", title: "Private Groups", desc: "Create or join groups with a simple invite code" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-[300px] h-[300px] bg-fuchsia-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-float">🎂</span>
          <span className="font-display font-bold text-2xl text-white">
            Birthday<span className="text-pink-400">Circle</span>
          </span>
        </div>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn-secondary text-sm"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-2 rounded-full mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <span className="text-pink-300 text-sm font-medium">Never miss a birthday again</span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-slide-up">
          Celebrate every{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-violet-400">
            birthday
          </span>{" "}
          together
        </h1>

        <p className="text-white/50 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in">
          Create a private group with your friends. Add birthdays. Watch the countdown.
          When the day arrives — the whole website celebrates.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center gap-3 bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95 text-lg disabled:opacity-70"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>

        {/* Social proof */}
        <p className="text-white/25 text-sm mt-8">
          Free to use · No credit card · Private & secure
        </p>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="card p-6 hover:border-white/20 hover:bg-white/8 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-32 text-center">
        <h2 className="font-display font-bold text-3xl text-white mb-12">How it works</h2>
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/50 to-transparent hidden sm:block" />
          {[
            { step: "01", text: "Sign in with your Google account" },
            { step: "02", text: "Set up your profile and add your birthday" },
            { step: "03", text: "Create a group or join one with an invite code" },
            { step: "04", text: "Watch the countdown — and celebrate together!" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 mb-8 text-left">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))",
                  border: "1px solid rgba(236,72,153,0.3)",
                  color: "#f9a8d4",
                }}
              >
                {item.step}
              </div>
              <p className="text-white/70 text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-white/20 text-sm">
          Made for friend groups who care 🎂
        </p>
      </div>
    </div>
  );
}
