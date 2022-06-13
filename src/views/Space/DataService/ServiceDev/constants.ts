import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const serviceDevVersionFieldMapping: Mapping<
  'apiName' | 'status' | 'versionId' | 'apiPath' | 'createTime'
> = new Map()
  .set('apiName', { label: 'API 名称', apiField: 'apiName' })
  .set('status', { label: '状态', apiField: 'status' })
  .set('versionId', { label: '版本 ID', apiField: 'versionId' })
  .set('apiPath', { label: 'API 路径', apiField: 'apiPath' })
  .set('createTime', { label: '发布时间', apiField: 'createTime' })

export const serviceDevVersionColumns: IColumn[] = getField(serviceDevVersionFieldMapping)
