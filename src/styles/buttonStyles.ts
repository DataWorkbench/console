import tw, { css } from 'twin.macro'

const buttonStyles = css`
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
        ${tw`bg-transparent border-neut-15`}
        &:hover {
          ${tw`bg-neut-13`}
        }
        &:hover {
          ${tw`bg-neut-15`}
        }
      }
    }

    a {
      &.link {
        color: #2193d3;
        ${tw`underline`}
        &:hover {
          color: #0ea5e9;
        }
        &:active {
          color: #0369a1;
        }
      }
      &.text-action {
        color: #f7fcff;
        ${tw`hover:text-green-11 active:text-green-12 underline`}
      }
    }
  }
  a {
    &.link {
      color: #2563eb;
      ${tw`underline`}
      &:hover {
        color: #3b82f6;
      }
      &:active {
        color: #1d4ed8;
      }
    }
    &.text-action {
      ${tw`hover:text-green-12 text-green-11 active:text-green-13 underline`}
    }
    .if {
      ${tw`inline-block`}
    }
  }
`

export default buttonStyles
