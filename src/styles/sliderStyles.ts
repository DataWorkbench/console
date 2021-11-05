import tw, { css } from 'twin.macro'

const sliderStyles = css`
  .dark {
    .slider {
      .slider-rail {
        ${tw`bg-neut-13`}
      }
      .slider-dot {
        ${tw`border-neut-13`}
      }
    }
  }
`
export default sliderStyles
