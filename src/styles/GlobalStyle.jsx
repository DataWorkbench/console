import React from 'react'
import { Global } from '@emotion/react'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css`
  .light {
    --bg-primary: #fff;
    --bg-secondary: #f1f5f9;
    --text-primary: #475569;
    --text-secondary: #1e293b;
    --color-primary: #e11d48;
  }
  .dark {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --text-primary: #cbd5e1;
    --text-secondary: #fff;
    --color-primary: #2563eb;
    label {
      ${tw`text-white`};
    }
    a:hover {
      ${tw`text-white`};
    }
    .input,
    .textarea {
      ${tw`bg-neut-16 text-white border-neut-13`}
    }
    .input-number.is-mini {
      & > .input-number-controls {
        height: 30px;
        & > button {
          ${tw`bg-neut-13 border-neut-13`}
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
    .field.date-picker-field .control {
      .datepicker-input.input {
        &[readonly='readonly'] {
          ${tw`bg-neut-16 text-white border-neut-13`}
          &:hover {
            ${tw`border-neut-5`}
          }
        }
      }
      .icon {
        &:hover {
          ${tw`bg-neut-16`}
        }
        svg.qicon {
          ${tw`text-white`}
        }
      }
    }
    .slider {
      .slider-rail {
        ${tw`bg-neut-13`}
      }
      .slider-dot {
        ${tw`border-neut-13`}
      }
    }
    .select {
      > .select-control {
        ${tw`bg-neut-16 border-neut-13`}
        &:hover,
        &:active {
          ${tw`bg-neut-16 border-neut-8`}
        }
        &:focus {
          ${tw`border-green-11`}
        }
        .select-value > .select-value-label {
          ${tw`text-white!`}
        }
        & > .select-arrow-zone {
          .qicon {
            ${tw`text-white`}
          }
        }
      }
      & > .select-menu-outer {
        ${tw`bg-neut-17 border-neut-13`}
        .select-option {
          ${tw`bg-neut-17 text-white`}
          &.is-selected,
          &:hover {
            ${tw`bg-neut-16`}
          }
        }
      }
    }
  }
  html {
    ${tw`text-base`}
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)
export default GlobalStyles
