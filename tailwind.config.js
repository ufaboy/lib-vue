module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'hsla(174, 100%, 29%, 1)',
      },

    },
    screens: {
      sm: '360px',
      md: '412px',
      lg: '945px',
      xl: '1440px',
    },
  },
  plugins: [],
}