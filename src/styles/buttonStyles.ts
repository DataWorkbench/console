import tw, { css } from 'twin.macro'

const buttonStyles = css`
  .dark {
    button.button {
      ${tw`text-white`}
      &[disabled] {
        ${tw`bg-neut-13! border-neut-13!`}
      }
      &.is-text {
        .icon + span {
          ${tw`text-white`}
        }

        &:hover {
          .icon + span {
            ${tw`text-green-11`}
          }
        }
      }
      &.is-default {
        ${tw`border-neut-13 bg-neut-13 text-white`}
        &:hover {
          ${tw`bg-neut-15 text-white border-neut-13`}
        }
        &:active {
          ${tw`bg-neut-17 text-white border-neut-13`}
        }
      }
      &.is-outlined {
        ${tw`bg-transparent`}
      }
      &.is-black {
        ${tw`bg-transparent border-neut-15`}
        &:hover {
          ${tw`bg-neut-13`}
        }
        &:hover {
          ${tw`bg-neut-15`}
        }
      }
    }
  }
`

export default buttonStyles
