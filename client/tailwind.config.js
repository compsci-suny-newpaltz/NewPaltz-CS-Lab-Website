/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SUNY New Paltz Primary Colors
        'np-blue': {
          DEFAULT: '#003e7e',
          50: '#e6f0fa',
          100: '#cce1f5',
          200: '#99c3eb',
          300: '#66a5e1',
          400: '#3387d7',
          500: '#003e7e',
          600: '#003265',
          700: '#00264c',
          800: '#001a33',
          900: '#000d1a',
        },
        'np-orange': {
          DEFAULT: '#f58426',
          50: '#fef3e7',
          100: '#fde7cf',
          200: '#fbcf9f',
          300: '#f9b76f',
          400: '#f79f3f',
          500: '#f58426',
          600: '#c46a1e',
          700: '#934f17',
          800: '#62350f',
          900: '#311a08',
        },
        // Secondary Colors
        'np-gold': '#fdb924',
        'np-cyan': '#00a5d9',
        'np-coral': '#f26649',
        'np-lime': '#b0bc22',
        'np-steel': '#80a1b6',
        'np-rust': '#a84d10',
        // Neutrals
        'np-cream': '#f6f1cd',
        'np-gray-light': '#c2d1d4',
        'np-sage': '#a9c398',
        'np-warm-gray': '#bbb0a6',
        'np-cool-gray': '#d8d9da',
        'np-beige': '#e7e1d5',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 2s ease-in-out infinite',
        'wiggle-slow': 'wiggle 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
