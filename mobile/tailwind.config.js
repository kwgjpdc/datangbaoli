/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgColor: '#f2f3f5',
        description: '#969799'
      }
    }
  },
  plugins: []
};
