import { Icon, InputSearch, Button } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { IColumn, useColumns } from 'hooks/useHooks/useColumns'
import { useImmer } from 'use-immer'
import { Circle } from 'views/Space/Ops/DataIntegration/styledComponents'
import { Table } from 'views/Space/styled'
import dayjs from 'dayjs'
import tw, { css } from 'twin.macro'

const defaultColumns: IColumn[] = [
  {
    title: '告警内容',
    key: 'id',
    dataIndex: 'id',
  },
  {
    title: '告警时间',
    key: 'time',
    dataIndex: 'time',
  },
]

const itemSettingKey = 'ITEM_MONITOR_HISTORY'

const MonitorHistory = () => {
  const [filter, setFilter] = useImmer<{
    reverse?: 'asc' | 'desc'
    sort_by?: string
    search?: string
    offset: number
    limit: number
  }>({
    search: '',
    limit: 10,
    offset: 0,
  })

  const renderColumns = {
    id: {
      render: (text: string, record: Record<string, any>) => {
        console.log(text, record)
        return (
          <FlexBox tw="items-center gap-2">
            <Circle>
              <Icon name="q-bellLightningFill" size={16} type="light" />
            </Circle>
            <div>
              <div tw="text-white font-semibold">实例运行超时： 7200 秒</div>
              <div tw="text-neut-8"> stj-g0ljvp7ed1r1dmxg</div>
            </div>
          </FlexBox>
        )
      },
    },
    time: {
      render: (text: number) => {
        return dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  }

  const { columns } = useColumns(itemSettingKey, defaultColumns, renderColumns)
  const data = {
    total: 10,
    infos: [
      {
        id: '1',
      },
    ],
  }
  const isFetching = false
  const refetch = () => {}

  return (
    <div>
      <FlexBox tw="justify-end gap-2">
        <InputSearch
          tw="w-64"
          placeholder="请输入关键词进行搜索"
          onPressEnter={(evt) => {
            setFilter((_) => {
              _.search = String((evt.target as HTMLInputElement).value)
              _.offset = 0
            })
          }}
          onClear={() => {
            setFilter((_) => {
              if (_.search) {
                _.search = ''
                _.offset = 0
              }
            })
          }}
        />
        <Button
          type="black"
          loading={!!isFetching}
          tw="w-auto px-[5px] border-line-dark!"
        >
          <Icon
            name="if-refresh"
            tw="text-xl text-white"
            type="light"
            onClick={() => {
              refetch()
            }}
          />
        </Button>
      </FlexBox>
      <Table
        tw="mt-2"
        css={css`
          .grid-table-header {
            ${tw`bg-[#1e2f41]!`}
          }
        `}
        columns={columns}
        dataSource={data?.infos ?? []}
        rowKey="id"
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
}

export default MonitorHistory
