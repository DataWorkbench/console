import tw, { css } from 'twin.macro'

const inputStyles = css`
  .input-search {
    ${tw`text-base`}
  }
  .textarea[disabled] {
    opacity: 0.5;
  }
  .dark {
    .input,
    .input-search {
      &:focus {
        ${tw`caret-[#939ea9]!`}
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
      &.is-danger {
        ${tw`border-red-10!`}
      }
    }
    input:-internal-autofill-previewed,
    input:-internal-autofill-selected {
      -webkit-text-fill-color: #ffffff !important;
      transition: background-color 5000s ease-in-out 0s !important;
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

    .input-password > input.input[type='text'],
    .input-password input.input[type='password'],
    .input-search > input.input[type='text'],
    .input-search input.input[type='password'] {
      ${tw`border-none`}
    }
    .label-required {
      ${tw`label-required`}
    }

    label.checkbox {
      &:hover {
        &::before {
          ${tw`bg-transparent border-green-11!`}
        }
      }
      & .label-value {
        ${tw`text-white`}
      }
      &.checkbox-wrapper.indeterminate::after {
        left: 5px;
      }

      &.checkbox-wrapper.indeterminate::before {
        ${tw`bg-green-11`}
        border-color: transparent;
      }

      &::before {
        ${tw`border-neut-13 bg-transparent`}
      }

      &.checked::before {
        ${tw`bg-green-11!`}
        border-color: transparent;
        box-shadow: 0px 1px 2px rgba(0, 41, 27, 0.1);
        border-radius: 2px;
      }

      &.checked::after {
        top: 4px;
        left: 6px;
        width: 2.5px;
        height: 4.5px;
        border-width: 0 1px 1px 0;
        transform: rotate(45deg) scale(1.6);
      }
    }
  }
`
export default inputStyles
