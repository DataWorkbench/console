import useIcon from 'hooks/useHooks/useIcon'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, InstanceName, TableHeader } from 'components'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import dayjs from 'dayjs'
import { MappingKey } from 'utils/types'
import { historyFiledMapping } from 'views/Space/Ops/Alert/common/mapping'
import { apiHooks } from 'hooks/apiHooks'
import { ListAlertLogsRequestType } from 'types/request'
import { AlertManageListAlertLogsType } from 'types/response'
import { useParams } from 'react-router-dom'
import useFilter from 'hooks/useHooks/useFilter'
import icons from './common/icons'
import {
  alertHistoryColumns,
  alertHistorySuggestions,
  alertHistoryTabs,
  alertStatus,
  monitorObjectTypes,
} from './common/constants'

const useQueryListAlertLogs = apiHooks<
  'alertManage',
  ListAlertLogsRequestType,
  AlertManageListAlertLogsType
>('alertManage', 'listAlertLogs')

// const getQueryListAlertLogsKey = () => queryKeyObj.listAlertLogs

interface IAlertHistory {}

const instanceNameStyle = css`
  &:hover {
    .instance-name-title {
      ${tw`text-green-11`}
    }

    .instance-name-icon {
      ${tw`bg-[#13966a80] border-[#9ddfc966]`}
      .icon svg.qicon {
        ${tw`text-green-11`}
      }
    }
  }
`
const getName = (name: MappingKey<typeof historyFiledMapping>) =>
  historyFiledMapping.get(name)!.apiField

const alertHistorySettingKey = 'ALERT_HISTORY_SETTING_KEY'
const AlertHistory = (props: IAlertHistory) => {
  console.log(props)
  useIcon(icons)
  const { filter, pagination, sort, getColumnFilter } = useFilter<
    {
      alert_id?: string
      job_id?: string
      instance_id?: string
      monitor_object?: number
      event_type?: number
    },
    { pagination: true; sort: false }
  >({}, { pagination: true }, alertHistorySettingKey)

  const { columns, setColumnSettings } = useColumns(
    alertHistorySettingKey,
    alertHistoryColumns,
    {
      alert_id: {
        render: (text) => {
          return (
            <InstanceName theme="dark" name={text} css={instanceNameStyle} />
          )
        },
      },

      [getName('monitor_object')]: {
        ...getColumnFilter(getName('monitor_object'), monitorObjectTypes),
        render: (type: keyof typeof monitorObjectTypes) => {
          return monitorObjectTypes[type]?.label
        },
      },
      [getName('event_type')]: {
        ...getColumnFilter(getName('event_type'), alertStatus),
        render: (type: keyof typeof alertStatus) => {
          return alertStatus[type]?.label
        },
      },
      [getName('updated')]: {
        render: (v) => (
          <span tw="text-neut-8">
            {dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        ),
      },
    }
  )

  const columnSettings = useMemo(
    () => ({
      columns: alertHistoryColumns,
      onSave: setColumnSettings as any,
      storageKey: alertHistorySettingKey,
    }),
    [setColumnSettings]
  )

  const { spaceId } = useParams<{ spaceId: string }>()
  const { data, isFetching } = useQueryListAlertLogs({
    uri: {
      space_id: spaceId,
    },
    params: filter as any,
  })

  const infos = get(data, 'infos', []) ?? []
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <PageTab tabs={alertHistoryTabs} />
      <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
        <TableHeader
          columnsSetting={columnSettings}
          queryKey={() => alertHistorySettingKey}
          suggestions={alertHistorySuggestions}
          filterInputConfig={{
            defaultKeywordLabel: '告警策略 ID',
            searchKey: 'alert_id',
          }}
        />
        <Table
          columns={columns}
          dataSource={infos}
          loading={!!isFetching}
          onSort={sort}
          pagination={{
            total: get(data, 'total', 0),
            ...pagination,
          }}
        />
      </FlexBox>
    </FlexBox>
  )
}
export default AlertHistory
