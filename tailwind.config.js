const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

const neut = {
  20: '#020508',
  19: '#09121a',
  18: '#141f29',
  17: '#1d2b3a',
  16: '#273849',
  15: '#324558',
  14: '#3e5265',
  13: '#4c5e70',
  12: '#5d6b79',
  11: '#697886',
  10: '#778592',
  9: '#86919c',
  8: '#939ea9',
  7: '#a1abb5',
  6: '#aeb8c1',
  5: '#b6c2cd',
  4: '#c6d1dc',
  3: '#d5dee7',
  2: '#e4ebf1',
  1: '#f5f7fa',
  0: '#fff',
}

const green = {
  13: '#11865f',
  12: '#13966a',
  11: '#15a675',
  4: '#9ddfc9',
  3: '#b3e7d6',
  1: '#dff7f0',
  0: '#f5fffd',
}

const red = {
  14: '#872727',
  11: '#bd3633',
  10: '#cf3b37',
  0: '#fff9fa',
}

module.exports = {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      red,
      green,
      neut,
      link: {
        DEFAULT: '#0366D6',
        dark: '#035CC1',
      },
    },
    extend: {
      fontSize: {
        xs: ['12px', '20px'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.label-required::before': {
          display: 'inline-block',
          marginRight: '4px',
          color: '#CF3B37',
          fontSize: '12px',
          lineHeight: 1,
          content: '"*"',
        },
      })
    }),
  ],
}
