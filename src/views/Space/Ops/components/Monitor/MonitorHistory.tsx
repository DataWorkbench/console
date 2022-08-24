import { Icon, InputSearch, Button } from '@QCFE/qingcloud-portal-ui'
import { FlexBox } from 'components'
import { useColumns, IColumn } from 'hooks/useHooks/useColumns'
import { Table } from 'views/Space/styled'
import dayjs from 'dayjs'
import { Circle } from 'views/Space/Ops/styledComponents'
import tw, { css } from 'twin.macro'
import { apiHooks } from 'hooks/apiHooks'
import { AlertManageListAlertPoliciesType } from 'types/response'
import { ListAlertPoliciesRequestType } from 'types/request'
import useFilter from 'hooks/useHooks/useFilter'
import { useParams } from 'react-router-dom'
import { Mapping, MappingKey } from 'utils/types'
import { historyFiledMapping } from 'views/Space/Ops/Alert/common/mapping'
import { get } from 'lodash-es'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const ClusterFieldMapping: Mapping<'name' | 'updated'> = new Map([
  ['name', { label: '告警内容', apiField: 'job_id' }],
  ['updated', { label: '告警时间', apiField: 'updated' }]
])

export const alertHistoryColumns: IColumn[] = getField(ClusterFieldMapping)
const getName = (name: MappingKey<typeof historyFiledMapping>) =>
  historyFiledMapping.get(name)!.apiField

const useQueryListAlertLogs = apiHooks<
  'alertManage',
  ListAlertPoliciesRequestType,
  AlertManageListAlertPoliciesType
>('alertManage', 'listAlertLogs')

const itemSettingKey = 'ITEM_MONITOR_HISTORY'

const MonitorHistory = ({ jobId }: { jobId?: string }) => {
  console.log(jobId)
  const { spaceId, detail } = useParams<{ spaceId: string; detail: string }>()

  const {
    filter,
    setFilter,
    pagination,
    sort,
    getColumnSort: getSort
  } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: false }
  >(
    {
      sort_by: getName('updated'),
      reverse: true,
      offset: 0,
      limit: 10,
      job_id: detail
    },
    { pagination: true },
    itemSettingKey
  )

  const { data, isFetching, refetch } = useQueryListAlertLogs({
    uri: { space_id: spaceId },
    params: filter as any
  })

  const renderColumns = {
    [getName('job_id')]: {
      render: (text: string, record: Record<string, any>) => (
        <FlexBox tw="items-center gap-2">
          <Circle>
            <Icon name="q-bellLightningFill" size={16} type="light" />
          </Circle>
          <div>
            <div tw="text-neut-8">{record.job_id}</div>
          </div>
        </FlexBox>
      )
    },
    [getName('updated')]: {
      ...getSort(getName('updated')),
      render: (v: number) => (
        <span tw="text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    }
  }

  const { columns } = useColumns(itemSettingKey, alertHistoryColumns, renderColumns)
  const infos = get(data, 'infos', []) || []
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
        <Button type="black" loading={!!isFetching} tw="w-auto px-[5px] border-line-dark!">
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
        onSort={sort}
        columns={columns}
        dataSource={infos}
        rowKey="id"
        pagination={{
          total: data?.total || 0,
          ...pagination
        }}
      />
    </div>
  )
}

export default MonitorHistory
