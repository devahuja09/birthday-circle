// src/components/GroupCard.jsx
import { Link } from "react-router-dom";

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/group/${group.id}`}
      className="block card p-5 hover:border-pink-500/40 hover:bg-white/8 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
          🎊
        </div>
        <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
          {group.inviteCode}
        </span>
      </div>
      <h3 className="font-display font-bold text-lg text-white group-hover:text-pink-300 transition-colors">
        {group.name}
      </h3>
      <p className="text-sm text-white/40 mt-1">
        {group.memberCount || 0} member{group.memberCount !== 1 ? "s" : ""}
      </p>
      <div className="mt-3 flex items-center gap-1 text-pink-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>View group</span>
        <span>→</span>
      </div>
    </Link>
  );
}
