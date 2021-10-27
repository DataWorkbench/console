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
    .field .control input[type='text'][disabled],
    .field .control input[type='password'][disabled],
    .field .control input[type='number'][disabled] {
      ${tw`opacity-100 bg-neut-13`}
    }
    .field .control {
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
        &:focus {
          ${tw`border-green-13!`}
        }
      }
      i.icon.is-left {
        ${tw`text-white!`}
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
        & > .select-multi-value-wrapper {
          .select-value > span.tag {
            ${tw`bg-neut-13! text-white!`}
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
    .page-tab-container {
      ${tw`mb-5`}
      .collapse-panel {
        ${tw`bg-neut-16`}
        .tab-title {
          ${tw`text-white`}
        }
        button.is-text,
        .tab-description {
          ${tw`text-neut-8`}
        }
        svg {
          color: hsla(0, 0%, 100%, 0.9);
          fill: hsla(0, 0%, 100%, 0.4);
        }
      }
    }
    .icon.icon-clickable:hover {
      ${tw`bg-neut-13`}
    }
    .modal.is-active {
      .modal-card-head,
      .modal-card-foot,
      .modal-card-body {
        ${tw`bg-neut-16 border-neut-13 text-white`}
      }
      .modal-card-title {
        ${tw`text-white`}
      }
      .icon.icon-clickable:hover {
        ${tw`bg-neut-16`}
      }
      .modal-card-head {
        svg {
          color: #fff;
        }
      }
      .modal-card-foot {
        button.button {
          &.is-default {
            ${tw`border-neut-13 bg-neut-13 text-white`}
            &:hover {
              ${tw`bg-neut-15 text-white border-neut-13`}
            }
            &:active {
              ${tw`bg-neut-17 text-white border-neut-13`}
            }
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
