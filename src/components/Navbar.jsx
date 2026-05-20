// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:animate-wiggle transition-all">🎂</span>
          <span className="font-display font-bold text-xl text-white">
            Birthday<span className="text-pink-400">Circle</span>
          </span>
        </Link>

        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-white">
                {userProfile?.name || user.displayName}
              </span>
              <span className="text-xs text-white/40">
                {user.email}
              </span>
            </div>

            {/* Avatar */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-pink-500/50 hover:border-pink-400 transition-all"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                    {(userProfile?.name || user.displayName || "U")[0].toUpperCase()}
                  </div>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-44 bg-[#1a1a2e] border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    🏠 Dashboard
                  </Link>
                  <Link
                    to="/create-group"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    ➕ Create Group
                  </Link>
                  <Link
                    to="/join-group"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    🔗 Join Group
                  </Link>
                  <hr className="border-white/10" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
