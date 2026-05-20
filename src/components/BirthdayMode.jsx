// src/components/BirthdayMode.jsx
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { getRandomWebsiteWish } from "../utils/birthday";
import WishBoard from "./WishBoard";

export default function BirthdayMode({ birthdayPeople, groupId, onViewNormal }) {
  const [wish, setWish] = useState("");
  const [emojis, setEmojis] = useState([]);
  const confettiRef = useRef(null);

  const person = birthdayPeople[0];

  useEffect(() => {
    if (person) {
      setWish(getRandomWebsiteWish(person.name));
    }
  }, [person?.id]);

  // Confetti effect
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#FF6B9D", "#C44EEB", "#FFD700", "#FF4E50", "#FC466B", "#3F5EFB"],
      });
    };
    fire();
    const interval = setInterval(fire, 4000);
    return () => clearInterval(interval);
  }, []);

  // Floating emojis
  useEffect(() => {
    const emojiSet = ["🎉", "🎂", "🎈", "✨", "🌟", "🥳", "💫", "🎊", "🎁", "❤️"];
    const createEmoji = () => {
      const id = Date.now();
      const emoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
      const x = Math.random() * 100;
      const duration = 3 + Math.random() * 2;
      setEmojis((prev) => [...prev, { id, emoji, x, duration }]);
      setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== id));
      }, duration * 1000 + 100);
    };
    createEmoji();
    const interval = setInterval(createEmoji, 800);
    return () => clearInterval(interval);
  }, []);

  if (!person) return null;

  return (
    <div className="min-h-screen birthday-mode-bg relative overflow-hidden">
      {/* Floating emojis */}
      {emojis.map(({ id, emoji, x, duration }) => (
        <span
          key={id}
          className="floating-emoji"
          style={{ left: `${x}%`, animationDuration: `${duration}s` }}
        >
          {emoji}
        </span>
      ))}

      {/* Glowing orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Main birthday card */}
        <div
          className="rounded-3xl p-8 mb-8 animate-scale-in"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(236,72,153,0.15) 50%, rgba(139,92,246,0.1) 100%)",
            border: "1px solid rgba(251,191,36,0.3)",
            boxShadow: "0 0 60px rgba(251,191,36,0.1), 0 0 120px rgba(236,72,153,0.05)",
          }}
        >
          {/* Cake emoji */}
          <div className="text-8xl mb-6 animate-float">🎂</div>

          {/* Multiple birthday people */}
          {birthdayPeople.length > 1 ? (
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
              Today we celebrate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                {birthdayPeople.map((p) => p.name).join(" & ")}
              </span>
              ! 🎉
            </h1>
          ) : (
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mb-2">
              Happy Birthday{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 animate-pulse-slow">
                {person.name}
              </span>
              ! 🎉
            </h1>
          )}

          {/* Auto wish */}
          <p className="text-white/70 text-lg mt-4 leading-relaxed italic font-display">
            "{wish}"
          </p>

          {/* Age badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full"
            style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
          >
            <span className="text-yellow-400 font-mono text-sm font-bold">
              🌟 Celebrating another amazing year
            </span>
          </div>
        </div>

        {/* Multiple birthday cards */}
        {birthdayPeople.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {birthdayPeople.map((p) => (
              <div key={p.id} className="card p-4 text-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 mx-auto mb-3">
                  {p.photoURL ? (
                    <img src={p.photoURL} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-yellow-400 text-sm mt-1">🎂 Today!</p>
              </div>
            ))}
          </div>
        )}

        {/* View normal button */}
        <button
          onClick={onViewNormal}
          className="btn-secondary text-sm mb-8"
        >
          📋 View All Countdowns
        </button>

        {/* Wish board */}
        <div className="text-left">
          <WishBoard groupId={groupId} birthdayUser={person} />
        </div>
      </div>
    </div>
  );
}
