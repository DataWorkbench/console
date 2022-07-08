import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'

export const dataReleaseDetailActions = [
  {
    icon: 'q-subtractBoxFill',
    text: '下线',
    key: 'offline'
  },
  {
    icon: 'q-upload2Fill',
    text: '重新发布',
    key: 're-publish'
  }
]

export const ApiKeyDetailActions = [
  {
    icon: 'q-subtractBoxFill',
    text: '解绑',
    key: 'offline'
  }
]

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}

export const apiGroupTableFieldMapping: Mapping<
  'name' | 'api_count' | 'domain' | 'pre_path' | 'desc' | 'update_time'
> = new Map()
  .set('name', { label: 'API 服务组名称 / ID', apiField: 'name' })
  .set('api_count', { label: '已发布 API 数量', apiField: 'api_count' })
  .set('domain', { label: '域名', apiField: 'domain' })
  .set('pre_path', { label: '路径', apiField: 'pre_path' })
  .set('desc', { label: '描述', apiField: 'desc' })
  .set('update_time', { label: '最近更新时间', apiField: 'update_time' })

export const apiGroupTableColumns: IColumn[] = getField(apiGroupTableFieldMapping)

export const apiRoutersTableFieldMapping: Mapping<
  'name' | 'proxy_uri' | 'uri' | 'desc' | 'create_time'
> = new Map()
  .set('name', { label: 'API 名称 / ID', apiField: 'name' })
  .set('proxy_uri', { label: 'API 服务组', apiField: 'proxy_uri' })
  .set('uri', { label: '访问路径', apiField: 'uri' })
  .set('desc', { label: '描述', apiField: 'desc' })
  .set('create_time', { label: '发布时间', apiField: 'create_time' })

export const apiRouterTableColumns: IColumn[] = getField(apiRoutersTableFieldMapping)

export const authKeyTableFieldMapping: Mapping<'name' | 'secret_key' | 'create_time'> = new Map()
  .set('name', { label: '密钥名称', apiField: 'name' })
  .set('secret_key', { label: '密钥', apiField: 'secret_key' })
  .set('create_time', { label: '绑定时间', apiField: 'create_time' })

export const authKeyTableColumns: IColumn[] = getField(authKeyTableFieldMapping)

export const unbindApiTableFieldMapping: Mapping<'name' | 'domain' | 'desc'> = new Map()
  .set('name', { label: '服务组名称 / ID', apiField: 'name' })
  .set('domain', { label: '域名', apiField: 'domain' })
  .set('desc', { label: '描述', apiField: 'desc' })

export const unbindApiTableColumns: IColumn[] = getField(unbindApiTableFieldMapping)
