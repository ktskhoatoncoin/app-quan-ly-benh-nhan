/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        winform: {
          bg: '#D4E2F4',
          panel: '#EBF2FB',
          border: '#003C74',
          inputBorder: '#7F9DB9',
          header: '#00156E'
        }
      }
    },
  },
  plugins: [],
}
