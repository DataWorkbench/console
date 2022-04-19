import { IColumn } from 'hooks/useHooks/useColumns'
import { ITab } from 'utils/types'

export const alertHistoryTabs: ITab[] = [
  {
    title: '告警记录',
    description:
      '告警记录的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明告警策略的说明',
    icon: 'q-bellLightningDuotone',
    helpLink: '###',
  },
]

export const alertPolicyTabs: ITab[] = [
  {
    title: '告警策略',
    description: '告警策略说明',
    icon: 'q-bellGearDuotone',
    helpLink: '###',
  },
]

export const alertHistoryColumns: IColumn[] = [
  {
    title: '告警内容',
    dataIndex: 'alert-content',
    key: 'alert-content',
  },
  {
    title: '告警实例 ID',
    dataIndex: 'instance_id',
    key: 'instance_id',
  },
  {
    title: '告警时间',
    dataIndex: 'created_at',
    key: 'created_at',
  },
]

export const alertPolicyColumns: IColumn[] = [
  {
    title: '名称/ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '监控对象',
    dataIndex: 'alert_obj',
    key: 'alert_obj',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '最近更新时间',
    dataIndex: 'updated_at',
    key: 'updated_at',
  },
]
