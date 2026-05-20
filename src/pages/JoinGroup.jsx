// src/pages/JoinGroup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function JoinGroup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) { setError("Please enter an invite code."); return; }

    setJoining(true);
    try {
      // Find group with this invite code
      const q = query(
        collection(db, "groups"),
        where("inviteCode", "==", trimmedCode)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Invalid invite code. Please check and try again.");
        setJoining(false);
        return;
      }

      const groupDoc = snap.docs[0];
      const groupId = groupDoc.id;

      // Check if already a member
      const memberQuery = query(
        collection(db, "groupMembers"),
        where("groupId", "==", groupId),
        where("userId", "==", user.uid)
      );
      const memberSnap = await getDocs(memberQuery);

      if (!memberSnap.empty) {
        // Already a member
        navigate(`/group/${groupId}`);
        return;
      }

      // Add as member
      await addDoc(collection(db, "groupMembers"), {
        groupId,
        userId: user.uid,
        joinedAt: serverTimestamp(),
      });

      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-float">🔗</div>
          <h1 className="font-display font-black text-3xl text-white mb-2">
            Join a Group
          </h1>
          <p className="text-white/40 text-sm">
            Enter the invite code your friend shared with you
          </p>
        </div>

        <form onSubmit={handleJoin} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Invite Code <span className="text-pink-400">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCD12"
              className="input-field text-center text-xl font-mono tracking-widest uppercase"
              maxLength={6}
            />
            <p className="text-xs text-white/30 mt-2 text-center">
              Invite codes are 6 characters long
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link to="/dashboard" className="btn-secondary flex-1 text-center text-sm">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={joining || !code.trim()}
              className="btn-primary flex-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {joining ? "Joining..." : "Join Group 🎉"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/30 text-sm">Don't have a code?</p>
          <Link to="/create-group" className="text-pink-400 text-sm hover:text-pink-300 transition-colors">
            Create your own group →
          </Link>
        </div>
      </div>
    </div>
  );
}
