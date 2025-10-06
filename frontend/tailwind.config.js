/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#2B2D42',   
        medium: '#8D99AE', 
        light: '#EDF2F4', 
      },
    },
  },
  plugins: [],
}
