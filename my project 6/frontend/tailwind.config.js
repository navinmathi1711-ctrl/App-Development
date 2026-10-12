/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        folio: {
          50: '#FBF9F5',
          100: '#F5F1E9',
          200: '#EBE2D4',
          300: '#DECDB6',
          400: '#CBB191',
          500: '#B4936E',
          600: '#9B7853',
          700: '#7E5F40',
          800: '#5F462E',
          900: '#3D2C1C',
        },
        paper: {
          cream: '#FEF9C3',
          sage: '#DCFCE7',
          peach: '#FFEDD5',
          rose: '#FFE4E6',
          lavender: '#EDE9FE',
          sky: '#E0F2FE',
          slate: '#F1F5F9',
          mint: '#CCFBF1',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04)',
        'paper-hover': '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.03)',
        'paper-lifted': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
