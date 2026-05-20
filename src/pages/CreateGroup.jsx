// src/pages/CreateGroup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { generateInviteCode } from "../utils/birthday";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CreateGroup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!groupName.trim()) { setError("Please enter a group name."); return; }

    setCreating(true);
    try {
      const inviteCode = generateInviteCode();

      // Create group
      const groupRef = await addDoc(collection(db, "groups"), {
        name: groupName.trim(),
        inviteCode,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add creator as member
      await addDoc(collection(db, "groupMembers"), {
        groupId: groupRef.id,
        userId: user.uid,
        joinedAt: serverTimestamp(),
      });

      navigate(`/group/${groupRef.id}`);
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-float">🎊</div>
          <h1 className="font-display font-black text-3xl text-white mb-2">
            Create a Group
          </h1>
          <p className="text-white/40 text-sm">
            Give your group a name and start celebrating
          </p>
        </div>

        <form onSubmit={handleCreate} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Group Name <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. College Friends, Gaming Squad..."
              className="input-field"
              maxLength={50}
            />
          </div>

          <div
            className="rounded-xl p-4 text-sm"
            style={{
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <p className="text-violet-300 font-medium mb-1">✨ What happens next:</p>
            <ul className="text-white/50 space-y-1 text-xs">
              <li>• A unique invite code will be generated</li>
              <li>• You'll be added as the first member</li>
              <li>• Share the code with friends to join</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/dashboard" className="btn-secondary flex-1 text-center text-sm">
              Cancel
            </Link>
            <button type="submit" disabled={creating} className="btn-primary flex-1 text-sm disabled:opacity-50">
              {creating ? "Creating..." : "Create Group 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
