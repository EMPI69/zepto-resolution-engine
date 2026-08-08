/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#030712',
          900: '#0B0F17',
          850: '#111827',
          800: '#1F2937',
        }
      }
    },
  },
  plugins: [],
}
