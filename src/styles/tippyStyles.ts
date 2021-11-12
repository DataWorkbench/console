import tw, { css } from 'twin.macro'

const tippyStyles = css`
  .tippy-box[data-theme~='light'] {
    font-size: 12px;
    line-height: 1.25;
    color: #26323d;
    box-shadow: 0 0 20px 4px rgba(154, 161, 177, 0.15),
      0 4px 80px -8px rgba(36, 40, 47, 0.25),
      0 4px 4px -2px rgba(91, 94, 105, 0.15);
    background-color: #fff;
  }
  .tippy-box[data-theme~='light'] > .tippy-content {
    padding: 0;
  }
  .tippy-box[data-theme~='light'][data-placement^='top']
    > .tippy-arrow::before {
    border-top-color: #fff;
  }
  .tippy-box[data-theme~='light'][data-placement^='bottom']
    > .tippy-arrow::before {
    border-bottom-color: #fff;
  }
  .tippy-box[data-theme~='light'][data-placement^='left']
    > .tippy-arrow::before {
    border-left-color: #fff;
  }
  .tippy-box[data-theme~='light'][data-placement^='right']
    > .tippy-arrow::before {
    border-right-color: #fff;
  }
  .tippy-box[data-theme~='light'] > .tippy-backdrop {
    background-color: #fff;
  }
  .tippy-box[data-theme~='light'] > .tippy-svg-arrow {
    fill: #fff;
  }

  .tippy-box[data-theme~='dark'] {
    font-size: 12px;
    line-height: 1.25;

    ${tw`bg-neut-13 text-white border-2 rounded-sm border-neut-13`}
  }
  .tippy-box[data-theme~='dark'] > .tippy-content {
    padding: 0;
  }
  .tippy-box[data-theme~='dark'][data-placement^='top'] > .tippy-arrow::before {
    border-top-color: #fff;
    ${tw`border-t-neut-17`}
  }
  .tippy-box[data-theme~='dark'][data-placement^='bottom']
    > .tippy-arrow::before {
    border-bottom-color: #fff;
    ${tw`border-b-neut-13`}
  }
  .tippy-box[data-theme~='dark'][data-placement^='left']
    > .tippy-arrow::before {
    border-left-color: #fff;
    ${tw`border-l-neut-17`}
  }
  .tippy-box[data-theme~='dark'][data-placement^='right']
    > .tippy-arrow::before {
    border-right-color: #fff;
    ${tw`border-r-neut-17`}
  }
  .tippy-box[data-theme~='dark'] > .tippy-backdrop {
    background-color: #fff;
    ${tw`bg-neut-17`}
  }
  .tippy-box[data-theme~='dark'] > .tippy-svg-arrow {
    fill: #fff;
  }
`

export default tippyStyles
