/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js}'],
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
