import { Table as LegoTable } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'

export const Table = styled(LegoTable)(
  () => css`
    ${tw`w-full text-white`}
    .grid-table-header {
      ${tw`bg-neut-17 border-b border-neut-13 rounded-none`}
      .table-thead {
        ${tw`text-white`}
      }
    }
    .table-row {
      ${tw`bg-neut-16 border-b border-neut-13`}
      &:hover {
        ${tw`bg-neut-17`}
      }
    }
    .grid-table-footer {
      ${tw`bg-neut-16 rounded-none`}
      > .portal-pagination {
        ${tw`text-white`}
        .pagination-number {
          ${tw`text-white`}
          a {
            ${tw` text-white`}
          }
          svg {
            ${tw`text-white`}
          }
        }
      }
    }
  `
)

export default {}
