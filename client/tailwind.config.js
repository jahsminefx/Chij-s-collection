/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#18181B',
          'primary-hover': '#27272A',
          accent: '#B89B72',
          'accent-light': '#F5EFE6',
          background: '#FAF9F6',
          surface: '#FFFFFF',
          muted: '#F4F2EC',
          border: '#E6E4DC',
          text: '#18181B',
          'text-secondary': '#52525B',
          'text-muted': '#71717A',
          whatsapp: '#25D366',
          'whatsapp-hover': '#1EBE5D',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      aspectRatio: {
        'fashion': '4 / 5',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'lift': '0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};
