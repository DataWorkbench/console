import { IColumn } from 'hooks/utils'
import { getHelpCenterLink } from 'utils/index'

interface ITab {
  title: string
  description: string
  icon: string
  helpLink: string
}
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
    icon: 'instance',
    helpLink: getHelpCenterLink('data-job-instance'),
  },
]

export enum JobStatusType {
  FAILED_AND_RETRY,
  RUNNING,
  PREPARING,
  FAILED,
  TIMEOUT,
  FINISHED,
  SUCCEEDED,
}
export const jobStatus = {
  '0': { label: '失败重试', value: '0', type: JobStatusType.FAILED_AND_RETRY },
  '1': { label: '运行中', value: '1', type: JobStatusType.RUNNING },
  '2': { label: '准备资源', value: '2', type: JobStatusType.PREPARING },
  '3': { label: '运行失败', value: '3', type: JobStatusType.FAILED },
  '4': { label: '运行成功', value: '4', type: JobStatusType.SUCCEEDED },
  '5': { label: '运行超时', value: '5', type: JobStatusType.TIMEOUT },
  '6': { label: '已终止', value: '6', type: JobStatusType.FINISHED },
} as const

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
