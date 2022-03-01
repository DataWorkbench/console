import tw, { css } from 'twin.macro'

const tippyStyles = css`
  .tippy-box {
    .tippy-content {
      padding: 0;
      ${tw`break-all`}
    }
  }
  .tippy-box[data-theme~='light'] {
    font-size: 12px;
    line-height: 1.25;
    color: #26323d;
    box-shadow: 0px 1px 6px rgba(50, 69, 88, 0.2);
    ${tw`bg-white border border-solid border-neut-3 dark:border-none`}

    &[data-placement^='top'] > .tippy-arrow::before {
      ${tw`border-t-neut-3 dark:border-t-white`}
    }
    &[data-placement^='bottom'] > .tippy-arrow::before {
      ${tw`border-b-neut-3 dark:border-b-white`}
    }
    &[data-placement^='left'] > .tippy-arrow::before {
      border-left-color: #cbd5e1;
      ${tw`border-l-neut-3 dark:border-l-white`}
    }
    &[data-placement^='right'] > .tippy-arrow::before {
      ${tw`border-r-neut-3 dark:border-r-white`}
    }
    > .tippy-backdrop {
      ${tw`border-neut-3 dark:border-white`}
    }
    .tippy-svg-arrow {
      ${tw`dark:text-white dark:fill-current`}
    }
  }

  .tippy-box[data-theme~='dark'] {
    font-size: 12px;
    line-height: 1.25;
    ${tw`bg-neut-13 text-white border rounded-[3px] border-neut-13`}

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
    ${tw`bg-neut-17 text-white border-0 rounded-[3px]`}

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
  .tippy-box[data-theme~='green'] {
    font-size: 12px;
    line-height: 1.25;
    ${tw`bg-green-11 text-white border-0 rounded-[3px]`}

    &[data-placement^='top'] > .tippy-arrow::before {
      ${tw`border-t-green-11`}
    }
    &[data-placement^='bottom'] > .tippy-arrow::before {
      ${tw`border-b-green-11`}
    }
    &[data-placement^='left'] > .tippy-arrow::before {
      ${tw`border-l-green-11`}
    }
    &[data-placement^='right'] > .tippy-arrow::before {
      ${tw`border-r-green-11`}
    }
    > .tippy-backdrop {
      ${tw`bg-green-11`}
    }
    > .tippy-svg-arrow {
      ${tw`fill-current text-green-11`}
    }
  }
  .tippy-box.popconfirm-box {
    ${tw`bg-neut-16 text-white leading-5`}
  }
  .tippy-box.popconfirm-box[data-theme~='light'] {
    ${tw`bg-white text-neut-13`}
    .tippy-arrow::before {
      ${tw`border-t-white`}
    }
  }
`

export default tippyStyles
