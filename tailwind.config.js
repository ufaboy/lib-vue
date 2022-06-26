module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'hsla(174, 100%, 29%, 1)',
      },
    },
/*    screens: {
      sm: '360px',
      md: '412px',
      lg: '916px',
      xl: '1440px',
    },*/
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}