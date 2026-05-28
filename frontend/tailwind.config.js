/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#00d4ff',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        background: '#f8fafc',
        card: '#ffffff',
      },
    },
  },
  plugins: [],
}
