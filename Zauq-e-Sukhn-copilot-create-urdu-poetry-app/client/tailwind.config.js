/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a2e',
        gold: '#d4af37',
        maroon: '#800020',
        emerald: '#0d6e4e',
        ivory: '#fffff0',
      },
      fontFamily: {
        urdu: ['Noto Nastaliq Urdu', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease forwards',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
}
