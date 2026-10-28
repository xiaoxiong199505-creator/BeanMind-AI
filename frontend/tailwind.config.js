/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa99a',
          600: '#a68274',
          700: '#8c6354',
          800: '#735143',
          900: '#5e4236',
          950: '#3d2b24',
        }
      }
    },
  },
  plugins: [],
}
