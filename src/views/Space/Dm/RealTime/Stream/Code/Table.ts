import { Table as LegoTable } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'

const Table = styled(LegoTable)(
  () => css`
    ${tw`w-full text-white`}
    .table-thead, .table-col {
      ${tw`justify-end!`}
    }
    .grid-table-header {
      ${tw`bg-neut-17 rounded-none`}
      .table-thead {
        ${tw`text-white border-neut-13 relative`}
      }
    }
    .table-row {
      ${tw`bg-neut-17! border-transparent! text-[#939EA9]!`}
      &:hover {
        ${tw`bg-neut-17! text-white! border-neut-13!`}
      }
    }
  `
)

export default Table
