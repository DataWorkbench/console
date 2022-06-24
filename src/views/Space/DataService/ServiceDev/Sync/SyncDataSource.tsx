import { observer } from 'mobx-react-lite'
import { useImmer } from 'use-immer'
import { useQueryDescribeDataSourceTables, useQueryDescribeDataSourceTableSchema } from 'hooks'
import { Form, Icon } from '@QCFE/lego-ui'
import {
  AffixLabel,
  FlexBox,
  Center,
  ButtonWithClearField,
  PopConfirm,
  SelectWithRefresh,
  HelpCenterLink
} from 'components'
import { useState, useMemo, useEffect } from 'react'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { findKey, get, isEmpty, pick } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { useStore } from 'stores'
import { dataSourceTypes } from '../constants'
import { tableSelectStyled } from '../styled'

type SourceDataType = { id: string; name: string; networkId: string } | null
interface IRouteParams {
  regionId: string
  spaceId: string
}

const dataSourceOption = [
  { label: 'MySQL', value: 1 },
  { label: 'ClickHouse', value: 5 },
  { label: 'PostgreSQL', value: 2 }
]

const { SelectField } = Form

const SyncDataSource = observer(
  (props, ref) => {
    const [visible, setVisible] = useState<boolean | null>(null)
    const { spaceId } = useParams<IRouteParams>()
    const [sourceData, setSourceData] = useImmer<{
      type: string
      tableName: string
      source: SourceDataType
    }>({
      type: '',
      source: null,
      tableName: ''
    })

    const {
      dtsDevStore: { setSchemaColumns }
    } = useStore()

    const paramsTable = { uri: { space_id: spaceId, source_id: sourceData.source?.id || '' } }
    const tablesRet = useQueryDescribeDataSourceTables(paramsTable, {
      enabled: !!sourceData.source?.id
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
    const tables = useMemo(() => {
      const da = get(tablesRet.data, 'items', [])
      const option = da.map((tabName) => ({
        label: tabName,
        value: tabName
      }))
      return option
    }, [tablesRet.data])

    useEffect(() => {
      const columns = get(TableSchema.data, 'schema.columns', [])
      if (!columns) return
      setSchemaColumns(columns)
    }, [TableSchema.data, setSchemaColumns])

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

    return (
      <FlexBox tw="flex-col">
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
            onChange={(v: string) => {
              setSourceData((draft) => {
                draft.type = v
                draft.source = null
                draft.tableName = ''
              })
              clearSchemaColumns()
            }}
          />
          {sourceData.type !== '' && (
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
          {!isEmpty(sourceData.source) && (
            <SelectWithRefresh
              name="table"
              label={<AffixLabel>数据源表</AffixLabel>}
              options={tables}
              isLoading={tablesRet.isFetching}
              clearable={false}
              onRefresh={() => {
                tablesRet.refetch()
              }}
              onChange={(v: string) => {
                setSourceData((draft) => {
                  draft.tableName = v
                })
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
      </FlexBox>
    )
  },
  { forwardRef: true }
)

export default SyncDataSource
