// const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

const neutral = {
  N20: '#020508', // 背景色 页面黑背景
  N19: '#09121a', // 文字色 一级标题   背景色
  N18: '#141f29',
  N17: '#1d2b3a',
  N16: '#273849', // 文字色 二级标题 三级标题/常规  背景色
  N15: '#324558', // 组件色 黑色
  // N14: '#3e5265',
  N13: '#4c5e70', // 文字色 次级辅助字色 组件色 深灰色
  // N12: '#5d6b79',
  // N11: '#697886',
  N10: '#778592',
  // N9: '#86919c',
  N8: '#939ea9', // 文字色 三级辅助字色 组件色 灰色
  // N7: '#a1abb5',
  // N6: '#aeb8c1',
  N5: '#b6c2cd',
  // N4: '#c6d1dc',
  N3: '#d5dee7', // 线条色 常规线
  N2: '#e4ebf1', // 线条色 浅线
  N1: '#f5f7fa',
  // N0: '#fff', // 文字色 反白常规字色
}

const brand = {
  G13: '#11865f', // 成功 - 按下
  G12: '#13966a', // 成功 - 悬浮
  G11: '#15a675', // 成功 - 常规  成功 - 描边色 组件色
  G4: '#9ddfc9',
  G3: '#b3e7d6',
  G1: '#dff7f0',
  G0: '#f5fffd', // 成功 - 淡色背景
}

module.exports = {
  // mode: 'jit',
  purge: ['./src/**/*.{js,jsx,css}'],
  darkMode: false,
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      blue: colors.blue,
      brand,
      neutral,
      // text: {
      //   primary: '#191919',
      //   secondary: '#273849',
      //   tertiary: '#94A3B8',
      // },
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
    extend: {
      translate: ['group-hover'],
      gradientColorStops: ['group-hover'],
      fontWeight: ['hover'],
      padding: ['first'],
      borderWidth: ['last'],
    },
  },
  plugins: [
    // plugin(({ addUtilities, theme, variants }) => {
    //   const colors = theme('colors.brand')
    //   const colorMap = Object.keys(colors).map((color) => ({
    //     [`.border-t-brand-${color}`]: { borderTopColor: colors[color] },
    //     [`.border-r-brand-${color}`]: { borderRightColor: colors[color] },
    //     [`.border-b-brand-${color}`]: { borderBottomColor: colors[color] },
    //     [`.border-l-brand-${color}`]: { borderLeftColor: colors[color] },
    //   }))
    //   const utilities = Object.assign({}, ...colorMap)
    //   addUtilities(utilities, variants('borderColor'))
    // }),
  ],
}
