// src/pages/GroupPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Navbar from "../components/Navbar";
import BirthdayCard from "../components/BirthdayCard";
import BirthdayMode from "../components/BirthdayMode";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { isBirthdayToday, sortMembersByUpcomingBirthday } from "../utils/birthday";

export default function GroupPage() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showNormal, setShowNormal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Get group
        const groupDoc = await getDoc(doc(db, "groups", groupId));
        if (!groupDoc.exists()) {
          setError("Group not found.");
          setLoading(false);
          return;
        }

        // Check membership
        const memberQuery = query(
          collection(db, "groupMembers"),
          where("groupId", "==", groupId),
          where("userId", "==", user.uid)
        );
        const memberCheck = await getDocs(memberQuery);
        if (memberCheck.empty) {
          setError("You are not a member of this group.");
          setLoading(false);
          return;
        }

        setGroup({ id: groupDoc.id, ...groupDoc.data() });

        // Get all members
        const allMembersQuery = query(
          collection(db, "groupMembers"),
          where("groupId", "==", groupId)
        );
        const allMembersSnap = await getDocs(allMembersQuery);
        const memberIds = allMembersSnap.docs.map((d) => d.data().userId);

        // Fetch user profiles
        const userProfiles = await Promise.all(
          memberIds.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (!userDoc.exists()) return null;
            return { id: uid, ...userDoc.data() };
          })
        );

        const validMembers = userProfiles.filter(
          (m) => m !== null && m.birthday
        );
        const sorted = sortMembersByUpcomingBirthday(validMembers);
        setMembers(sorted);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Something went wrong loading this group.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId, user.uid]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group?.inviteCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <LoadingSpinner message="Loading group..." />;

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <EmptyState
          emoji="😕"
          title="Oops!"
          subtitle={error}
          action={
            <Link to="/dashboard" className="btn-primary text-sm">
              Back to Dashboard
            </Link>
          }
        />
      </div>
    );
  }

  // Find birthday people (all members with birthday today)
  const birthdayPeople = members.filter((m) => isBirthdayToday(m.birthday));
  const isBirthdayMode = birthdayPeople.length > 0;

  // Show birthday mode unless user toggled to normal view
  if (isBirthdayMode && !showNormal) {
    return (
      <>
        <Navbar />
        <BirthdayMode
          birthdayPeople={birthdayPeople}
          groupId={groupId}
          onViewNormal={() => setShowNormal(true)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed top-32 right-0 w-80 h-80 bg-pink-600/6 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-600/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">

        {/* Birthday mode banner (if showing normal view but birthday exists) */}
        {isBirthdayMode && showNormal && (
          <button
            onClick={() => setShowNormal(false)}
            className="w-full mb-6 py-4 px-5 rounded-2xl text-left transition-all hover:scale-[1.01] animate-glow"
            style={{
              background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(236,72,153,0.2))",
              border: "1px solid rgba(251,191,36,0.4)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-400 text-lg">
                  🎉 Birthday Mode Active!
                </p>
                <p className="text-white/60 text-sm mt-0.5">
                  {birthdayPeople.map((p) => p.name).join(" & ")} {birthdayPeople.length === 1 ? "is" : "are"} celebrating today!
                </p>
              </div>
              <span className="text-3xl animate-bounce-slow">🎂</span>
            </div>
          </button>
        )}

        {/* Group header */}
        <div className="flex items-start justify-between mb-8 animate-slide-up flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/dashboard" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                ← Dashboard
              </Link>
            </div>
            <h1 className="font-display font-black text-3xl text-white">
              {group?.name}
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Invite code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs text-white/40">Invite Code</span>
            <span className="font-mono font-bold text-white tracking-widest">{group?.inviteCode}</span>
            <span className="text-sm">{copied ? "✅" : "📋"}</span>
          </button>
        </div>

        {/* Upcoming birthdays */}
        <div>
          <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            🎂 Birthday Countdown
          </h2>

          {members.length === 0 ? (
            <EmptyState
              emoji="🌙"
              title="No birthdays yet"
              subtitle="Invite your friends to join this group. They'll need to set up their profile with their birthday."
              action={
                <button onClick={handleCopyCode} className="btn-primary text-sm">
                  {copied ? "Copied!" : "Copy Invite Code 📋"}
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="animate-slide-up">
                  <BirthdayCard
                    member={member}
                    isCurrentUser={member.id === user.uid}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How to invite */}
        {members.length > 0 && members.length < 3 && (
          <div
            className="mt-8 rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.12)",
            }}
          >
            <p className="text-white/40 text-sm text-center">
              💡 Share the invite code <span className="font-mono text-white/60">{group?.inviteCode}</span> with friends to add them to this group.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
