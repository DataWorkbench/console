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
    .input {
      ${tw`bg-neut-16 text-white border-neut-13`}
      &:not([readonly]):not([disabled]):hover {
        ${tw`border-neut-8`}
      }
    }
  }
  html {
    ${tw`text-base`}
  }
`
/*   
.select-control {
  ${tw`bg-neut-16 border-neut-13`}
  &:hover {
    ${tw`bg-neut-13`}
  }
}
*/

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)
export default GlobalStyles
