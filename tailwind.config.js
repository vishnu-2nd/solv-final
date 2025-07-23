/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'times': ['Times New Roman', 'serif'],
        'arial': ['Arial', 'sans-serif'],
        'georgia': ['Georgia', 'serif'],
        'helvetica': ['Helvetica', 'sans-serif'],
        'courier': ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
