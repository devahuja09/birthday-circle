/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251,191,36,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(251,191,36,0.8), 0 0 60px rgba(251,191,36,0.4)' },
        },
      },
      backgroundImage: {
        'birthday-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f953c6 100%)',
        'cake-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'star-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'warm-gradient': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'cool-gradient': 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'night-gradient': 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      },
    },
  },
  plugins: [],
}
