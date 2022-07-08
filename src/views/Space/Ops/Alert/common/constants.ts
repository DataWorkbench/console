import { IColumn } from 'hooks/useHooks/useColumns'
import { getHelpCenterLink } from 'utils'
import { ITab } from 'utils/types'
import {
  historyFiledMapping,
  policyFieldMapping,
  Mapping,
  jobFieldMapping,
} from 'views/Space/Ops/Alert/common/mapping'
import { ISuggestion } from 'components/FilterInput'

export const alertHistoryTabs: ITab[] = [
  {
    title: '告警记录',
    description:
      '以告警日志方式提供告警历史记录信息，展示所有告警规则的执行与通知情况。',
    icon: 'q-bellLightningDuotone',
    helpLink: getHelpCenterLink(
      '/manual/operation_center/monitor/view_alerts/'
    ),
  },
]

export const alertPolicyTabs: ITab[] = [
  {
    title: '告警策略',
    description: '告警策略说明',
    icon: 'q-bellGearDuotone',
    helpLink: getHelpCenterLink(
      '/manual/operation_center/monitor/alert_rules/'
    ),
  },
]

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => {
    return {
      title: i.label,
      dataIndex: i.apiField,
      key: i.apiField,
    }
  })
}

export const alertHistoryColumns: IColumn[] = getField(historyFiledMapping)

export const alertPolicyColumns: IColumn[] = getField(policyFieldMapping)

export const jobColumns: IColumn[] = getField(jobFieldMapping)

//  1 => "StreamJob" 2 => "SyncJob'
export const monitorObjectTypes = {
  0: {
    label: '实时计算',
    value: 0,
    type: 0,
  },
  1: {
    label: '数据集成',
    value: 1,
    type: 1,
  },
}

// 1 => "StreamInstanceFailed" 2 => "StreamInstanceTimeout" 3 => "SyncInstanceFailed" 4 => "SyncInstanceTimeout"

export enum AlertType {
  StreamInstanceFailed = 1,
  StreamInstanceTimeout = 2,
  SyncInstanceFailed = 3,
  SyncInstanceTimeout = 4,
}
export const alertStatus = {
  1: {
    label: '实时计算运行失败',
    value: 1,
    type: AlertType.StreamInstanceFailed,
  },
  2: {
    label: '实时计算运行超时',
    value: 2,
    type: AlertType.StreamInstanceTimeout,
  },
  3: {
    label: '数据集成运行失败',
    value: 3,
    type: AlertType.SyncInstanceFailed,
  },
  4: {
    label: '数据集成运行超时',
    value: 4,
    type: AlertType.SyncInstanceTimeout,
  },
}

function getSuggestionOptions(types: Record<string | number, any>) {
  return Object.values(types)
    .filter((i) => !i.hidden)
    .map(({ label, value }) => ({
      label,
      key: value,
    }))
}

export const alertHistorySuggestions: ISuggestion[] = [
  {
    label: '告警策略 ID',
    key: 'alert_id',
  },
  {
    label: '作业 ID',
    key: 'job_id',
  },
  {
    label: '实例 ID',
    key: 'instance_id',
  },
  {
    label: '告警作业类型',
    key: 'monitor_object',
    options: getSuggestionOptions(monitorObjectTypes),
  },
  {
    label: '告警类型',
    options: getSuggestionOptions(alertStatus),
    key: 'event_type',
  },
]
