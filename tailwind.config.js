/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['monospace'],
        header: ['monospace'],
      },
      colors: {
        background: 'var(--background)',
        text: 'var(--text)',
        subtitle: 'var(--subtitle)',
        card: 'var(--card)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
}