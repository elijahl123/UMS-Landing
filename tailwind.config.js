/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './index.html',
    './privacy-policy/**/*.html',
    './terms/**/*.html'
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        ums: {
          coral: '#f8ad9d',
          coralShade: '#f4978e',
          accent: '#f08080',
          surface: '#ffffff',
          background: '#f7f7f7',
          text: '#56494c',
          textPrimary: '#2f2f2f',
          textSecondary: '#5a5a5a',
          border: '#e8e8e8',
          soft: '#f0ecec'
        },
        course: {
          green: '#cfe8da',
          blue: '#c9d8f3',
          yellow: '#f8e7af',
          gray: '#d8d8dd',
          teal: '#bfe6e1',
          purple: '#ded2f4',
          pink: '#f5cddd',
          red: '#f7c7c7'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      borderRadius: {
        ums: '10px'
      },
      boxShadow: {
        ums: '0 20px 48px rgb(86 73 76 / 0.06)',
        'ums-soft': '0 10px 28px rgb(86 73 76 / 0.04)'
      }
    }
  },
  plugins: []
};
