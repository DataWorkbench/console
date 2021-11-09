import React, { useCallback, useEffect, useMemo } from 'react'
import { Alert, Button, utils } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import dayjs from 'dayjs'

import { Table } from 'views/Space/styled'
import { useMutationUdf, useQueryUdfList, useStore } from 'hooks'
import { TableActions, LetterIcon } from '../styled'
import TableToolBar from './TableToolBar'
import { IUdfFilterInterface, IUdfTable, UdfActionType } from './interfaces'

const dataSource = [
  {
    name: 'reduce',
    id: 'xxx_efafb4_sfvf_2323',
    language: 4,
    desc: '这是一段描述',
    update_time: new Date().getTime() / 1000,
    example: '// hello world',
  },
]

const languageFilters = [
  {
    text: 'Java',
    value: 3,
  },
  {
    text: 'Python',
    value: 4,
  },
  {
    text: 'Scala',
    value: 5,
  },
]
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
      filter.sort_by === 'name' ? (filter.reverse ? 'desc' : 'asc') : '',

    render: (value: string, row: Record<string, any>) => {
      return value ? (
        <span
          tw="cursor-pointer inline-flex"
          onClick={() => actions('detail', row)}
        >
          <LetterIcon>
            <span>{value}</span>
          </LetterIcon>
          <span className="column-name">{value}</span>
        </span>
      ) : (
        ''
      )
    },
  },
  {
    title: 'ID',
    dataIndex: 'udf_id',
  },
  {
    title: '语言类型',
    dataIndex: 'udf_language',
    filters: languageFilters,
    filterValue: filter.udf_language,
    render: (val: number) =>
      languageFilters.find((i) => i.value === val)?.text || val,
  },
  {
    title: '描述',
    dataIndex: 'comment',
  },
  {
    title: '上传时间',
    dataIndex: 'updated',
    sortable: true,
    sortOrder:
      // eslint-disable-next-line no-nested-ternary
      filter.sort_by === 'updated' ? (filter.reverse ? 'desc' : 'asc') : '',
    render: (v: number) => dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '操作',
    render: (_: string, row: Record<string, any>) => (
      <TableActions>
        <Button
          type="text"
          onClick={() => {
            actions('edit', row)
          }}
        >
          编辑
        </Button>
        <Button
          type="text"
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

const udfTypes = {
  UDF: 1,
  UDTF: 2,
  UDTTF: 3,
}

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
      setUdfSelectedRowKeys: setSelectedRowKeys,
      // : columnSettings
    },
  } = useStore()

  const { data, refetch, isLoading } = useQueryUdfList(filter)
  console.log(data, isLoading, toJS(filter))

  const mutation = useMutationUdf()

  useEffect(() => {
    setFilter((_) => {
      _.current = 1
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
          mutation.mutate(
            { op: 'delete', udf_ids: [] },
            { onSuccess: () => console.log('成功了') }
          )
          break
        default:
          break
      }
    },
    [setOp, setModalData, mutation]
  )

  const defaultColumns = useMemo(() => {
    return getDefaultColumns(filter, actions)
  }, [filter, actions])

  const columns = useMemo(
    () => utils.getTableColumnsBySetting(defaultColumns, columnSettings),
    [columnSettings, defaultColumns]
  )

  const handleSelect = (keys: string[]) => {
    setSelectedRowKeys(keys)
  }

  const handleSort = (sortKey: string, order: 'desc' | 'asc') => {
    setFilter((_filter) => {
      _filter.sort_by = sortKey
      _filter.reverse = order === 'desc'
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
      <Alert message="提示" type="info" tw="bg-neut-16! mb-4" />
      <TableToolBar
        defaultColumns={defaultColumns}
        setFilter={setFilter}
        refetch={refetch}
      />
      <Table
        onSelect={handleSelect}
        selectedRowKeys={selectedRowKeys}
        selectType="checkbox"
        dataSource={dataSource}
        columns={columns}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        rowKey="id"
        title={tp}
        pagination={{
          total: 101,
          current: filter.current,
          pageSize: filter.pageSize,
        }}
      />
    </div>
  )
})

export default UdfTable
