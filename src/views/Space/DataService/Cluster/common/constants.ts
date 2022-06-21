import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { StatusBarEnum } from 'components/StatusBar'
import { ClusterFieldMapping } from './mappings'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

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
