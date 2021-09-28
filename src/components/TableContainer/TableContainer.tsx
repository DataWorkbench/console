import { useTable } from 'react-table'
import tw, { css, styled } from 'twin.macro'

const Table = styled('table')(() => [
  tw`border-collapse`,
  css`
    th,
    td {
      ${tw`border-b px-4 py-3`};

      border: 1px solid #e4ebf1;
    }
    tr:hover {
      background-color: #f5f7fa;
    }
    th {
      background-color: #f5f7fa;
    }
  `,
])

interface TableContainerProps {
  columns: any[]
  data: any[]
}

export const TableContainer = ({ columns, data }: TableContainerProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default TableContainer
