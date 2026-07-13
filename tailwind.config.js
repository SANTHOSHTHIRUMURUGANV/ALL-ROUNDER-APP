/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Dark Navy Background
          light: '#1E293B',
          dark: '#090D16',
        },
        secondary: {
          DEFAULT: '#1E293B', // Secondary card background
          light: '#334155',
          dark: '#0F172A',
        },
        accent: {
          DEFAULT: '#EC4899', // Pink Accent
          light: '#F472B6',
          dark: '#DB2777',
        },
        success: '#22C55E',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
}
