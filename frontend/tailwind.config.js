/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#173B67',
          blue: '#3678D4',
          blueHover: '#2A62B6',
          softBlue: '#E9EFF8',
          bg: '#F3F6FA',
          card: '#FFFFFF',
          text: '#172438',
          muted: '#64748B',
          border: '#DCE4EE',
          // Dark mode palette tokens
          darkBg: '#0B132B',
          darkNav: '#080D1D',
          darkCard: '#162032',
          darkCardHover: '#1A263D',
          darkBorder: '#26354D',
          darkText: '#F8FAFC',
          darkMuted: '#94A3B8',
          darkInput: '#0F172A',
        },
        priority: {
          high: '#DC2626',
          highBg: '#FEF2F2',
          highBorder: '#FCA5A5',
          medium: '#D97706',
          mediumBg: '#FFFBEB',
          mediumBorder: '#FCD34D',
          low: '#059669',
          lowBg: '#ECFDF5',
          lowBorder: '#6EE7B7',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(23, 59, 103, 0.05)',
        'card-hover': '0 4px 6px -1px rgba(23, 59, 103, 0.08), 0 2px 4px -1px rgba(23, 59, 103, 0.04)',
        'card-dark': '0 1px 3px 0 rgba(0, 0, 0, 0.25)',
        'card-dark-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'btn': '0 1px 2px 0 rgba(54, 120, 212, 0.2)',
      },
    },
  },
  plugins: [],
};
