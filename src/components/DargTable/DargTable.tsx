import tw, { css, styled } from 'twin.macro'
import '@QCFE/lego-ui/lib/scss/lego-ui.min.css'

import DraggableRow from './DraggableRow'

interface Columns<T> {
  title: string
  key?: keyof T
  render?: (text: any, record: T, index: number) => React.ReactNode
  width?: number
  dataIndex?: string
  align?: string | undefined
  headRender?: (val?: T) => React.ReactNode
}

export interface DargTableProps<T> {
  columns: Columns<T>[]
  dataSource: T[]
  moveRow: (dragIndex: number, hoverIndex: number) => void
  type?: string
  renderFooter?: () => React.ReactNode
}

export const DragTable = styled('div')(() => [
  tw`border-neut-13! border-solid border-[1px]`,
  css`
    & > div {
      ${tw`dark:border-neut-13`}
    }
    .drop-over-downward {
      border-bottom: 2px dashed #1890ff !important;
    }
    .drop-over-upward {
      border-top: 2px dashed #1890ff !important;
    }
  `
])

const TableHeader = styled('div')(() => [
  css`
    ${tw`bg-neut-16! h-11 flex`}
    div {
      ${tw`flex items-center ml-6`}
    }
  `
])
export const TableBody = styled('div')(() => [
  css`
    .table-row {
      ${tw`bg-neut-17 flex border-neut-13 p-0`}
      &:hover {
        ${tw`dark:bg-[#1E2F41] border-b-0`}
      }
      & > div {
        ${tw`flex items-center ml-6`}
      }
    }
  `
])

export function getData(item: any, key: any) {
  const data = item[key]
  return data === undefined || data === null || data === '' ? '-' : data
}

export const DargTable = (props: DargTableProps<any>) => {
  const { columns, dataSource, type = 'DraggableBodyRow', moveRow, renderFooter } = props

  return (
    <DragTable className="darg-table" tw="border-neut-13!">
      <TableHeader className="darg-table-header">
        {columns.map((item) => {
          if (item.headRender) {
            return (
              <div key={item.key as string} style={item?.width ? { width: item.width } : {}}>
                {item.headRender()}
              </div>
            )
          }
          return (
            <div key={item.key as string} style={item?.width ? { width: item.width } : {}}>
              {item.title}
            </div>
          )
        })}
      </TableHeader>
      <TableBody className="darg-table-body">
        {dataSource.map((item: any, i) => (
          <DraggableRow type={type} index={i} moveRow={moveRow} key={String(i)} className="group">
            {columns.map((k, j) => (
              <div style={k?.width ? { width: k.width } : {}} key={j as number}>
                {k.render
                  ? k.render && k.render(getData(item, k.key), item, i)
                  : getData(item, k.key)}
              </div>
            ))}
          </DraggableRow>
        ))}
      </TableBody>
      {renderFooter?.()}
    </DragTable>
  )
}
