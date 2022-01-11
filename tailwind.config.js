const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['"Canela Text"', ...defaultTheme.fontFamily.sans],
      //   serif: ['"Canela Deck"', ...defaultTheme.fontFamily.serif],
      // },
      colors: {
        bland: '#F7F6F6',
      },
      fontSize: {
        '4.5xl': '2.5rem',
      },
      skew: {
        '-20': '-20deg',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
    },
  },
  plugins: [],
}
