// src/components/EmptyState.jsx
export default function EmptyState({ emoji, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-5 animate-float">{emoji}</div>
      <h3 className="font-display font-bold text-xl text-white mb-2">{title}</h3>
      <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-6">{subtitle}</p>
      {action && action}
    </div>
  );
}
