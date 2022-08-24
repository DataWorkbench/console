export type Mapping<T> = Map<T, { label: string; apiField: string }>

// const historyFiledMapping = {
//   '告警策略 ID': 'alert_id',
//   '作业 ID': 'job_id',
//   '实例 ID': 'instance_id',
//   '告警作业类型': 'monitor_object',
//   '告警类型': 'event_type',
//   '告警时间': 'updated',
// }
export const historyFiledMapping: Mapping<
  'alert_id' | 'job_id' | 'instance_id' | 'monitor_object' | 'event_type' | 'updated'
> = new Map()
  .set('alert_id', { label: '告警策略 ID', apiField: 'alert_id' })
  .set('job_id', { label: '作业 ID', apiField: 'job_id' })
  .set('instance_id', { label: '实例 ID', apiField: 'instance_id' })
  .set('monitor_object', { label: '告警作业类型', apiField: 'monitor_object' })
  .set('event_type', { label: '告警类型', apiField: 'event_type' })
  .set('updated', { label: '告警时间', apiField: 'updated' })

export const policyFieldMapping: Mapping<'id' | 'monitor_object' | 'desc' | 'updated'> = new Map([
  ['id', { label: '名称/ID', apiField: 'id' }],
  ['monitor_object', { label: '监控对象', apiField: 'monitor_object' }],
  ['desc', { label: '描述', apiField: 'desc' }],
  [
    'updated',
    {
      label: '最近更新时间',
      apiField: 'updated'
    }
  ]
])

// const jobMap = {
//   '作业/文件夹名称': 'name',
//   'ID': 'ID',
//   '描述': 'description',
//   '更新时间': 'last_update_time',
// }
export const jobFieldMapping: Mapping<'name' | 'ID' | 'description' | 'last_update_time'> =
  new Map()
    .set('name', { label: '作业/文件夹名称', apiField: 'name' })
    .set('ID', { label: 'ID', apiField: 'id' })
    .set('description', { label: '描述', apiField: 'desc' })
    .set('last_update_time', { label: '更新时间', apiField: 'updated' })
