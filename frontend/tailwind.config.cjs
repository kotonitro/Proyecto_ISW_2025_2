/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- Esta línea es la que soluciona el problema
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
