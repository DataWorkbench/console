import { useMemo } from 'react'
import { useImmer } from 'use-immer'
import { DarkModal } from 'components/Modal'
import { Button, InputSearch, Table } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import { useQueryReleaseJobVersions } from 'hooks'
import { omitBy } from 'lodash-es'
import dayjs from 'dayjs'

interface IFilter {
  limit: number
  offset: number
  search?: string
  sort_by?: string
}

const JobVersions = (props: any) => {
  const { onCancel } = props

  const [filter, setFilter] = useImmer<IFilter>({
    limit: 10,
    offset: 0,
  })

  const handleCheckJobByVersion = (row: Record<string, any>) => {
    console.log(row)
  }

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
        dataIndex: 'user',
      },
      {
        title: '提交时间',
        dataIndex: 'updated',
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
    []
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
        <div tw="px-5">
          <InputSearch
            tw="w-[328px] mt-6 mb-3"
            css={css`
              input {
                ${tw`rounded-2xl`}
              }
            `}
            placeholder="搜索操作人、版本、备注"
          />
          <Table
            columns={columns}
            loading={isFetching}
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
