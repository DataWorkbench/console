import useIcon from 'hooks/useHooks/useIcon'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, InstanceName, TableHeader } from 'components'
import { Table } from 'views/Space/styled'
import { get } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import dayjs from 'dayjs'
import { MappingKey } from 'utils/types'
import { historyFiledMapping } from 'views/Space/Ops/Alert/common/mapping'

import { useHistory, useParams } from 'react-router-dom'
import useFilter from 'hooks/useHooks/useFilter'
import { useQueryListAlertLogs } from 'hooks/useAlert'
import MessageModal from 'views/Space/Ops/Stream/Release/MessageModal'
import { describeFlinkUI } from 'stores/api'
import icons from './common/icons'
import {
  alertHistoryColumns,
  alertHistorySuggestions,
  alertHistoryTabs,
  alertStatus,
  monitorObjectTypes
} from './common/constants'
import { ListStreamInstancesRequestType } from '../../../../types/request'
import { StreamJobInstanceManageListStreamInstancesType } from '../../../../types/response'
import { apiHooks } from '../../../../hooks/apiHooks'

const useQueryStreams = apiHooks<
  'streamJobInstanceManage',
  ListStreamInstancesRequestType,
  StreamJobInstanceManageListStreamInstancesType
>('streamJobInstanceManage', 'listStreamInstances')

// interface IAlertHistory {}

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
const AlertHistory = () => {
  // console.log(props)
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

  const history = useHistory()
  const [messageVisible, setMessageVisible] = useState(false)

  const [instanceId, setInstanceId] = useState('')
  const { columns, setColumnSettings } = useColumns(alertHistorySettingKey, alertHistoryColumns, {
    alert_id: {
      render: (text) => (
        <InstanceName
          theme="dark"
          name={text}
          css={instanceNameStyle}
          onClick={() => {
            history.push(`./alert-policy/${text}`)
          }}
        />
      )
    },
    [getName('job_id')]: {
      render: (id: string, record: Record<string, any>) => {
        const pathType = record.monitor_object === 1 ? 'release' : 'data-release'
        const path = `./${pathType}/${id}?version=${record.version}`
        return (
          <InstanceName
            theme="dark"
            name={id}
            onClick={() => {
              window.open(path, '_blank')
            }}
          />
        )
      }
    },
    [getName('instance_id')]: {
      render: (id: string, record: Record<string, any>) => {
        const path = `./data-job/${id}`
        return (
          <InstanceName
            theme="dark"
            name={id}
            onClick={() => {
              if (record.monitor_object === 2) {
                window.open(path, '_blank')
              } else {
                setInstanceId(id)
                setMessageVisible(true)
              }
            }}
          />
        )
      }
    },
    [getName('monitor_object')]: {
      ...getColumnFilter(getName('monitor_object'), monitorObjectTypes),
      render: (type: keyof typeof monitorObjectTypes) => monitorObjectTypes[type]?.label
    },
    [getName('event_type')]: {
      ...getColumnFilter(getName('event_type'), alertStatus),
      render: (type: keyof typeof alertStatus) => alertStatus[type]?.label
    },
    [getName('updated')]: {
      render: (v) => <span tw="text-neut-8">{dayjs(v * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
    }
  })

  const columnSettings = useMemo(
    () => ({
      columns: alertHistoryColumns,
      onSave: setColumnSettings as any,
      storageKey: alertHistorySettingKey
    }),
    [setColumnSettings]
  )

  const { regionId, spaceId } = useParams<{ spaceId: string; regionId: string }>()
  const { data, isFetching } = useQueryListAlertLogs({
    uri: {
      space_id: spaceId
    },
    params: filter as any
  })

  const { data: instanceData } = useQueryStreams(
    {
      uri: {
        space_id: spaceId
      },
      params: {
        instance_id: instanceId
      },
      regionId
    } as any,
    {
      enabled: !!instanceId
    }
  )

  const handleFinkUI = (row: any) => {
    if (row.state === 1) return
    describeFlinkUI({
      inst_id: row.id,
      regionId,
      spaceId
    }).then((res) => {
      const ele = document.createElement('a')
      ele.style.display = 'none'
      ele.target = '_blank'
      ele.href = `//${res?.web_ui || ''}`
      document.body.appendChild(ele)
      ele.click()
      document.body.removeChild(ele)
    })
  }

  const infos = get(data, 'infos', []) ?? []
  return (
    <>
      <FlexBox orient="column" tw="p-5 h-full">
        <PageTab tabs={alertHistoryTabs} />
        <FlexBox orient="column" tw="gap-3 p-5 bg-neut-16">
          <TableHeader
            columnsSetting={columnSettings}
            queryKey={() => alertHistorySettingKey}
            suggestions={alertHistorySuggestions}
            filterInputConfig={{
              defaultKeywordLabel: '告警策略 ID',
              searchKey: 'alert_id'
            }}
          />
          <Table
            columns={columns}
            dataSource={infos}
            loading={!!isFetching}
            onSort={sort}
            pagination={{
              total: get(data, 'total', 0),
              ...pagination
            }}
          />
        </FlexBox>
      </FlexBox>
      <MessageModal
        visible={messageVisible}
        row={instanceData?.infos?.[0]}
        cancel={() => setMessageVisible(false)}
        webUI={handleFinkUI}
      />
    </>
  )
}
export default AlertHistory
