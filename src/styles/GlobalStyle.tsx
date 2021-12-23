import { Global } from '@emotion/react'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'
import collapseStyles from './collapseStyles'
import tableStyles from './tableStyles'
import selectStyles from './selectStyles'
import buttonStyles from './buttonStyles'
import modalStyles from './modalStyles'
import sliderStyles from './sliderStyles'
import inputStyles from './inputStyles'
import menuStyles from './menuStyles'
import tippyStyles from './tippyStyles'
import pageTabStyles from './pageTabStyles'

const customStyles = css`
  html {
    ${tw`text-base overflow-hidden!`};
    font-family: 'Roboto', 'PingFang SC', 'Noto Sans CJK', 'WenQuanYi Micro Hei',
      'Microsoft YaHei', sans-serif;
  }

  body {
    ${tw`overflow-hidden min-h-screen h-screen`}
  }
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
    label.radio.disabled {
      ${tw`text-white`}
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

    .page-tab-container {
      ${tw`mb-5`}
      .collapse-panel {
        ${tw`bg-neut-16`}
        .tab-title {
          ${tw`text-white font-medium`}
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

    .radio-group {
      .radio:hover {
        ${tw`text-white`}
      }
      .button.radio-button {
        ${tw`bg-neut-16 border-neut-13`}
        &:hover {
          ${tw`bg-neut-15`}
        }
        &.checked {
          ${tw`border-green-13 bg-neut-15`}
        }
      }
    }
    .popper.dropdown {
      ${tw`border-neut-13 bg-transparent`}
      .dropdown-content {
        ${tw`bg-neut-17 `}
        .menu {
          ${tw`bg-neut-17 text-xs text-white`}
          .menu-inline-submenu-title {
            svg {
              color: rgba(255, 255, 255, 0.9);
              fill: rgba(255, 255, 255, 0.4);
            }
          }
          .menu-item,
          .menu-inline-submenu-title {
            ${tw`text-white`};
            &:hover {
              ${tw`bg-neut-13`};
            }
          }
        }
      }
    }
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global
      styles={[
        customStyles,
        collapseStyles,
        tableStyles,
        selectStyles,
        buttonStyles,
        modalStyles,
        sliderStyles,
        inputStyles,
        menuStyles,
        tippyStyles,
        pageTabStyles,
      ]}
    />
  </>
)
export default GlobalStyles
