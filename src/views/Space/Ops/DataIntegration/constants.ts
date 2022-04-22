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
  3: {
    label: '失败重试',
    value: 3,
    type: JobInstanceStatusType.FAILED_AND_RETRY,
  },
  2: { label: '运行中', value: 2, type: JobInstanceStatusType.RUNNING },
  1: { label: '准备资源', value: 1, type: JobInstanceStatusType.PREPARING },
  8: { label: '运行失败', value: 8, type: JobInstanceStatusType.FAILED },
  6: { label: '运行成功', value: 6, type: JobInstanceStatusType.SUCCEEDED },
  7: { label: '运行超时', value: 7, type: JobInstanceStatusType.TIMEOUT },
  5: { label: '已终止', value: 5, type: JobInstanceStatusType.FINISHED },
} as const

export enum AlarmStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
}

export const alarmStatus = {
  '0': { label: '正常', value: '0', type: AlarmStatus.NORMAL },
  '1': { label: '告警', value: '1', type: AlarmStatus.WARNING },
} as const

export enum JobType {
  REALTIME_UPDATE = 2 << 0,
  FULL_UPDATE = 2 << 1,
  INCREMENT_UPDATE = 2 << 2,
}

export const jobType = {
  1: { label: '全量更新', value: 1, type: JobType.FULL_UPDATE },
  2: { label: '增量更新', value: 2, type: JobType.INCREMENT_UPDATE },
  3: { label: '实时更新', value: 3, type: JobType.REALTIME_UPDATE },
} as const

export const dataJobInstanceSuggestions: ISuggestion[] = [
  {
    label: '状态',
    key: 'state',
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
    label: '作业 ID',
    key: 'job_id',
  },
]

export const dataJobInstanceColumns: IColumn[] = [
  {
    title: '实例 ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
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
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    key: 'created',
  },
  {
    title: '更新时间',
    dataIndex: 'updated',
    key: 'updated',
  },
]

export enum DataReleaseSchedule {
  RUNNING = 2 << 0,
  FINISHED = 2 << 1,
  DOWNED = 2 << 2,
}

export const dataReleaseScheduleType = {
  2: { label: '运行中', value: 2, type: DataReleaseSchedule.RUNNING },
  4: { label: '已完成', value: 4, type: DataReleaseSchedule.FINISHED },
  3: { label: '已下线', value: 3, type: DataReleaseSchedule.DOWNED },
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
    label: '作业名称',
    key: 'name',
  },
  {
    label: 'ID',
    key: 'ID',
  },
  {
    label: '调度状态',
    key: 'status',
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
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '调度状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '告警状态',
    dataIndex: 'alarm_status',
    key: 'alarm_status',
  },
  {
    title: '版本 ID',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: '开发模式',
    dataIndex: 'dev_mode',
    key: 'dev_mode',
  },
  {
    title: '作业类型',
    dataIndex: 'type',
    key: 'type',
    width: 130,
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
    dataIndex: `updated`,
    key: 'updated',
  },
]

const versionSet = new Set([
  'id',
  'status',
  'alarm_status',
  'version',
  'updated',
])

export const versionColumns = dataReleaseColumns.filter(
  (column) => column.key && versionSet.has(column!.key)
)

export const dataReleaseActions = [
  {
    icon: 'q-listViewFill',
    text: '关联实例',
    key: 'link',
  },
  {
    icon: 'q-terminalBoxFill',
    text: '开发内容',
    key: 'dev',
  },
  {
    icon: 'q-clusterFill',
    text: '计算集群',
    key: 'cluster',
  },
  {
    icon: 'q-bellGearFill',
    text: '监控告警',
    key: 'alarm',
  },
  {
    icon: 'q-topology2Fill',
    text: '调度信息',
    key: 'schedule',
  },
  {
    icon: 'q-subtractBoxFill',
    text: '下线',
    key: 'offline',
  },
  {
    icon: 'q-upload2Fill',
    text: '重新发布',
    key: 're-publish',
  },
] as const

export const dataReleaseDetailActions = [
  {
    icon: 'q-subtractBoxFill',
    text: '下线',
    key: 'offline',
  },
  {
    icon: 'q-upload2Fill',
    text: '重新发布',
    key: 're-publish',
  },
]

export type DataReleaseActionType = typeof dataReleaseActions[number]['key']

export const dataJobActions = [
  {
    text: '中止',
    icon: 'q-closeCircleFill',
    key: 'stop',
  },
  {
    text: '查看详情',
    icon: 'eye',
    key: 'info',
  },
] as const

export type DataJobActionType = typeof dataJobActions[number]['key']
