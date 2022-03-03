import tw, { css } from 'twin.macro'

const inputStyles = css`
  .input-search {
    ${tw`text-base`}
  }
  .dark {
    .input,
    .input-search {
      &:focus {
        ${tw`caret-white!`}
      }
    }
    .input,
    .textarea {
      ${tw`bg-neut-16 text-white border-neut-13`}
      &::placeholder {
        color: #939ea9;
      }
      &[disabled] {
        ${tw`bg-neut-13`}
      }
    }
    .input-number.is-mini {
      & > .input-number-controls {
        height: 30px;
        & > button {
          ${tw`bg-neut-13! border-neut-13!`}
          &:hover,
          &:focus {
            ${tw`bg-neut-13`}
          }
          svg.qicon {
            ${tw`text-white`}
          }
        }
      }
    }
    .input-search {
      input.is-default[value=''],
      input.is-circle[value=''] {
        ${tw`bg-neut-16 text-white border-neut-13!`}
        &:hover {
          ${tw`border-neut-11!`}
        }
      }
      i.icon {
        &.is-left,
        &.is-right {
          ${tw`text-white!`}
        }
      }
    }
    .label-required {
      ${tw`label-required`}
    }
  }
`
export default inputStyles
