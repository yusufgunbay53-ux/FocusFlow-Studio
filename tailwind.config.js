/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00d2ff',
        night: '#0b111e',
        glass: 'rgba(16, 28, 48, 0.55)',
      },
      boxShadow: {
        neon: '0 0 24px rgba(0, 210, 255, 0.25)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
