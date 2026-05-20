// src/components/LoadingSpinner.jsx
export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a12]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl animate-bounce-slow">
          🎂
        </div>
      </div>
      <p className="mt-6 text-white/50 font-body text-sm tracking-wide">{message}</p>
    </div>
  );
}
