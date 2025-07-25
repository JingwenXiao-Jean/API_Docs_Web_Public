/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        xxs: '280px',
        xs: '370px'
      },
      colors: {
        themeGreen: '#39e4b6',
        themeEmerald: '#3CA021',
        themeYellow: '#faa000',
        themeBlack: '#374151',
        themePurple: '#7B59FF',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))', // 👈 add this!
      },  
      scale: {
        '25': '0.25',
      },
      translate: {
        'neg-1/2': '-50%',
      },
      height: {
        '30vh': '30vh',
        '40vh': '40vh',
        '45vh': '45vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '65vh': '65vh',
        '70vh': '70vh',
        '75vh': '75vh',
        '80vh': '80vh',
        '85vh': '85vh',
        '90vh': '90vh',

      },
      minHeight: {
        '90vh': '90vh',
      },
      maxWidth: {
        "propertySm": "400px",
        "propertyLg": "600px",
      },
      fontSize: {
        xsm: "0.8rem",
      },
      keyframes: {
        blink: {
          '0%, 20%, 40%': { opacity: 1 },
          '60%, 100%': { opacity: 0 },
        },
      },
      animation: {
        blink: 'blink 1.4s infinite both',
      },
    },
  },
  plugins: [],
}

