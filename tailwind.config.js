const plugin = require('tailwindcss/plugin')

const neutral = {
  'N-20': '#020508',
  'N-19': '#09121a',
  'N-18': '#141f29',
  'N-17': '#1d2b3a',
  'N-16': '#273849',
  'N-15': '#324558',
  'N-14': '#3e5265',
  'N-13': '#4c5e70',
  'N-12': '#5d6b79',
  'N-11': '#697886',
  'N-10': '#778592',
  'N-9': '#86919c',
  'N-8': '#939ea9',
  'N-7': '#a1abb5',
  'N-6': '#aeb8c1',
  'N-5': '#b6c2cd',
  'N-4': '#c6d1dc',
  'N-3': '#d5dee7',
  'N-2': '#e4ebf1',
  'N-1': '#f5f7fa',
  'N-0': '#fff',
}

const brand = {
  G13: '#11865f',
  G12: '#13966a',
  G11: '#15a675',
  G4: '#9ddfc9',
  G3: '#b3e7d6',
  G1: '#dff7f0',
  G0: '#f5fffd',
}

module.exports = {
  purge: ['./src/**/*.js', './src/**/*.jsx'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        text: {
          primary: '#191919',
          secondary: '#273849',
          tertiary: '#94A3B8',
        },
        brand,
        neutral,
        link: '#0366D6',
      },
    },
  },
  variants: {
    extend: {
      translate: ['group-hover'],
      gradientColorStops: ['group-hover'],
      fontWeight: ['hover'],
      padding: ['first'],
      borderWidth: ['last'],
    },
  },
  plugins: [
    plugin(({ addUtilities, theme, variants }) => {
      const colors = theme('colors.brand')
      const colorMap = Object.keys(colors).map((color) => ({
        [`.border-t-brand-${color}`]: { borderTopColor: colors[color] },
        [`.border-r-brand-${color}`]: { borderRightColor: colors[color] },
        [`.border-b-brand-${color}`]: { borderBottomColor: colors[color] },
        [`.border-l-brand-${color}`]: { borderLeftColor: colors[color] },
      }))
      const utilities = Object.assign({}, ...colorMap)
      addUtilities(utilities, variants('borderColor'))
    }),
  ],
}
