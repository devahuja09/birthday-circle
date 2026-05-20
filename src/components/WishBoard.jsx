// src/components/WishBoard.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function WishBoard({ groupId, birthdayUser }) {
  const { user, userProfile } = useAuth();
  const [wishes, setWishes] = useState([]);
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!groupId || !birthdayUser?.id) return;

    const q = query(
      collection(db, "birthdayWishes"),
      where("groupId", "==", groupId),
      where("birthdayUserId", "==", birthdayUser.id),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWishes(data);
    });

    return unsub;
  }, [groupId, birthdayUser?.id]);

  const postWish = async () => {
    if (!message.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, "birthdayWishes"), {
        groupId,
        birthdayUserId: birthdayUser.id,
        senderUserId: user.uid,
        senderName: userProfile?.name || user.displayName,
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Error posting wish:", err);
    } finally {
      setPosting(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return "just now";
    const date = ts.toDate?.() || new Date(ts);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl animate-bounce-slow">💌</span>
        <h3 className="font-display font-bold text-2xl text-white">
          Birthday Wish Board
        </h3>
      </div>

      {/* Input */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <p className="text-sm text-white/50 mb-3">
          Write a birthday wish for <span className="text-pink-400 font-semibold">{birthdayUser.name}</span> ✨
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Happy birthday! May your day be amazing..."
          rows={3}
          className="input-field resize-none text-sm"
          maxLength={300}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-white/30">{message.length}/300</span>
          <button
            onClick={postWish}
            disabled={!message.trim() || posting}
            className="btn-primary text-sm py-2 px-5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {posting ? "Sending..." : "Send Wish 🎉"}
          </button>
        </div>
      </div>

      {/* Wishes list */}
      <div className="space-y-3">
        {wishes.length === 0 ? (
          <div className="text-center py-10 text-white/30">
            <p className="text-4xl mb-3">🪄</p>
            <p className="text-sm">No wishes yet. Be the first to wish {birthdayUser.name}!</p>
          </div>
        ) : (
          wishes.map((wish) => (
            <div
              key={wish.id}
              className="rounded-xl p-4 animate-slide-up"
              style={{
                background:
                  wish.senderUserId === user.uid
                    ? "rgba(236,72,153,0.1)"
                    : "rgba(255,255,255,0.04)",
                border:
                  wish.senderUserId === user.uid
                    ? "1px solid rgba(236,72,153,0.25)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {wish.senderName?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {wish.senderUserId === user.uid ? "You" : wish.senderName}
                  </span>
                </div>
                <span className="text-xs text-white/30">{formatTime(wish.createdAt)}</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed pl-9">{wish.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
