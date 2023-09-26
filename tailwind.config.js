/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.js', './views/**/*.html'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--primary-color)',
        'secondary-color': 'var(--secondary-color)',
      },
    },
  },
  plugins: [],
};
