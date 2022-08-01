import { observer } from 'mobx-react-lite'
import { useImmer } from 'use-immer'
import {
  useQueryDescribeDataSourceTables,
  useQueryDescribeDataSourceTableSchema,
  useQueryDescribeServiceDataSourceKinds
} from 'hooks'
import { Form, Icon } from '@QCFE/lego-ui'
import {
  AffixLabel,
  Center,
  ButtonWithClearField,
  PopConfirm,
  SelectWithRefresh,
  HelpCenterLink
} from 'components'
import { useState, useMemo, useEffect, useImperativeHandle } from 'react'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { cloneDeep, findKey, get, isEmpty, pick } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import { dataSourceTypes } from '../constants'
import { configMapFieldData } from './SyncUtil'
import { tableSelectStyled, FormWrapper } from '../styled'

type SourceDataType = { id: string; name: string; networkId?: string } | null
interface IRouteParams {
  regionId: string
  spaceId: string
}

export interface ISourceData {
  type: number
  tableName: string
  source: SourceDataType
}

interface ISyncDataSourceProps {
  disabled?: boolean
}

const { SelectField } = Form

const SyncDataSource = observer(
  (props: ISyncDataSourceProps, ref) => {
    const { disabled = false } = props
    const [visible, setVisible] = useState<boolean | null>(null)
    const { spaceId } = useParams<IRouteParams>()
    const [sourceData, setSourceData] = useImmer<ISourceData>({
      type: 0,
      source: null,
      tableName: ''
    })

    const {
      dtsDevStore,
      dtsDevStore: { setSchemaColumns, apiConfigData, oldApiTableNam }
    } = useStore()

    const paramsTable = { uri: { space_id: spaceId, source_id: sourceData.source?.id || '' } }
    const tablesRet = useQueryDescribeDataSourceTables(paramsTable, {
      enabled: !!sourceData.source?.id
    })

    const { data: kindsData } = useQueryDescribeServiceDataSourceKinds({
      uri: { space_id: spaceId }
    })

    const paramsTableSchema = {
      uri: {
        space_id: spaceId,
        source_id: sourceData.source?.id || '',
        table_name: sourceData.tableName
      }
    }
    const TableSchema = useQueryDescribeDataSourceTableSchema(paramsTableSchema, {
      enabled: !!sourceData.source?.id && !!sourceData.tableName
    })

    // 重新设置 schema 字段
    useEffect(() => {
      const columns = get(TableSchema.data, 'schema', [])
      const configTableName = get(apiConfigData, 'api_config.table_name', '')
      if (!columns) return
      const columnsData = configMapFieldData(
        cloneDeep(apiConfigData),
        columns,
        configTableName === oldApiTableNam
      )

      setSchemaColumns(columnsData)
    }, [TableSchema.data, apiConfigData, oldApiTableNam, setSchemaColumns])

    // 启动后回显数据
    useEffect(() => {
      if (apiConfigData) {
        const data = cloneDeep(get(apiConfigData, 'data_source'))
        const apiConfig = cloneDeep(get(apiConfigData, 'api_config'))
        if (!data) return
        setSourceData((draft) => {
          draft.type = get(data, 'type', 0)
          draft.tableName = get(apiConfig, 'table_name', '')
          draft.source = { id: get(data, 'id', ''), name: get(data, 'name', '') }
        })
      }
    }, [apiConfigData, setSourceData])

    const dataSourceOption = useMemo(
      () =>
        kindsData?.kinds.map(({ type, name }: { type: number; name: string }) => ({
          value: type,
          label: name
        })),
      [kindsData?.kinds]
    )

    const tables = useMemo(() => {
      const da = get(tablesRet.data, 'items', [])
      const option = da.map((tabName) => ({
        label: tabName,
        value: tabName
      }))
      return option
    }, [tablesRet.data])

    const handleClick = () => {
      setVisible(true)
    }

    const clearSchemaColumns = () => {
      setSchemaColumns([])
    }

    const handleClear = () => {
      setSourceData((draft) => {
        draft.source = null
        draft.tableName = ''
      })
      clearSchemaColumns()
    }

    const handleSelectDb = (data: SourceDataType) => {
      setSourceData((draft) => {
        draft.source = data
      })
    }

    // 同步数据源到mobx
    const handleSync = (tableName: string) => {
      const config = {
        ...cloneDeep(apiConfigData),
        api_config: {
          ...cloneDeep(apiConfigData?.api_config),
          table_name: tableName
        },
        data_source: {
          id: sourceData.source?.id,
          name: sourceData.source?.name,
          type: sourceData.type
        }
      }

      dtsDevStore.set({
        apiConfigData: config
      })
    }

    useImperativeHandle(ref, () => ({
      getDataSource: () => sourceData
    }))

    return (
      <FormWrapper tw="flex-col">
        <Form ref={ref} tw="px-0">
          <SelectField
            label={<AffixLabel>数据源类型</AffixLabel>}
            name="sourceType"
            placeHolder="请选择数据源类型"
            backspaceRemoves={false}
            value={sourceData.type}
            options={dataSourceOption}
            schemas={[
              {
                help: '请选择数据源类型',
                status: 'error',
                rule: { required: true }
              }
            ]}
            validateOnChange
            disabled={disabled}
            onChange={(v: number) => {
              setSourceData((draft) => {
                draft.type = v
                draft.source = null
                draft.tableName = ''
              })
              clearSchemaColumns()
            }}
          />
          {sourceData.type !== 0 && (
            <ButtonWithClearField
              name="source"
              placeholder="选择数据来源"
              label={<AffixLabel>数据源</AffixLabel>}
              popConfirm={
                <PopConfirm
                  type="warning"
                  content="移除数据源会清空所数据源表、条件参数配置、字段映射等所有信息，请确认是否移除？"
                />
              }
              icon={
                <Icon name="blockchain" size={16} color={{ secondary: 'rgba(255,255,255,0.4)' }} />
              }
              onClick={() => handleClick()}
              disabled={disabled}
              onClear={() => handleClear()}
              value={sourceData.source?.id}
              clearable={!isEmpty(sourceData.source)}
            >
              <Center tw="space-x-1">
                <span tw="ml-1">{sourceData.source?.name}</span>
                <span tw="text-neut-8">(ID:{sourceData.source?.id})</span>
              </Center>
            </ButtonWithClearField>
          )}
          {!isEmpty(sourceData.source?.id) && (
            <SelectWithRefresh
              name="table"
              label={<AffixLabel>数据源表</AffixLabel>}
              options={tables}
              isLoading={tablesRet.isFetching}
              clearable={false}
              onRefresh={() => {
                tablesRet.refetch()
              }}
              disabled={disabled}
              onChange={(v: string) => {
                setSourceData((draft) => {
                  draft.tableName = v
                })
                handleSync(v)
              }}
              css={tableSelectStyled}
              validateOnChange
              value={sourceData.tableName}
              {...(!!tables.length && !!tablesRet.isFetching
                ? {
                    validateStatus: 'error',
                    validateHelp: (
                      <div>
                        当前数据源不可用，请前往{' '}
                        <HelpCenterLink
                          hasIcon
                          isIframe={false}
                          href="/manual/source_data/add_data/"
                        >
                          数据源管理
                        </HelpCenterLink>{' '}
                        页面配置
                      </div>
                    ) as any
                  }
                : {})}
              schemas={[
                {
                  help: '请选择数据源表',
                  status: 'error',
                  rule: (v?: string) => !!v
                }
              ]}
            />
          )}
        </Form>
        <DataSourceSelectModal
          selected={[sourceData.source?.id]}
          title={`选择数据源（已选类型为 ${findKey(
            dataSourceTypes,
            (v) => v === +get(sourceData, 'type')
          )})`}
          visible={visible}
          sourceType={Number(sourceData.type)}
          onCancel={() => setVisible(false)}
          onOk={(v: any) => {
            setVisible(false)
            if (v) {
              handleSelectDb({
                ...pick(v, ['id', 'name']),
                networkId: get(v, 'last_connection.network_id', '')
              })
            }
          }}
        />
      </FormWrapper>
    )
  },
  { forwardRef: true }
)

export default SyncDataSource
