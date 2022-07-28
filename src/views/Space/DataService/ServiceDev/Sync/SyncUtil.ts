import { DataServiceManageDescribeApiConfigType } from 'types/response'
import { get } from 'lodash-es'
import { FieldCategory, ParameterOperator, ParameterPosition } from '../constants'

export interface Schema {
  type: string
  name: string
  is_primary: boolean
}

export interface FieldSettingData {
  key: string
  field: string
  isRequest: boolean
  isResponse: boolean
  type: string
  isPrimary: boolean
}

interface SchemaMap {
  param_name: string
  type: string
}

const defaultRequestHighSource = [
  {
    column_name: 'limit',
    param_name: 'limit',
    data_type: 1,
    type: 'INT',
    param_operator: ParameterOperator.EQUAL,
    param_position: ParameterPosition.QUERY,
    is_required: true,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '200',
    default_value: '200',
    param_description: '单次请求返回数据的最大条数,最大值200'
  },
  {
    column_name: 'offset',
    param_name: 'offset',
    data_type: 1,
    type: 'INT',
    param_operator: ParameterOperator.EQUAL,
    param_position: ParameterPosition.QUERY,
    is_required: true,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '0',
    default_value: '0',
    param_description: '数据的偏移量'
  }
]

const defaultResponseHighSource = [
  {
    param_name: 'total',
    column_name: 'total',
    type: 'INT',
    data_type: 1,
    is_required: false,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '245',
    default_value: '245',
    param_description: '数据总数'
  },
  {
    param_name: 'limit',
    column_name: 'limit',
    type: 'INT',
    data_type: 1,
    is_required: false,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '100',
    default_value: '100',
    param_description: '单次请求返回数据的最大条数,最大值100'
  },
  {
    param_name: 'offset',
    column_name: 'offset',
    type: 'INT',
    data_type: 1,
    is_required: false,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '200',
    default_value: '200',
    param_description: '数据的偏移量'
  },
  {
    param_name: 'next_offset',
    column_name: 'next_offset',
    type: 'INT',
    data_type: 1,
    is_required: false,
    field_category: FieldCategory.PAGECONFIG,
    example_value: '0',
    default_value: '0',
    param_description: '作为下次请求的 offset 值, 0 表示遍历结束'
  }
]

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

/**
 *
 * @param filedData 字段数据
 * @param configData 默认配置数据
 * @returns
 */
export const fieldDataToResponseData = (filedData: SchemaMap[], configData: any[]) => {
  const hightConfig = configData?.filter((item: any) =>
    ['total', 'limit', 'offset', 'next_offset'].includes(item.column_name)
  )
  let hConfig = []
  if (hightConfig?.length) {
    hConfig = hightConfig.map((item: any) => ({ ...item, type: 'INT' }))
  } else {
    hConfig = defaultResponseHighSource
  }

  if (filedData) {
    // 拼数据
    const defaultValue = {
      data_type: 1, // 字段类型 映射函数configMapData中赋值
      param_operator: ParameterOperator.EQUAL,
      param_position: ParameterPosition.QUERY,
      is_required: false,
      example_value: '',
      default_value: '',
      param_description: '',
      field_category: FieldCategory.DATABASECOLUMN
    }
    const newRequestData = configMapData(filedData, configData, defaultValue)

    return [...newRequestData, ...hConfig]
  }
  return hConfig
}

/**
 *
 * @param filedData 字段数据
 * @param configData 默认配置数据
 * @returns
 */
export const fieldDataToRequestData = (filedData: SchemaMap[], configData: any[]) => {
  const hightConfig = configData?.filter((item: any) =>
    ['limit', 'offset'].includes(item.column_name)
  )
  let hConfig = []
  if (hightConfig?.length) {
    hConfig = hightConfig.map((item: any) => ({ ...item, type: 'INT' }))
  } else {
    hConfig = defaultRequestHighSource
  }

  if (filedData) {
    // 拼数据
    const defaultValue = {
      data_type: 1, // 字段类型 映射函数configMapData中赋值
      param_operator: ParameterOperator.EQUAL,
      param_position: ParameterPosition.QUERY,
      is_required: false,
      example_value: '',
      default_value: '',
      param_description: '',
      field_category: FieldCategory.DATABASECOLUMN
    }
    const newRequestData = configMapData(filedData, configData, defaultValue)
    return [...newRequestData, ...hConfig]
  }
  return hConfig
}
