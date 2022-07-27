import { IColumn } from 'hooks/useHooks/useColumns'
import { Mapping } from 'utils/types'
import { createEnhancedEnum } from 'utils'
import { DataServiceManageDescribeApiConfigType } from 'types/response'
import { get } from 'lodash-es'
import { StatusBarEnum } from 'components/StatusBar'

export interface Schema {
  type: string
  name: string
  is_primary: boolean
}

interface SchemaMap {
  param_name: string
  type: string
}

interface IPublishStatusEnum {
  [key: string]: {
    label: string
    value: any
    style: number
  }
}
interface IStatusEnum {
  [key: string]: {
    label: string
    value: any
  }
}

export interface FieldSettingData {
  key: string
  field: string
  isRequest: boolean
  isResponse: boolean
  type: string
  isPrimary: boolean
}

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
  .set('apiName', { label: 'API 名称', apiField: 'api_name' })
  .set('status', { label: '状态', apiField: 'publish_status' })
  .set('versionId', { label: '版本 ID', apiField: 'version_id' })
  .set('apiPath', { label: 'API 路径', apiField: 'api_path' })
  .set('createTime', { label: '发布时间', apiField: 'created' })

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
  | 'type'
  | 'param_operator'
  | 'param_position'
  | 'is_required'
  | 'example_value'
  | 'default_value'
  | 'param_description'
> = new Map()
  .set('param_name', { label: '参数名称', apiField: 'param_name' })
  .set('column_name', { label: '绑定字段', apiField: 'column_name' })
  .set('type', { label: '参数字段', apiField: 'type' })
  .set('param_operator', { label: '操作符', apiField: 'param_operator' })
  .set('param_position', { label: '参数位置', apiField: 'param_position' })
  .set('is_required', { label: '必填', apiField: 'is_required' })
  .set('example_value', { label: '示例值', apiField: 'example_value' })
  .set('default_value', { label: '默认值', apiField: 'default_value' })
  .set('param_description', { label: '描述', apiField: 'param_description' })

export const RequestSettingColumns: IColumn[] = getField(serviceDevRequestSettingMapping)

export const serviceDevResponseSettingMapping: Mapping<
  'param_name' | 'column_name' | 'type' | 'example_value' | 'param_description'
> = new Map()
  .set('param_name', { label: '参数名称', apiField: 'param_name' })
  .set('column_name', { label: '绑定字段', apiField: 'column_name' })
  .set('type', { label: '参数字段', apiField: 'type' })
  .set('example_value', { label: '示例值', apiField: 'example_value' })
  .set('param_description', { label: '描述', apiField: 'param_description' })

export const ResponseSettingColumns: IColumn[] = getField(serviceDevResponseSettingMapping)

export const dataSourceTypes: { [key in string]?: number } = {
  mysql: 1,
  // TIDB: 2,
  // Kafka: 3,
  // S3: 4,
  click_house: 5,
  // HBase: 6,
  // FTP: 7,
  // HDFS: 8,
  // sqlserver: 9,
  // Oracle: 10,
  postgresql: 2
  // DB2: 11,
  // 'SAP HANA': 12,
  // Hive: 13,
  // MongoDB: 15,
  // Redis: 16,
  // ElasticSearch: 14,
}

export const getFieldSettingParamsData: (schema: Schema[]) => FieldSettingData[] = (
  schema: Schema[]
) =>
  schema.map((column) => ({
    key: column.name,
    field: column.name,
    isRequest: false,
    isResponse: false,
    type: column.type,
    isPrimary: column.is_primary
  }))

export enum RequestMethods {
  MethodUnSet = 0,
  GET = 1,
  POST = 2
}

export enum ResponseMethods {
  TypeUnSet = 0,
  JSON = 1,
  XML = 2
}

export enum Protocol {
  ProtocolsUnSet = 0,
  HTTP = 1,
  HTTPS = 2,
  ALL = 3
}
export const ParameterOperator = createEnhancedEnum<IStatusEnum>({
  // OPERATORUNSET: {
  //   label: 'UNSET',
  //   value: 0
  // },
  EQUAL: {
    label: '=',
    value: 1
  },
  NOTEQUAL: {
    label: '!=',
    value: 2
  },
  GREATERTHEN: {
    label: '>',
    value: 3
  },
  GREATEREQUAL: {
    label: '>=',
    value: 4
  },
  LESSTHEN: {
    label: '<',
    value: 5
  },
  LESSEQUAL: {
    label: '<=',
    value: 6
  },
  // LIKE: {
  //   label: 'LIKE',
  //   value: 7
  // },
  // CONST: {
  //   label: 'CONST',
  //   value: 8
  // },
  IN: {
    label: 'IN',
    value: 9
  },
  NOTIN: {
    label: 'NOT IN',
    value: 10
  }
})

export const ParameterPosition = createEnhancedEnum<IStatusEnum>({
  // POSITIONUNSET: {
  //   label: 'UNSET',
  //   value: 0
  // },
  BODY: {
    label: 'BODY',
    value: 1
  },
  QUERY: {
    label: 'QUERY',
    value: 2
  },
  PATH: {
    label: 'PATH',
    value: 3
  },
  HEAD: {
    label: 'HEAD',
    value: 4
  }
})

export const OrderMode = createEnhancedEnum<IStatusEnum>({
  // ORDERMODEUNSET: {
  //   label: 'UNSET',
  //   value: 0
  // },
  ASE: {
    label: 'ASE',
    value: 1
  },
  DESC: {
    label: 'DESC',
    value: 2
  }
})

// 字段类型映射
const fieldTypeMapping: Map<string, number> = new Map()
  .set('char', 1)
  .set('vachar', 1)
  .set('int', 2)
  .set('number', 2)
  .set('double', 3)
  .set('boolean', 4)

export const paramsDataType: (type: string) => number | undefined = (type: string) => {
  const lowerType = type.toLocaleLowerCase()
  return fieldTypeMapping.get(lowerType)
}

/**
 * 请求参数配置 和 响应参数配置字段映射函数
 * @param filedData 字段数据
 * @param configData 配置数据
 * @param defaultData 默认数据
 * @returns
 */
export const configMapData = (filedData: SchemaMap[], configData: any[], defaultData: any) => {
  const configMap = new Map()
  configData?.forEach((item) => {
    configMap.set(item.column_name, item)
  })

  return filedData?.map((item) => {
    const configItem = configMap.get(item.param_name)
    const type = paramsDataType(item.type) || 1

    if (configItem) {
      return {
        ...item,
        data_type: type,
        ...configItem
      }
    }
    return { ...item, ...defaultData, data_type: type }
  })
}

export const FieldCategory = createEnhancedEnum<IStatusEnum>({
  // CATEGORYUNSET: {
  //   label: 'UNSET',
  //   value: 0
  // },
  PAGECONFIG: {
    label: 'pageConfig',
    value: 1
  },
  DATABASECOLUMN: {
    label: 'databaseColumn',
    value: 2
  }
})

/**
 * 根据请求参数和响应参数进行处理字段设置的请求和返回数据
 * @param apiConfig api配置
 * @param schema 数据源表字段
 * @returns
 */
export const configMapFieldData = (
  apiConfig: DataServiceManageDescribeApiConfigType | null,
  schema: Schema[]
) => {
  const requestConfig = get(apiConfig, 'api_config.request_params.request_params', [])
  const responseConfig = get(apiConfig, 'api_config.response_params.response_params', [])

  const requestMap = new Map()
  const responseMap = new Map()
  requestConfig?.forEach((item: { column_name: any }) => {
    requestMap.set(item.column_name, true)
  })
  responseConfig?.forEach((item: { column_name: any }) => {
    responseMap.set(item.column_name, true)
  })

  const fieldSettingData = getFieldSettingParamsData(schema)

  return fieldSettingData?.map((item) => {
    const isRequest = requestMap.get(item.field)
    const isResponse = responseMap.get(item.field)

    return {
      ...item,
      isRequest: !!isRequest,
      isResponse: !!isResponse
    }
  })
}

export const orderMapRequestData = (orderSourceData: any[], responseData: any[]) => {
  const orderMap = new Map()
  const orderData = orderSourceData?.map((item, index) => ({
    ...item,
    order_num: index + 1
  }))

  orderData?.forEach((item: any) => {
    orderMap.set(item.name, item)
  })

  return responseData?.map((item: any) => {
    const orderItem = orderMap.get(item.column_name)
    return {
      ...item,
      ...orderItem
    }
  })
}

export const publishStatus = createEnhancedEnum<IPublishStatusEnum>({
  // UNSET: {
  //   label: 'UNSET',
  //   value: 0,
  //   style: StatusBarEnum.gray
  // },
  PUBLISHED: {
    label: '已发布',
    value: 1,
    style: StatusBarEnum.green
  },
  ABOLISHED: {
    label: '已下线',
    value: 2,
    style: StatusBarEnum.gray
  }
})
