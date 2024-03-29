/* eslint-disable no-underscore-dangle */
import { css } from 'twin.macro'
import { Table } from 'views/Space/styled'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import SelectTreeData from 'utils/selectTree'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Checkbox, Loading } from '@QCFE/lego-ui'
import { IColumn } from 'hooks/useHooks/useColumns'
import { isEqual } from 'lodash-es'
import { FlexBox } from '../Box'

export interface ISelectTreeTableProps {
  columns: IColumn[]
  dataSource: Record<string, any>[]
  getChildren: (key: string, record: Record<string, any>) => PromiseLike<Record<string, any>[]>
  openLevel?: number
  selectedLevel?: number
  indentSpace?: number
  [propName: string]: any
  rowKey?: string
  showItemCheckboxFn?: (item: Record<string, any>) => boolean
  showItemOpenFn?: (item: Record<string, any>) => boolean
  onChecked?: (key: string, checked: boolean) => void
  checkedKeys?: string[]
}

export const SelectTreeTable = (props: ISelectTreeTableProps) => {
  const {
    columns: columnsProp,
    dataSource,
    rowKey = 'id',
    openLevel = 1000,
    selectedLevel = 1000,
    indentSpace = 32,
    getChildren = async () => [],
    showItemCheckboxFn,
    showItemOpenFn,
    onChecked,
    checkedKeys = []
  } = props

  const [, fourUpdate] = useReducer((x) => x + 1, 0)

  const [loading, setLoading] = useState(false)
  const loadingKeySet = useRef<Set<string>>(new Set())

  const tableTreeRef = useRef<SelectTreeData>(
    new SelectTreeData(
      {
        key: SelectTreeData.rootKey,
        value: {},
        children: dataSource.map((d) => ({
          key: d[rowKey],
          value: d
        }))
      },
      {
        selectedAll: new Set(checkedKeys),
        map: new Map(),
        openedAll: new Set()
      }
    )
  )

  useEffect(() => {
    console.log(11111111, checkedKeys, tableTreeRef.current?.state?.selectedAll)
    if (!isEqual(checkedKeys, Array.from(tableTreeRef.current?.state?.selectedAll ?? []))) {
      tableTreeRef.current.setSelectedKeys(checkedKeys)
      fourUpdate()
    }
  }, [checkedKeys])

  useEffect(() => {
    tableTreeRef.current = new SelectTreeData({
      key: SelectTreeData.rootKey,
      value: {},
      children: dataSource.map((d) => ({
        key: d[rowKey],
        value: d
      }))
    })
    fourUpdate()
  }, [dataSource, rowKey])

  const handleOpen = useCallback(
    (key: string, record: Record<string, any>) => {
      if (!tableTreeRef.current.keyChildrenMap?.get(key)?.children?.size) {
        loadingKeySet.current.add(key)
        setLoading(true)
        getChildren(key, record).then((data: Record<string, any>[]) => {
          tableTreeRef.current.setChildren(
            key,
            data.map((i) => ({
              key: i[rowKey],
              value: i
            })) as any
          )
          tableTreeRef.current.onOpen(key)
          tableTreeRef.current.setSelectedKeys(checkedKeys)
          loadingKeySet.current.delete(key)
          setLoading(false)
          fourUpdate()
        })
      } else {
        tableTreeRef.current.onOpen(key)
        fourUpdate()
      }
    },
    [checkedKeys, getChildren, rowKey]
  )

  const renderTd = (column: IColumn) => (text: never, dataItem: Record<string, any>) => {
    if (typeof column.render === 'function') {
      return <div tw="flex-auto ">{column.render(text, dataItem)}</div>
    }
    return <div tw="flex-auto">{text}</div>
  }

  const renderFirstTd = useCallback(
    (column) => (text: string, record: Record<string, any>) => {
      let show = true
      if (showItemOpenFn) {
        show = showItemOpenFn(record)
      }
      let showCheckbox = true
      if (showItemCheckboxFn) {
        showCheckbox = showItemCheckboxFn(record)
      }
      return (
        <FlexBox
          tw="flex-auto gap-2"
          css={css`
            padding-left: ${(record.__level - 1) * indentSpace}px;
          `}
        >
          <FlexBox tw="flex-none gap-2 items-center">
            {record.__level <= openLevel &&
              show &&
              (loading && loadingKeySet.current.has(record[rowKey]) ? (
                <Loading size="small" />
              ) : (
                <Icon
                  name={
                    tableTreeRef.current.state.openedAll?.has(record[rowKey])
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  type="light"
                  clickable
                  size={16}
                  onClick={() => {
                    if (tableTreeRef.current.state.openedAll?.has(record[rowKey])) {
                      tableTreeRef.current.onOpen(record[rowKey])
                      fourUpdate()
                    } else {
                      handleOpen(record[rowKey], record)
                    }
                  }}
                />
              ))}
            {record.__level <= selectedLevel && showCheckbox && (
              <Checkbox
                indeterminate={record.__isSelected === 2}
                checked={record.__isSelected === 1 || record.isSelected === 2}
                onChange={(e, checked: boolean) => {
                  if (!checked) {
                    tableTreeRef.current.onRemove(record[rowKey])
                  } else {
                    tableTreeRef.current.onAdd(record[rowKey])
                  }
                  if (onChecked) {
                    onChecked(record[rowKey], checked)
                  }
                  fourUpdate()
                }}
              />
            )}
          </FlexBox>
          {renderTd(column)(text as never, record)}
        </FlexBox>
      )
    },
    [
      handleOpen,
      indentSpace,
      loading,
      onChecked,
      openLevel,
      rowKey,
      selectedLevel,
      showItemCheckboxFn,
      showItemOpenFn
    ]
  )

  const columns = useMemo(
    () => [
      {
        ...columnsProp[0],
        render: renderFirstTd(columnsProp[0]),
        title: <div tw="pl-10">{columnsProp[0]?.title}</div>
      },
      ...columnsProp.slice(1).map((i) => ({ ...i, render: renderTd(i) }))
    ],
    [columnsProp, renderFirstTd]
  )

  return (
    <Table
      {...props}
      columns={columns}
      rowKey={rowKey}
      dataSource={tableTreeRef.current
        .getList((d) => ({
          ...d.value,
          __level: d.level,
          __isSelected: d.isSelected
        }))
        .filter((i) => {
          if (i.__level === 1) {
            return true
          }
          return tableTreeRef.current.state.openedAll?.has(
            tableTreeRef.current.keyChildrenMap?.get(i[rowKey]!)?.pid!
          )
        })}
    />
  )
}

// export default SelectTreeTable
