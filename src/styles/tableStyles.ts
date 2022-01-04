import tw, { css } from 'twin.macro'

const tableStyles = css`
  .portal-grid-table {
    .grid-table-content .grid-table-header,
    .table-row {
      .table-icon {
        ${tw`pr-0`}
      }
      .table-col:last-child .button.is-text {
        ${tw`px-0 mr-4`}
      }
      .table-col:not(.table-icon) {
        ${tw`min-w-[64px]`}// BUG：解决在宽度不够情况 table td 和 th 对不齐的情况，但是会产生横向滚动条，后续可能会配合固定列
      }
    }
  }
  .dark {
    .columns-setting-container {
      .button.is-default.is-trigger {
        // border-color: #4c5e70;
        ${tw`border-line-dark`}
        background-color: transparent;
        ${tw`hover:bg-neut-13 active:bg-neut-15`}
      }
    }
    .portal-grid-table {
      ${tw`w-full text-white`}
      .empty-placeholder {
        ${tw`text-white`}
        .icon {
          svg {
            ${tw`text-neut-13`}
          }
        }
      }
      .grid-table-content .grid-table-header,
      .table-row {
        .table-icon {
          ${tw`pr-0`}
          label.checkbox {
            &.checkbox-wrapper.indeterminate::after {
              left: 5px;
            }
            &.checkbox-wrapper.indeterminate::before {
              ${tw`bg-green-11`}
              border-color: transparent;
            }
            &::before {
              ${tw`border-neut-13`}
              background-color: transparent;
            }
            &.checked::before {
              ${tw`bg-green-11`}
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
      }
      .grid-table-content {
        ${tw`bg-neut-17`}
        .grid-table-header {
          ${tw`bg-neut-17 border-b border-neut-13 rounded-none`}
          .table-thead {
            ${tw`text-white`}
          }
        }
        .grid-table-block {
          ${tw`bg-neut-17`}
        }
      }
      .table-row {
        ${tw`bg-neut-16 border-b border-neut-13`}
        &:hover {
          ${tw`bg-neut-17`}
          a {
            ${tw`text-[#0EA5E9]`}
          }
        }
      }
      .grid-table-footer {
        ${tw`bg-neut-16 rounded-none pb-2`}
        > .portal-pagination {
          ${tw`text-white`}
          .pagination-number {
            ${tw`text-white`}
            .rc-pagination-item-active {
              ${tw`bg-green-11 bg-opacity-10`}
              a {
                ${tw`text-green-11`}
              }
            }
            a {
              ${tw` text-white`}
            }
            svg {
              ${tw`text-white`}
            }
          }
        }
      }
    }
    .columns-setting-container {
      .panel-header {
        ${tw`text-white`}
      }
      .panel-title {
        .icon > svg {
          ${tw`text-white`}
        }
        &:hover {
          ${tw`bg-neut-13`}
        }
        label {
          ${tw`text-white`};
        }
      }
      .panel-footer {
        ${tw`border-t-neut-13`}
      }
    }
  }
  .portal-grid-table {
    .portal-loading-wrapper > .loading {
      z-index: 119;
    }
  }
`

export default tableStyles
