import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { StatusBarEnum } from 'components/StatusBar'
import { createEnhancedEnum } from 'utils'

interface EnhanceState {
  [key: string]: {
    label: string
    value: any
  }
}
interface IStatusEnum {
  [key: string]: {
    label: string
    value: any
    style: number
  }
}

function getField<T>(mapping: Mapping<T>): IColumn[] {
  return Array.from(mapping.values()).map((i) => ({
    title: i.label,
    dataIndex: i.apiField,
    key: i.apiField
  }))
}
export const StopClusterTableFieldMapping: Mapping<
  'name' | 'api_id' | 'api_path' | 'path' | 'desc'
> = new Map()
  .set('name', { label: 'APP名称 / ID', apiField: 'api_name' })
  .set('api_id', { label: '版本ID', apiField: 'api_id' })
  .set('api_path', { label: 'API服务组', apiField: 'group_id' })
  .set('path', { label: 'API访问路径', apiField: 'api_path' })
  .set('desc', { label: '描述', apiField: 'api_description' })

export const StopClusterTableColumns: IColumn[] = getField(StopClusterTableFieldMapping)

// eslint-disable-next-line import/prefer-default-export
export const ClusterFieldMapping: Mapping<'status' | 'name' | 'cu' | 'last_updated'> = new Map([
  ['name', { label: '名称/ID', apiField: 'name' }],
  ['status', { label: '状态', apiField: 'status' }],
  ['cu', { label: 'CU 规格', apiField: 'resource_spec' }],
  ['last_updated', { label: '最近更新时间', apiField: 'updated' }]
  // ['mode', { label: '计费模式', apiField: 'network_address_v1' }],
  // ['created_time', { label: '购买有效期', apiField: 'created' }],
])

// eslint-disable-next-line import/prefer-default-export
export const ClusterColumns: IColumn[] = getField(ClusterFieldMapping)

export const StatusEnum = createEnhancedEnum<IStatusEnum>({
  DELETED: {
    label: '已删除',
    value: 1,
    style: StatusBarEnum.gray
  },
  RUNNING: {
    label: '运行中',
    value: 2,
    style: StatusBarEnum.green
  },
  STOPPED: {
    label: '已停用',
    value: 3,
    style: StatusBarEnum.gray
  },
  STARTING: {
    label: '启动中',
    value: 4,
    style: StatusBarEnum.blue
  },
  EXCEPTION: {
    label: '异常',
    value: 5,
    style: StatusBarEnum.red
  },
  ARREARS: {
    label: '欠费',
    value: 6,
    style: StatusBarEnum.purple
  }
})

export const resourceSpecState = createEnhancedEnum<EnhanceState>({
  BASE: {
    label: '基础版',
    value: 1
  },
  CROSS: {
    label: '入门版',
    value: 2
  },
  VIP: {
    label: '专业版',
    value: 3
  }
})
