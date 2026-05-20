// src/pages/ProfileSetup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const { user, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || "");
  const [birthday, setBirthday] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!birthday) { setError("Please enter your birthday."); return; }

    // Don't allow future dates that are clearly wrong (born in future)
    const bday = new Date(birthday);
    const now = new Date();
    if (bday > now) { setError("Birthday can't be in the future!"); return; }

    setSaving(true);
    try {
      await saveProfile({ name: name.trim(), birthday });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-float">🎈</div>
          <h1 className="font-display font-black text-3xl text-white mb-2">
            Set up your profile
          </h1>
          <p className="text-white/40 text-sm">
            Just two things — we promise to keep it simple
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSave} className="card p-8 space-y-6">
          {/* Avatar preview */}
          {user?.photoURL && (
            <div className="flex justify-center">
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-20 h-20 rounded-full border-2 border-pink-500/50"
              />
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Display Name <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should your friends call you?"
              className="input-field"
              maxLength={40}
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Your Birthday <span className="text-pink-400">*</span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="input-field"
              max={new Date().toISOString().split("T")[0]}
            />
            <p className="text-xs text-white/30 mt-2">
              Only the day and month are shared with your group (not the year).
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? "Saving..." : "Let's Go! 🚀"}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-6">
          Your birthday is only visible to members of groups you join.
        </p>
      </div>
    </div>
  );
}
