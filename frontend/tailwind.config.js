/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          600: "#1e293b",
          700: "#172033",
          800: "#0f1629",
        },
        brand: {
          500: "#0ea5e9",
          600: "#0284c7",
        },
        accent: {
          red: "#f43f5e",
          green: "#22d3a0",
        },
      },
    },
  },
  plugins: [],
}