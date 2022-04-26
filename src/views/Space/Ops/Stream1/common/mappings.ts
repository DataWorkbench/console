import { Mapping } from 'utils/types'

export const streamReleaseFieldMapping: Mapping<
  | 'name'
  | 'status'
  | 'alarmStatus'
  | 'devMode'
  | 'versionId'
  | 'lastPublishTime'
> = new Map()
  .set('name', { label: '作业名称/ID', apiField: 'name' })
  .set('status', { label: '调度状态', apiField: 'status' })
  .set('alarmStatus', { label: '告警状态', apiField: 'alarmStatus' })
  .set('devMode', { label: '开发模式', apiField: 'type' })
  .set('versionId', { label: '版本 ID', apiField: 'version' })
  .set('lastPublishTime', {
    label: '最近发布时间',
    apiField: 'updated',
  })

export const streamInstanceFieldMapping: Mapping<
  | 'instanceId'
  | 'status'
  | 'alarmStatus'
  | 'job'
  | 'devMode'
  | 'createTime'
  | 'updateTime'
> = new Map()
  .set('instanceId', { label: '实例 ID', apiField: 'instanceId' })
  .set('status', { label: '状态', apiField: 'status' })
  .set('alarmStatus', { label: '告警状态', apiField: 'alarmStatus' })
  .set('job', { label: '所属作业', apiField: 'job' })
  .set('devMode', { label: '开发模式', apiField: 'devMode' })
  .set('createTime', { label: '创建时间', apiField: 'createTime' })
  .set('updateTime', { label: '更新时间', apiField: 'updateTime' })
