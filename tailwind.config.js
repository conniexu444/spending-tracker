/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // very important for theme switching
    theme: {
      extend: {
        fontFamily: {
          sans: ['Manrope', 'sans-serif'],
        }
      }
    },
    plugins: [],
  };
  