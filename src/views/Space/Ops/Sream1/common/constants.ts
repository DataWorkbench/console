/* eslint-disable no-bitwise */
import { IColumn } from 'hooks/useHooks/useColumns'
import { ITab, Mapping } from 'utils/types'
import {
  streamInstanceFieldMapping,
  streamReleaseFieldMapping,
} from 'views/Space/Ops/Sream1/common/mappings'
import { ISuggestion } from 'views/Space/Ops/DataIntegration/interfaces'
import {
  alarmStatus,
  dataReleaseScheduleType,
  jobInstanceStatus,
} from 'views/Space/Ops/DataIntegration/constants'

export {
  DataReleaseSchedule,
  dataReleaseScheduleType,
} from 'views/Space/Ops/DataIntegration/constants'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => {
    return {
      title: i.label,
      dataIndex: i.apiField,
      key: i.apiField,
    }
  })
}

export const streamReleaseColumns = getField(streamReleaseFieldMapping)

export const streamInstanceColumns = getField(streamInstanceFieldMapping)

export const streamReleaseTabs: ITab[] = [
  {
    title: '流式计算-已发布作业',
    description:
      '具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定具体说明内容待定。',
    icon: 'q-bellLightningDuotone',
    helpLink: '###',
  },
]

export const streamInstanceTabs: ITab[] = [
  {
    title: '流式计算-作业实例',
    description: '流式计算-作业实例',
    icon: 'q-eventDuoton',
    helpLink: '###',
  },
]

function getSuggestionOptions(types: Record<string | number, any>) {
  return Object.values(types).map(({ label, value }) => ({
    label,
    key: value,
  }))
}

export enum StreamDevMode {
  SQL = 2 << 0,
  JAR = 2 << 1,
  PYTHON = 2 << 2,
}

export const streamDevModeType = {
  1: {
    label: 'SQL 模式',
    value: 1,
    type: StreamDevMode.SQL,
  },
  2: {
    label: 'Jar 模式',
    value: 2,
    type: StreamDevMode.JAR,
  },
  3: {
    label: 'python 模式',
    value: 3,
    type: StreamDevMode.PYTHON,
  },
}

export const streamReleaseSuggestions: ISuggestion[] = [
  {
    label: streamReleaseFieldMapping.get('name')!.label,
    key: streamReleaseFieldMapping.get('name')!.apiField,
  },
  {
    label: '作业 ID',
    key: 'id',
  },
  {
    label: streamReleaseFieldMapping.get('status')!.label,
    key: streamReleaseFieldMapping.get('status')!.apiField,
    options: getSuggestionOptions(dataReleaseScheduleType),
  },
  {
    label: streamReleaseFieldMapping.get('alarmStatus')!.label,
    key: streamReleaseFieldMapping.get('alarmStatus')!.apiField,
    options: getSuggestionOptions(alarmStatus),
  },
  {
    label: streamReleaseFieldMapping.get('devMode')!.label,
    key: streamReleaseFieldMapping.get('devMode')!.apiField,
    options: getSuggestionOptions(streamDevModeType),
  },
]

export const streamInstanceSuggestions: ISuggestion[] = [
  {
    label: streamInstanceFieldMapping.get('instanceId')!.label,
    key: streamInstanceFieldMapping.get('instanceId')!.apiField,
  },
  {
    label: streamInstanceFieldMapping.get('status')!.label,
    key: streamInstanceFieldMapping.get('status')!.apiField,
    options: getSuggestionOptions(jobInstanceStatus),
  },
  {
    label: streamInstanceFieldMapping.get('alarmStatus')!.label,
    key: streamInstanceFieldMapping.get('alarmStatus')!.apiField,
    options: getSuggestionOptions(alarmStatus),
  },
  {
    label: streamInstanceFieldMapping.get('devMode')!.label,
    key: streamInstanceFieldMapping.get('devMode')!.apiField,
    options: getSuggestionOptions(streamDevModeType),
  },
]
