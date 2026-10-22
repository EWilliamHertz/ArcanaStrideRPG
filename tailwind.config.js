/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rpg: {
          gold: '#facc15',
          amber: '#f59e0b',
          crimson: '#e11d48',
          void: '#7c3aed',
          dark: '#0a0e1a',
        }
      }
    },
  },
  plugins: [],
};
