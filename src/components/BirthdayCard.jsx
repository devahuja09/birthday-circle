// src/components/BirthdayCard.jsx
import { calculateDaysUntilBirthday, formatBirthdayDate, getBirthdayStatus, isBirthdayToday } from "../utils/birthday";

export default function BirthdayCard({ member, isCurrentUser }) {
  const daysLeft = calculateDaysUntilBirthday(member.birthday);
  const status = getBirthdayStatus(member.birthday);
  const isToday = isBirthdayToday(member.birthday);

  if (isToday) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-5 animate-glow"
        style={{
          background: "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(236,72,153,0.2))",
          border: "1px solid rgba(251,191,36,0.4)",
        }}
      >
        {/* Glowing background pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-pink-500/5 animate-pulse-slow" />

        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg shadow-yellow-500/30">
              {member.photoURL ? (
                <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {member.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 text-lg animate-bounce-slow">🎂</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display font-bold text-lg text-white truncate">{member.name}</span>
              {isCurrentUser && (
                <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">You</span>
              )}
            </div>
            <p className="text-sm text-white/50 mt-0.5">{formatBirthdayDate(member.birthday)}</p>
          </div>

          {/* Status */}
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-display font-black text-yellow-400 animate-wiggle">🎉</div>
            <div className="text-xs font-semibold text-yellow-400 mt-1">Today!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 hover:border-white/20 hover:bg-white/8 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 group-hover:border-white/40 transition-all">
            {member.photoURL ? (
              <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-white font-bold">
                {member.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white truncate">{member.name}</span>
            {isCurrentUser && (
              <span className="text-xs bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full">You</span>
            )}
          </div>
          <p className="text-sm text-white/40 mt-0.5">{formatBirthdayDate(member.birthday)}</p>
        </div>

        {/* Days */}
        <div className="flex-shrink-0 text-right">
          {daysLeft <= 7 && daysLeft > 0 ? (
            <div className="flex flex-col items-end">
              <span className="text-2xl font-display font-black text-pink-400">{daysLeft}</span>
              <span className="text-xs text-pink-400/70 -mt-1">days</span>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar (days until birthday out of 365) */}
      <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-700"
          style={{ width: `${Math.max(2, ((365 - daysLeft) / 365) * 100)}%` }}
        />
      </div>
    </div>
  );
}
