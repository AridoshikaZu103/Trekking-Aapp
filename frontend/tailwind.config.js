/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#071939',
        slateDark: '#0f172a',
        cardGlass: 'rgba(30, 41, 59, 0.75)',
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 4px 25px rgba(20, 184, 166, 0.35)',
        'glow-blue': '0 4px 25px rgba(59, 130, 246, 0.35)',
        'glass-3d': '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.15)',
      },
      backdropBlur: {
        'xl': '20px',
        '2xl': '30px',
      },
      animation: {
        'float-3d': 'float3D 6s ease-in-out infinite',
        'neon-pulse': 'neonBorderPulse 5s ease-in-out infinite',
        'beam-sweep': 'beamSweep 5s ease-in-out infinite',
        'ripple': 'ripplePulse 2s infinite',
      },
      keyframes: {
        float3D: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' },
          '50%': { transform: 'translateY(-8px) rotateX(2deg) rotateY(-2deg)' },
        },
        neonBorderPulse: {
          '0%, 100%': { borderColor: 'rgba(20, 184, 166, 0.4)', boxShadow: '0 0 15px rgba(20, 184, 166, 0.2)' },
          '33%': { borderColor: 'rgba(59, 130, 246, 0.5)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)' },
          '66%': { borderColor: 'rgba(245, 158, 11, 0.4)', boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)' },
        },
        beamSweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        ripplePulse: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
        }
      }
    },
  },
  plugins: [],
}
