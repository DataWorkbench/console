import { IColumn } from 'hooks/useHooks/useColumns'
import { getHelpCenterLink } from 'utils'
import { ITab } from 'utils/types'
import {
  historyFiledMapping,
  policyFieldMapping,
  Mapping,
  jobFieldMapping
} from 'views/Space/Ops/Alert/common/mapping'

export const alertHistoryTabs: ITab[] = [
  {
    title: '告警记录',
    description:
      '告警记录的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明',
    icon: 'q-bellLightningDuotone',
    helpLink: getHelpCenterLink('/manual/operation_center/monitor/view_alerts/')
  }
]

export const alertPolicyTabs: ITab[] = [
  {
    title: '告警策略',
    description: '告警策略说明',
    icon: 'q-bellGearDuotone',
    helpLink: getHelpCenterLink('/manual/operation_center/monitor/alert_rules/')
  }
]

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
      title: i.label,
      dataIndex: i.apiField,
      key: i.apiField
    }))
}

export const alertHistoryColumns: IColumn[] = getField(historyFiledMapping)

export const alertPolicyColumns: IColumn[] = getField(policyFieldMapping)

export const jobColumns: IColumn[] = getField(jobFieldMapping)
