import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { StatusBarEnum } from 'components/StatusBar'
import { networkFieldMapping } from './mappings'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const networkColumns: IColumn[] = getField(networkFieldMapping)

export const networkStatusMap = new Map()
  .set('active', {
    label: '活跃',
    style: StatusBarEnum.green
  })
  .set('pending', {
    label: '进行中',
    style: StatusBarEnum.blue
  })
  .set('poweroffed', {
    label: '已关机',
    style: StatusBarEnum.red
  })
  .set('suspended', {
    label: '已挂起',
    style: StatusBarEnum.gray
  })
