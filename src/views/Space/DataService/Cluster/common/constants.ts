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

export const StatusMap = new Map()
  .set('error', {
    label: '异常',
    style: StatusBarEnum.red
  })
  .set('pending', {
    label: '启动中',
    style: StatusBarEnum.blue
  })
  .set('poweroffed', {
    label: '已停用',
    style: StatusBarEnum.gray
  })
  .set('suspended', {
    label: '欠费',
    style: StatusBarEnum.yellow
  })
