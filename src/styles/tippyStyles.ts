import tw, { css } from 'twin.macro'

const tippyStyles = css`
  .tippy-box[data-theme~='light'] {
    font-size: 12px;
    line-height: 1.25;
    color: #26323d;
    box-shadow: 0px 1px 6px rgba(50, 69, 88, 0.2);
    background-color: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 2px;
    > .tippy-content {
      padding: 0;
    }
    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: #cbd5e1;
    }
    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: #cbd5e1;
    }
    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: #cbd5e1;
    }
    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: #cbd5e1;
    }
    > .tippy-backdrop {
      background-color: #cbd5e1;
    }
    .tippy-svg-arrow {
      fill: #cbd5e1;
    }
  }

  .tippy-box[data-theme~='dark'] {
    font-size: 12px;
    line-height: 1.25;
    ${tw`bg-neut-13 text-white border rounded-sm border-neut-13`}
    > .tippy-content {
      padding: 0;
    }
    &[data-placement^='top'] > .tippy-arrow::before {
      ${tw`border-t-neut-13`}
    }
    &[data-placement^='bottom'] > .tippy-arrow::before {
      ${tw`border-b-neut-13`}
    }
    &[data-placement^='left'] > .tippy-arrow::before {
      ${tw`border-l-neut-13`}
    }
    &[data-placement^='right'] > .tippy-arrow::before {
      ${tw`border-r-neut-13`}
    }
    > .tippy-backdrop {
      ${tw`bg-neut-13`}
    }
    > .tippy-svg-arrow {
      ${tw`fill-current text-neut-13`}
    }
  }

  .tippy-box[data-theme~='darker'] {
    font-size: 12px;
    line-height: 1.25;
    ${tw`bg-neut-17 text-white border rounded-sm border-neut-13`}
    > .tippy-content {
      padding: 0;
    }
    &[data-placement^='top'] > .tippy-arrow::before {
      border-top-color: #fff;
      ${tw`border-t-neut-17`}
    }
    &[data-placement^='bottom'] > .tippy-arrow::before {
      border-bottom-color: #fff;
      ${tw`border-b-neut-17`}
    }
    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: #fff;
      ${tw`border-l-neut-17`}
    }
    &[data-placement^='right'] > .tippy-arrow::before {
      border-right-color: #fff;
      ${tw`border-r-neut-17`}
    }
    > .tippy-backdrop {
      background-color: #fff;
      ${tw`bg-neut-17`}
    }
    > .tippy-svg-arrow {
      ${tw`fill-current text-neut-17`}
    }
  }
`

export default tippyStyles
