import tw, { css } from 'twin.macro'

/**
 * primary 主要按钮
 * default 次要按钮
 * outlined 切换按钮
 * black 普通按钮、图标按钮
 */

const buttonStyles = css`
  button.button {
    &.is-outlined,
    &.is-icon {
      ${tw`text-button-thirdly-text bg-button-thirdly hover:bg-button-thirdly-hover active:bg-button-thirdly-active border-separator`}
    }
  }
  .dark button.button.is-outlined {
    ${tw`hover:bg-button-thirdly-hover active:bg-button-thirdly-active`}
  }
  .dark {
    button.button {
      ${tw`text-white`}
      &[disabled] {
        ${tw`bg-neut-13! border-neut-13!`}
      }
      &.is-text {
        &[disabled] {
          ${tw`bg-transparent! border-none!`}
        }
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
        ${tw`bg-transparent border-neut-13`}
        &:hover {
          ${tw`bg-neut-13`}
        }
        &:active {
          ${tw`bg-neut-15`}
        }
      }
    }
  }
`

export default buttonStyles
