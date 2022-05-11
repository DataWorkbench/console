export type Mapping<T> = Map<T, { label: string; apiField: string }>

export const historyFiledMapping: Mapping<
  'alert_content' | 'alert_instance_id' | 'alert_time'
> = new Map([
  ['alert_content', { label: '告警内容', apiField: 'alert_content' }],
  [
    'alert_instance_id',
    {
      label: '告警实例 ID',
      apiField: 'alert_instance_id',
    },
  ],
  ['alert_time', { label: '告警时间', apiField: 'alert_time' }],
])

export const policyFieldMapping: Mapping<
  'id' | 'monitor_object' | 'description' | 'last_update_time'
> = new Map([
  ['id', { label: '名称/ID', apiField: 'id' }],
  ['monitor_object', { label: '监控对象', apiField: 'monitor_object' }],
  ['description', { label: '描述', apiField: 'description' }],
  [
    'last_update_time',
    {
      label: '最近更新时间',
      apiField: 'last_update_time',
    },
  ],
])

// const jobMap = {
//   '作业/文件夹名称': 'name',
//   'ID': 'ID',
//   '描述': 'description',
//   '更新时间': 'last_update_time',
// }
export const jobFieldMapping: Mapping<
  'name' | 'ID' | 'description' | 'last_update_time'
> = new Map()
  .set('name', { label: '作业/文件夹名称', apiField: 'name' })
  .set('ID', { label: 'ID', apiField: 'ID' })
  .set('description', { label: '描述', apiField: 'description' })
  .set('last_update_time', { label: '更新时间', apiField: 'last_update_time' })
