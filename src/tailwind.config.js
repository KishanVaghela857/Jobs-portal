export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",, // This covers all JS/TS/JSX/TSX files under src
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#E0F2FF',
          200: '#B3DAFF',
          300: '#80C1FF',
          400: '#4DADFF',
          500: '#1A99FF',
          600: '#007ACC',  // <-- your primary-600 color here
          700: '#005B99',
          800: '#003D66',
          900: '#001F33',
        },
      },
    },
  },
  plugins: [],
}