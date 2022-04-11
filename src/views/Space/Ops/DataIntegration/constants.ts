/* eslint-disable no-bitwise */
import { IColumn } from 'hooks/useHooks/useColumns'
import { getHelpCenterLink } from 'utils/index'
import { ISuggestion, ITab } from './interfaces'

export const dataJobReleaseTab: ITab[] = [
  {
    title: 'Release',
    description: 'Release data job',
    icon: 'release',
    helpLink: getHelpCenterLink('data-job-release'),
  },
]

export const dataJobInstanceTab: ITab[] = [
  {
    title: '数据集成-作业实例',
    description: 'Instance data job',
    icon: 'q-mergeFillDuotone',
    helpLink: getHelpCenterLink('data-job-instance'),
  },
]

export enum JobInstanceStatusType {
  FAILED_AND_RETRY = 2 << 0,
  RUNNING = 2 << 1,
  PREPARING = 2 << 2,
  FAILED = 2 << 3,
  SUCCEEDED = 2 << 4,
  TIMEOUT = 2 << 5,
  FINISHED = 2 << 6,
}

export const jobInstanceStatus = {
  '0': {
    label: '失败重试',
    value: '0',
    type: JobInstanceStatusType.FAILED_AND_RETRY,
  },
  '1': { label: '运行中', value: '1', type: JobInstanceStatusType.RUNNING },
  '2': { label: '准备资源', value: '2', type: JobInstanceStatusType.PREPARING },
  '3': { label: '运行失败', value: '3', type: JobInstanceStatusType.FAILED },
  '4': { label: '运行成功', value: '4', type: JobInstanceStatusType.SUCCEEDED },
  '5': { label: '运行超时', value: '5', type: JobInstanceStatusType.TIMEOUT },
  '6': { label: '已终止', value: '6', type: JobInstanceStatusType.FINISHED },
} as const

export enum AlarmStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
}

export const alarmStatus = {
  '0': { label: '正常', value: '0', type: AlarmStatus.NORMAL },
  '1': { label: '警告', value: '1', type: AlarmStatus.WARNING },
} as const

export enum JobType {
  REALTIME_UPDATE = 2 << 0,
  FULL_UPDATE = 2 << 1,
  INCREMENT_UPDATE = 2 << 2,
}

export const jobType = {
  '0': { label: '全量更新', value: '0', type: JobType.FULL_UPDATE },
  '1': { label: '增量更新', value: '1', type: JobType.INCREMENT_UPDATE },
  '2': { label: '实时更新', value: '2', type: JobType.REALTIME_UPDATE },
} as const

export const dataJobInstanceSuggestions: ISuggestion[] = [
  {
    label: '状态',
    key: 'status',
    options: Object.values(jobInstanceStatus).map(({ label, value }) => ({
      label,
      key: value,
    })),
  },
  {
    label: '告警状态',
    key: 'alarm_status',
    options: Object.values(alarmStatus).map(({ label, value }) => ({
      label,
      key: value,
    })),
  },
  {
    label: '作业名称',
    key: 'job_name',
  },
  {
    label: '实例 ID',
    key: 'instance_id',
  },
]

export const dataJobInstanceColumns: IColumn[] = [
  {
    title: '实例 ID',
    dataIndex: 'instance_id',
    key: 'instance_id',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '告警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
  },
  {
    title: '所属作业',
    dataIndex: 'job_id',
    key: 'job_id',
  },
  {
    title: '作业类型',
    dataIndex: 'job_type',
    key: 'job_type',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
  },
]
