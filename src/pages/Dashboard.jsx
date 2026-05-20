// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import { isBirthdayToday, calculateDaysUntilBirthday } from "../utils/birthday";

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Get group memberships
        const memberQuery = query(
          collection(db, "groupMembers"),
          where("userId", "==", user.uid)
        );
        const memberSnap = await getDocs(memberQuery);
        const groupIds = memberSnap.docs.map((d) => d.data().groupId);

        if (groupIds.length === 0) {
          setGroups([]);
          setLoading(false);
          return;
        }

        // Fetch each group
        const groupPromises = groupIds.map(async (gid) => {
          const groupDoc = await getDoc(doc(db, "groups", gid));
          if (!groupDoc.exists()) return null;

          // Count members
          const countQuery = query(
            collection(db, "groupMembers"),
            where("groupId", "==", gid)
          );
          const countSnap = await getDocs(countQuery);

          return {
            id: groupDoc.id,
            ...groupDoc.data(),
            memberCount: countSnap.size,
          };
        });

        const resolved = (await Promise.all(groupPromises)).filter(Boolean);
        setGroups(resolved);
      } catch (err) {
        console.error("Error fetching groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user.uid]);

  const isBirthday = isBirthdayToday(userProfile?.birthday || "");
  const daysUntil = userProfile?.birthday
    ? calculateDaysUntilBirthday(userProfile.birthday)
    : null;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Background orbs */}
      <div className="fixed top-32 right-0 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* Welcome header */}
        <div className="mb-10 animate-slide-up">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/40 text-sm mb-1">Good to see you,</p>
              <h1 className="font-display font-black text-4xl text-white">
                {isBirthday ? "🎉 " : ""}{userProfile?.name || "Friend"}
                {isBirthday && (
                  <span className="block text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mt-1">
                    Happy Birthday!!! 🎂
                  </span>
                )}
              </h1>
            </div>

            {/* Birthday countdown for self */}
            {daysUntil !== null && !isBirthday && (
              <div
                className="rounded-2xl px-5 py-4 text-right"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-white/40 text-xs mb-1">Your birthday</p>
                <p className="font-display font-black text-3xl text-pink-400">
                  {daysUntil === 0 ? "🎉" : daysUntil}
                </p>
                {daysUntil > 0 && (
                  <p className="text-white/30 text-xs">
                    {daysUntil === 1 ? "day away" : "days away"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link to="/create-group" className="btn-primary text-sm">
            ➕ Create Group
          </Link>
          <Link to="/join-group" className="btn-secondary text-sm">
            🔗 Join Group
          </Link>
        </div>

        {/* Groups */}
        <div>
          <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">
            Your Groups
            {groups.length > 0 && (
              <span className="text-sm font-body font-normal text-white/30">
                ({groups.length})
              </span>
            )}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin" />
            </div>
          ) : groups.length === 0 ? (
            <EmptyState
              emoji="🌙"
              title="No groups yet"
              subtitle="You are not in any group yet. Create or join a group to start tracking birthdays."
              action={
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/create-group" className="btn-primary text-sm">
                    Create a Group
                  </Link>
                  <Link to="/join-group" className="btn-secondary text-sm">
                    Join with Code
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
