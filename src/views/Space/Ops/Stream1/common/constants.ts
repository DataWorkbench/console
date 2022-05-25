/* eslint-disable no-bitwise */
import { IColumn } from 'hooks/useHooks/useColumns'
import { ITab, Mapping } from 'utils/types'
import {
  streamInstanceFieldMapping,
  streamReleaseFieldMapping
} from 'views/Space/Ops/Stream1/common/mappings'
import { ISuggestion } from 'views/Space/Ops/DataIntegration/interfaces'
import { alarmStatus, jobInstanceStatus } from 'views/Space/Ops/DataIntegration/constants'
import { autoIncrementKey } from 'utils'

export {
  DataReleaseSchedule,
  dataReleaseScheduleType
} from 'views/Space/Ops/DataIntegration/constants'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const streamReleaseColumns = getField(streamReleaseFieldMapping)

export const streamInstanceColumns = getField(streamInstanceFieldMapping)

export const streamReleaseTabs: ITab[] = [
  {
    title: '流式计算-已发布作业',
    description:
      '具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定。',
    icon: 'q-eventDuotone',
    helpLink: '###'
  }
]

export const streamInstanceTabs: ITab[] = [
  {
    title: '流式计算-作业实例',
    description: '流式计算-作业实例',
    icon: 'q-eventDuotone',
    helpLink: '###'
  }
]

function getSuggestionOptions(types: Record<string | number, any>) {
  return Object.values(types)
    .filter((i) => !i.hidden)
    .map(({ label, value }) => ({
      label,
      key: value
    }))
}

export enum StreamDevMode {
  SQL = 2 << 0,
  JAR = 2 << 1,
  PYTHON = 2 << 2
}

export const streamDevModeType = {
  1: {
    label: 'SQL 模式',
    value: 1,
    type: StreamDevMode.SQL,
    icon: 'sql'
  },
  2: {
    label: '代码开发-Jar 模式',
    value: 2,
    type: StreamDevMode.JAR,
    icon: 'q-javaFill'
  },
  3: {
    label: '代码开发-python 模式',
    value: 3,
    type: StreamDevMode.PYTHON,
    icon: 'q-pythonFill'
  }
}

export enum StreamReleaseScheduleType {
  ACTIVE = 2 << autoIncrementKey.statusKey,
  SUSPENDED = 2 << autoIncrementKey.statusKey,
  DELETED = 2 << autoIncrementKey.statusKey,
  FINISHED = 2 << autoIncrementKey.statusKey
}

export const streamReleaseScheduleTypes = {
  1: {
    label: '调度中',
    value: 1,
    type: StreamReleaseScheduleType.ACTIVE
  },
  2: {
    label: '已暂停',
    value: 2,
    type: StreamReleaseScheduleType.SUSPENDED
  },
  3: {
    label: '已删除',
    value: 3,
    type: StreamReleaseScheduleType.DELETED,
    hidden: true
  },
  4: {
    label: '已完成',
    value: 4,
    type: StreamReleaseScheduleType.FINISHED
  }
}

export const streamReleaseSuggestions: ISuggestion[] = [
  {
    label: streamReleaseFieldMapping.get('name')!.label,
    key: streamReleaseFieldMapping.get('name')!.apiField
  },
  {
    label: '作业 ID',
    key: 'id'
  },
  {
    label: streamReleaseFieldMapping.get('status')!.label,
    key: streamReleaseFieldMapping.get('status')!.apiField,
    options: getSuggestionOptions(streamReleaseScheduleTypes)
  },
  {
    label: streamReleaseFieldMapping.get('alarmStatus')!.label,
    key: streamReleaseFieldMapping.get('alarmStatus')!.apiField,
    options: getSuggestionOptions(alarmStatus)
  },
  {
    label: streamReleaseFieldMapping.get('devMode')!.label,
    key: streamReleaseFieldMapping.get('devMode')!.apiField,
    options: getSuggestionOptions(streamDevModeType)
  }
]

export const streamInstanceSuggestions: ISuggestion[] = [
  {
    label: streamInstanceFieldMapping.get('instanceId')!.label,
    key: streamInstanceFieldMapping.get('instanceId')!.apiField
  },
  {
    label: streamInstanceFieldMapping.get('status')!.label,
    key: streamInstanceFieldMapping.get('status')!.apiField,
    options: getSuggestionOptions(jobInstanceStatus)
  },
  {
    label: streamInstanceFieldMapping.get('alarmStatus')!.label,
    key: streamInstanceFieldMapping.get('alarmStatus')!.apiField,
    options: getSuggestionOptions(alarmStatus)
  },
  {
    label: streamInstanceFieldMapping.get('devMode')!.label,
    key: streamInstanceFieldMapping.get('devMode')!.apiField,
    options: getSuggestionOptions(streamDevModeType)
  }
]
