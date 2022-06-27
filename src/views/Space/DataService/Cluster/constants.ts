import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { StatusBarEnum } from 'components/StatusBar'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}
export const StopClusterTableFieldMapping: Mapping<'name' | 'domain' | 'desc'> = new Map()
  .set('name', { label: '服务组名称 / ID', apiField: 'name' })
  .set('domain', { label: '域名', apiField: 'domain' })
  .set('desc', { label: '描述', apiField: 'desc' })

export const StopClusterTableColumns: IColumn[] = getField(StopClusterTableFieldMapping)

// eslint-disable-next-line import/prefer-default-export
export const ClusterFieldMapping: Mapping<'status' | 'name' | 'cu' | 'last_updated'> = new Map([
  ['name', { label: '名称/ID', apiField: 'name' }],
  ['status', { label: '状态', apiField: 'status' }],
  ['cu', { label: 'CU 规格', apiField: 'network_address' }],
  ['last_updated', { label: '最近更新时间', apiField: 'updated' }]
  // ['mode', { label: '计费模式', apiField: 'network_address_v1' }],
  // ['created_time', { label: '购买有效期', apiField: 'created' }],
])

// eslint-disable-next-line import/prefer-default-export
export const ClusterColumns: IColumn[] = getField(ClusterFieldMapping)

export const getStatusNumber = new Map()
  .set(1, 'error')
  .set(2, 'pending')
  .set(3, 'stop')
  .set(4, 'arrearage')

export const StatusMap = new Map()
  .set('error', {
    label: '异常',
    style: StatusBarEnum.red
  })
  .set('pending', {
    label: '启动中',
    style: StatusBarEnum.green
  })
  .set('stop', {
    label: '已停用',
    style: StatusBarEnum.gray
  })
  .set('arrearage', {
    label: '欠费',
    style: StatusBarEnum.purple
  })
