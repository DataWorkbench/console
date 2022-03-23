import { useCallback, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { DarkModal } from 'components/Modal'
import { Button, InputSearch, Table } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import { useQueryReleaseJobVersions } from 'hooks'
import { omitBy } from 'lodash-es'
import dayjs from 'dayjs'
import { useStore } from 'stores'

interface IFilter {
  limit: number
  offset: number
  reverse: boolean
  search?: string
  sort_by?: string
}

const JobVersions = (props: any) => {
  const { workFlowStore } = useStore()
  const { onCancel } = props

  const [filter, setFilter] = useImmer<IFilter>({
    limit: 10,
    offset: 0,
    sort_by: 'updated',
    reverse: true,
  })

  const handleCheckJobByVersion = useCallback(
    (row: Record<string, any>) => {
      workFlowStore.set({ curVersion: row })
      onCancel()
    },
    [workFlowStore, onCancel]
  )

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '版本',
        dataIndex: 'version',
      },
      {
        title: '操作人',
        dataIndex: 'created_by',
      },
      {
        title: '提交时间',
        dataIndex: 'updated',
        sortable: true,
        sortOrder:
          // eslint-disable-next-line no-nested-ternary
          filter.sort_by === 'updated' ? (filter.reverse ? 'asc' : 'desc') : '',
        render: (value: number) => (
          <div tw="text-neut-8">
            {dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '发布描述',
        dataIndex: 'desc',
      },
      {
        title: '操作',
        dataIndex: 'table_actions',
        render: (_: any, row: Record<string, any>) => (
          <Button type="text" onClick={() => handleCheckJobByVersion(row)}>
            查看
          </Button>
        ),
      },
    ],
    [filter.reverse, filter.sort_by, handleCheckJobByVersion]
  )

  const { isFetching, data } = useQueryReleaseJobVersions(
    omitBy(filter, (v) => v === '')
  )

  return (
    <>
      <DarkModal
        visible
        orient="fullright"
        title="历史版本"
        width={800}
        onCancel={onCancel}
        footer={
          <Button type="primary" onClick={onCancel}>
            关闭
          </Button>
        }
      >
        <div tw="px-5 pt-6">
          {false && (
            <InputSearch
              tw="w-[328px] mt-6 mb-3"
              css={css`
                input {
                  ${tw`rounded-2xl`}
                }
              `}
              placeholder="搜索操作人、版本、备注"
            />
          )}
          <Table
            rowKey="version"
            columns={columns}
            loading={isFetching}
            dataSource={data?.infos || []}
            onSort={(sortKey: any, order: string) => {
              setFilter((draft) => {
                draft.sort_by = sortKey
                draft.reverse = order === 'asc'
              })
            }}
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
                setFilter((draft: any) => {
                  draft.offset = 0
                  draft.limit = size
                })
              },
            }}
          />
        </div>
      </DarkModal>
    </>
  )
}

export default JobVersions
