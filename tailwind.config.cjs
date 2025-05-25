/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d32f2f', // Red color
          light: '#ef5350',
          dark: '#c62828',
        },
        secondary: {
          DEFAULT: '#ffc107', // Yellow/amber color
          light: '#ffca28',
          dark: '#ffa000',
        }
      }
    },
  },
  plugins: [],
}