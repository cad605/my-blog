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
      keyframes: {
        appear: {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
        slide: {
          '0%': {opacity: '0', transform: 'translateX(-6rem)'},
          '100%': {opacity: '1'},
        },
      },
      animation: {
        appear: 'appear 1s ease-in',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
