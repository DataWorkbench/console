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

export const serviceDevVersionFieldOrderMapping: Mapping<'index' | 'name' | 'order'> = new Map()
  .set('index', { label: '下标', apiField: 'index' })
  .set('name', { label: '字段名', apiField: 'name' })
  .set('order', { label: '排序方式', apiField: 'order' })

export const FieldOrderColumns: IColumn[] = getField(serviceDevVersionFieldOrderMapping)

export const serviceDevVersionFieldSettingMapping: Mapping<
  'field' | 'isRequest' | 'isResponse' | 'type'
> = new Map()
  .set('field', { label: '字段名', apiField: 'field' })
  .set('isRequest', { label: '设为请求参数', apiField: 'isRequest' })
  .set('isResponse', { label: '设为返回参数', apiField: 'isResponse' })
  .set('type', { label: '字段类型', apiField: 'type' })

export const FieldSettingColumns: IColumn[] = getField(serviceDevVersionFieldSettingMapping)

export const serviceDevRequestSettingMapping: Mapping<
  | 'param_name'
  | 'column_name'
  | 'data_type'
  | 'param_operator'
  | 'param_position'
  | 'is_required'
  | 'example_value'
  | 'default_value'
  | 'param_description'
> = new Map()
  .set('param_name', { label: '参数名称', apiField: 'param_name' })
  .set('column_name', { label: '绑定字段', apiField: 'column_name' })
  .set('data_type', { label: '参数字段', apiField: 'data_type' })
  .set('param_operator', { label: '操作符', apiField: 'param_operator' })
  .set('param_position', { label: '参数位置', apiField: 'param_position' })
  .set('is_required', { label: '必填', apiField: 'is_required' })
  .set('example_value', { label: '示例值', apiField: 'example_value' })
  .set('default_value', { label: '默认值', apiField: 'default_value' })
  .set('param_description', { label: '描述', apiField: 'param_description' })

export const RequestSettingColumns: IColumn[] = getField(serviceDevRequestSettingMapping)

export const serviceDevResponseSettingMapping: Mapping<
  'param_name' | 'column_name' | 'data_type' | 'example_value' | 'param_description'
> = new Map()
  .set('param_name', { label: '参数名称', apiField: 'param_name' })
  .set('column_name', { label: '绑定字段', apiField: 'column_name' })
  .set('data_type', { label: '参数字段', apiField: 'data_type' })
  .set('example_value', { label: '示例值', apiField: 'example_value' })
  .set('param_description', { label: '描述', apiField: 'param_description' })

export const ResponseSettingColumns: IColumn[] = getField(serviceDevResponseSettingMapping)
