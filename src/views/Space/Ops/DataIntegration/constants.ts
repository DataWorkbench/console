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

export enum DataReleaseSchedule {
  RUNNING = 2 << 0,
  FINISHED = 2 << 1,
  DOWNED = 2 << 2,
}

export const dataReleaseScheduleType = {
  '0': { label: '运行中', value: '0', type: DataReleaseSchedule.RUNNING },
  '1': { label: '已完成', value: '1', type: DataReleaseSchedule.FINISHED },
  '2': { label: '已下线', value: '2', type: DataReleaseSchedule.DOWNED },
} as const

export enum DataReleaseDevMode {
  UI = 2 << 0,
  SCRIPT = 2 << 1,
}

export const dataReleaseDevModeType = {
  '0': { label: '向导模式', value: '0', type: DataReleaseDevMode.UI },
  '1': { label: '脚本模式', value: '1', type: DataReleaseDevMode.SCRIPT },
} as const

export const sourceTypes = {
  MySQL: 'MySQL',
  PostgreSQL: 'PostgreSQL',
  TiDB: 'TiDB',
  Oracle: 'Oracle',
  SqlServer: 'SqlServer',
  DB2: 'DB2',
  SapHana: 'SPA HANA',
  ClickHouse: 'ClickHouse',
  Hive: 'Hive',
  Ftp: 'FTP',
  HDFS: 'HDFS',
  HBase: 'HBase',
  ElasticSearch: 'ElasticSearch',
  Redis: 'Redis',
  MongoDb: 'MongoDB',
  Kafka: 'Kafka',
}

export const dataReleaseSuggestions: ISuggestion[] = [
  {
    label: '调度状态',
    key: 'schedule_status',
    options: Object.values(dataReleaseScheduleType).map(({ label, value }) => ({
      label,
      key: value,
    })),
  },
  {
    label: '开发模式',
    key: 'dev_mode',
    options: Object.values(dataReleaseDevModeType).map(({ label, value }) => ({
      label,
      key: value,
    })),
  },
  {
    label: '来源',
    key: 'source',
    options: Object.entries(sourceTypes).map(([key, value]) => ({
      label: value,
      key,
    })),
  },
  {
    label: '目的',
    key: 'target',
    options: Object.entries(sourceTypes).map(([key, value]) => ({
      label: value,
      key,
    })),
  },
]
export const dataReleaseTabs: ITab[] = [
  {
    title: '数据集成-已发布作业',
    description: 'Release data job',
    icon: 'equalizer',
    helpLink: getHelpCenterLink('data-job-release'),
  },
]

export const dataReleaseColumns: IColumn[] = [
  {
    title: '作业名称/ID',
    dataIndex: 'job_name',
    key: 'job_name',
  },
  {
    title: '调度状态',
    dataIndex: 'schedule_status',
    key: 'schedule_status',
  },
  {
    title: '告警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
  },
  {
    title: '版本 ID',
    dataIndex: 'version_id',
    key: 'version_id',
  },
  {
    title: '开发模式',
    dataIndex: 'dev_mode',
    key: 'dev_mode',
  },
  {
    title: '作业类型',
    dataIndex: 'job_type',
    key: 'job_type',
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: '目的',
    dataIndex: 'target',
    key: 'target',
  },
  {
    title: '最近发布时间',
    dataIndex: `created_at`,
    key: 'created_at',
  },
]

const versionSet = new Set([
  'job_name',
  'schedule_status',
  'alarm_status',
  'version_id',
  'created_at',
])

export const versionColumns = dataReleaseColumns.filter(
  (column) => column.key && versionSet.has(column!.key)
)
