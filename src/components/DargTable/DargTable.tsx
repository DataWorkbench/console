/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox, Icon, Label } from '@QCFE/lego-ui'
import { useCallback } from 'react'
import tw, { css, styled } from 'twin.macro'

import DraggableRow, { Row } from './DraggableRow'
import Empty from '../Empty'

const CheckBoxLabel = styled(Label)(() => [
  css`
    ${tw`flex! items-center! h-11!`}
    .checkbox {
      ${tw`h-[16px]! w-[13px]!`}
    }
  `
])

const CheckboxSpan = styled.span`
  ${tw`ml-2! leading-4!`}
`
const TableHeader = styled('div')(() => [
  css`
    ${tw`bg-neut-16! h-11! flex! border-neut-13!`}
    div {
      ${tw`flex! items-center! ml-6! font-bold`}
    }
    div:last-child {
      ${tw`mr-6!`}
    }
  `
])

export const TableBody = styled('div')(() => [
  css`
    .group {
      & > div {
        ${tw`flex items-center ml-6!`}
      }
      & > div:last-child {
        ${tw`mr-6!`}
      }
      input {
        ${tw`h-7!`}
      }
      .select {
        ${tw`h-7!`}
        .select-control {
          ${tw`h-7! flex justify-between`}
          .select-arrow-zone {
            ${tw`h-7!`}
          }
        }
      }
    }
    .table-row {
      ${tw`bg-neut-17! flex border-neut-13! p-0!`}
      &:hover {
        ${tw`dark:bg-[#1E2F41] border-b-0!`}
      }
      & > div {
        ${tw`flex items-center ml-6!`}
      }
      &:last-child {
        ${tw`border-b-0!`}
      }
    }
  `
])

export const DragTable = styled('div')(({ disabled }: { disabled?: boolean }) => [
  tw`border-neut-13! border-solid border-[1px] relative`,
  disabled &&
    css`
      ${tw`cursor-not-allowed`}
      & > * {
        pointer-events: none;
      }
    `,
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

interface Columns<T = any> {
  title: string | React.ReactNode // 标题
  key?: keyof T // 对应的字段名
  render?: (text: any, record: T, index: number) => React.ReactNode // 渲染函数
  width?: number // 宽度
  dataIndex?: string // 对应的字段名
  checkbox?: boolean // 是否显示checkbox
  checkboxText?: string // checkbox显示文字
  onSelect?: (selected: boolean, record: T, index: number) => void // 选中行回调
  onAllSelect?: (selected: boolean, record: T, index: number) => void // 选中列回调
}

export interface DargTableProps<T = any> {
  columns: Columns<T>[] // 列配置
  dataSource: T[] // 数据源
  moveRow?: (dragIndex: number, hoverIndex: number) => void // 拖拽回调
  runDarg?: boolean // 是否可拖拽
  type?: string // 拖拽类型
  renderFooter?: () => React.ReactNode // 脚部渲染函数
  disabled?: boolean // 是否可以操作
}

export const DargTable = (props: DargTableProps<any>) => {
  const {
    columns,
    dataSource,
    type = 'DraggableBodyRow',
    moveRow,
    renderFooter,
    runDarg = true,
    disabled = false
  } = props

  const getData = useCallback(
    (item: any, key: any, column: Columns<any>, idx: number) => {
      const data = item[key]

      //  如果行内是复选框
      if (column.checkbox) {
        return (
          <CheckBoxLabel>
            <Checkbox
              disabled={disabled}
              checked={!!data}
              onChange={(_, checked) => {
                if (column?.onSelect) {
                  column?.onSelect(checked, item, idx)
                }
              }}
            />
            <CheckboxSpan>{column.checkboxText}</CheckboxSpan>
          </CheckBoxLabel>
        )
      }
      return data === undefined || data === null || data === '' ? '' : data
    },
    [disabled]
  )

  const indeterminate = useCallback(
    (key) => {
      const mapData = dataSource.map((data) => data[key])
      return mapData.filter((i) => i).length !== 0
    },
    [dataSource]
  )

  const allChecked = useCallback(
    (key) => {
      const mapData = dataSource.map((data) => data[key])
      return mapData.filter((i) => i).length === dataSource.length
    },
    [dataSource]
  )

  return (
    <DragTable className="darg-table" tw="border-neut-13!" disabled={disabled}>
      <TableHeader className="darg-table-header">
        {columns.map((item, index) => (
          <div key={item.key as string} style={item?.width ? { width: item.width } : { flex: 1 }}>
            {item?.checkbox ? (
              <CheckBoxLabel>
                <Checkbox
                  disabled={disabled}
                  onChange={(_, checked) => {
                    if (item?.onAllSelect) {
                      item?.onAllSelect(checked, item, index)
                    }
                  }}
                  checked={allChecked(item.key)}
                  indeterminate={indeterminate(item.key)}
                />
                <CheckboxSpan>{item.title}</CheckboxSpan>
              </CheckBoxLabel>
            ) : (
              item.title
            )}
          </div>
        ))}
      </TableHeader>
      <TableBody className="darg-table-body">
        {dataSource.length > 0
          ? dataSource.map((item: any, i) => {
              if (runDarg && moveRow && !disabled) {
                return (
                  <DraggableRow
                    type={type}
                    index={i}
                    moveRow={moveRow}
                    key={item}
                    className="group"
                  >
                    {columns.map((k, j) => (
                      <div style={k?.width ? { width: k.width } : { flex: 1 }} key={j as number}>
                        {k.render
                          ? k.render && k.render(getData(item, k.key, k, i), item, i)
                          : getData(item, k.key, k, i)}
                      </div>
                    ))}
                  </DraggableRow>
                )
              }
              return (
                <Row key={item} className="group">
                  {columns.map((k, j) => (
                    <div style={k?.width ? { width: k.width } : { flex: 1 }} key={j as number}>
                      {k.render
                        ? k.render && k.render(getData(item, k.key, k, i), item, i)
                        : getData(item, k.key, k, i)}
                    </div>
                  ))}
                </Row>
              )
            })
          : !renderFooter && (
              <Empty icon={<Icon name="display" size={56} />} description="暂无数据" />
            )}
      </TableBody>
      {renderFooter?.()}
    </DragTable>
  )
}
