import React, { useCallback, useEffect, useMemo } from 'react'
import { Alert, Button, utils } from '@QCFE/qingcloud-portal-ui'
import { Level, LevelLeft, LevelRight } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'

import { observer } from 'mobx-react-lite'
import dayjs from 'dayjs'

import { Table } from 'views/Space/styled'
import { useQueryUdfList, useStore } from 'hooks'
import { TextHighlight, TextLink } from 'components'
import { TableActions, LetterIcon } from '../styled'
import TableToolBar from './TableToolBar'
import { IUdfFilterInterface, IUdfTable, UdfActionType } from './interfaces'
import { languageFilters, udfTypes, udfTypesComment } from './constants'

// TODO: table Dark/文字色/次级辅助色
const getDefaultColumns = (
  filter: Record<string, any>,
  actions: (type: UdfActionType, detail: Record<string, any>) => void
) => [
  {
    title: '函数名称',
    dataIndex: 'name',
    sortable: true,
    sortOrder:
      // eslint-disable-next-line no-nested-ternary
      filter.sort_by === 'name' ? (filter.reverse ? 'asc' : 'desc') : '',

    render: (value: string, row: Record<string, any>) => {
      return value ? (
        <span
          tw="cursor-pointer inline-flex"
          onClick={() => actions('detail', row)}
        >
          <LetterIcon>
            <span>{value}</span>
          </LetterIcon>
          <span className="column-name">
            <TextHighlight text={value} filterText={filter.search} />
          </span>
        </span>
      ) : (
        ''
      )
    },
  },
  {
    title: 'ID',
    dataIndex: 'udf_id',
    render(val: string) {
      return (
        <span tw="dark:text-neut-8">
          <TextHighlight text={val} filterText={filter.search} />
        </span>
      )
    },
  },
  {
    title: '语言类型',
    dataIndex: 'udf_language',
    // filters: languageFilters, // 语言不用过滤
    // filterValue: filter.udf_language,
    render: (val: number) =>
      languageFilters.find((i) => i.value === val)?.text || val,
  },
  {
    title: '描述',
    dataIndex: 'comment',
    render: (val: string) => <span tw="dark:text-neut-8">{val}</span>,
  },
  {
    title: '更新时间',
    dataIndex: 'updated',
    sortable: true,
    sortOrder:
      // eslint-disable-next-line no-nested-ternary
      filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
    render: (v: number) => (
      <span tw="dark:text-neut-8">
        {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
      </span>
    ),
  },
  {
    title: '操作',
    render: (_: string, row: Record<string, any>) => (
      <TableActions>
        <Button
          type="text"
          className="column-action"
          onClick={() => {
            actions('edit', row)
          }}
        >
          编辑
        </Button>
        <Button
          type="text"
          className="column-action"
          onClick={() => {
            actions('delete', row)
          }}
        >
          删除
        </Button>
      </TableActions>
    ),
  },
]

const UdfTable = observer(({ tp }: IUdfTable) => {
  const [filter, setFilter] = useImmer<IUdfFilterInterface>({
    offset: 0,
    limit: 10,
    reverse: true,
    udf_type: udfTypes[tp] as 1,
    sort_by: 'updated',
  })

  const {
    dmStore: {
      setOp,
      udfType,
      setModalData,
      udfColumnSettings: columnSettings,
      udfSelectedRowKeys: selectedRowKeys,
      setUdfSelectedRows,
      setUdfFilterRows,
      // : columnSettings
    },
  } = useStore()

  const { data, refetch, isFetching } = useQueryUdfList(filter)

  useEffect(() => {
    setFilter((_) => {
      _.current = 1
      _.offset = 0
    })
  }, [udfType, setFilter])

  const actions = useCallback(
    (actionType: UdfActionType, detail: Record<string, any>) => {
      switch (actionType) {
        case 'detail':
        case 'edit':
          setOp(actionType)
          setModalData(detail)
          break
        case 'delete':
          setUdfFilterRows([detail])
          setOp(actionType)
          break
        default:
          break
      }
    },
    [setOp, setModalData, setUdfFilterRows]
  )

  const defaultColumns = useMemo(() => {
    return getDefaultColumns(filter, actions)
  }, [filter, actions])

  const columns = useMemo(
    () => utils.getTableColumnsBySetting(defaultColumns, columnSettings),
    [columnSettings, defaultColumns]
  )

  const handleSelect = (keys: string[], rows: Record<string, any>[]) => {
    setUdfSelectedRows(rows)
  }

  const handleSort = (sortKey: string, order: 'desc' | 'asc') => {
    setFilter((_filter) => {
      _filter.sort_by = sortKey
      _filter.reverse = order !== 'desc'
    })
  }

  const handleFilterChange = ({
    udf_language,
  }: {
    udf_language: number | 'all'
  }) => {
    setFilter((_filter) => {
      _filter.udf_language = udf_language === 'all' ? undefined : udf_language
    })
  }

  return (
    <div tw="w-full">
      <Alert
        message={
          <Level as="nav">
            <LevelLeft>{udfTypesComment[tp]?.comment}</LevelLeft>
            <LevelRight>
              <TextLink
                href="https://nightlies.apache.org/flink/flink-docs-release-1.11/dev/table/functions/udfs.html"
                target="_blank"
                // tw="text-link"
                rel="noreferrer"
                hasIcon={false}
                // className="link"
              >
                查看详情 →
              </TextLink>
            </LevelRight>
          </Level>
        }
        type="info"
        tw="bg-neut-16! mb-4"
      />
      <TableToolBar
        defaultColumns={defaultColumns}
        setFilter={setFilter}
        refetch={refetch}
      />
      <Table
        onSelect={handleSelect}
        selectedRowKeys={selectedRowKeys}
        selectType="checkbox"
        loading={isFetching}
        dataSource={data?.infos || []}
        // dataSource={dataSource}
        columns={columns}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        rowKey="udf_id"
        title={tp}
        pagination={{
          total: data?.total || 0,
          current: filter.offset / filter.limit + 1,
          pageSize: filter.limit,
          onPageChange: (current: number) => {
            setFilter((draft) => {
              draft.offset = (current - 1) * filter.limit
            })
          },
          onShowSizeChange: (size: number) => {
            setFilter((draft) => {
              draft.offset = 0
              draft.limit = size
            })
          },
        }}
      />
    </div>
  )
})

export default UdfTable
