/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4ECE0',
          300: '#ECE0CE',
          400: '#E0CCB3',
        },
        warm: {
          50: '#FCF9F6',
          100: '#F7F2EC',
          200: '#EFE5D8',
          300: '#DFCEBA',
          400: '#C7B198',
          500: '#AF9276',
          600: '#94765B',
          700: '#785E47',
          800: '#5B4636',
          900: '#3D2F24',
        },
        terracotta: {
          50: '#FDF6F4',
          100: '#FBECE8',
          200: '#F6D7CF',
          300: '#EEB9AA',
          400: '#E2907A',
          500: '#D56D52',
          600: '#C05338',
          700: '#9E3F28',
          800: '#7F3423',
          900: '#682E20',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E6EDE5',
          200: '#CFDDD0',
          300: '#AFC6B1',
          400: '#8BAA8F',
          500: '#6C8E70',
          600: '#537157',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 10px 30px -10px rgba(120, 94, 71, 0.15), 0 4px 6px -2px rgba(120, 94, 71, 0.05)',
        'warm-lg': '0 20px 40px -15px rgba(120, 94, 71, 0.2), 0 8px 16px -4px rgba(120, 94, 71, 0.08)',
      }
    },
  },
  plugins: [],
}
