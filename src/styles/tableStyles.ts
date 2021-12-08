import tw, { css } from 'twin.macro'

const tableStyles = css`
  .dark {
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
