/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-top': 'slide-top 1s ease-in-out infinite',
      },
      keyframes: {
        'slide-top': {
          '0%, ': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100px)' },
        }
      },
      backgroundImage: {
        'retina-wood': "url('/images/retina_wood.png')",
      }
    },
  },
  plugins: [],
}

