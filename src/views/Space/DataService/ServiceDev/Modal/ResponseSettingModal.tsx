import { useEffect } from 'react'
import { DargTable, ResizeModal, FlexBox } from 'components'
import { observer } from 'mobx-react-lite'
import { DataServiceManageDescribeApiConfig, useMutationUpdateApiConfig, useStore } from 'hooks'
import { Button, Collapse, Icon, Input } from '@QCFE/lego-ui'
import { MappingKey } from 'utils/types'
import { useColumns } from 'hooks/useHooks/useColumns'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'

import { ResponseSettingColumns, serviceDevResponseSettingMapping } from '../constants'
import { CollapseWrapper, TableWrapper } from '../styled'

type DataSourceProp = DataServiceManageDescribeApiConfig['response_params']['response_params']
interface IHightData {
  param_name: string
  column_name: string
  type: string
  data_type: number
  is_required: boolean
  field_category: number
  example_value: string
  default_value: string
  param_description: string
}
const dataServiceDataSettingKey = 'DATA_SERVICE_DATA__RESPONSE'
const dataServiceDataTotalSettingKey = 'DATA_SERVICE_DATA__RESPONSE_HIGH'
const getName = (name: MappingKey<typeof serviceDevResponseSettingMapping>) =>
  serviceDevResponseSettingMapping.get(name)!.apiField

const { CollapseItem } = Collapse

const ResponseSettingModal = observer(() => {
  const {
    dtsDevStore: { apiConfigData, curApi, apiResponseData },
    dtsDevStore
  } = useStore()
  const isHistory = get(curApi, 'is_history', false) || false

  const [dataSource, setDataSource] = useImmer<DataSourceProp>([])
  const [highDataSource, setHighDataSource] = useImmer<IHightData[]>([])
  const mutation = useMutationUpdateApiConfig()

  useEffect(() => {
    if (apiResponseData) {
      const config = cloneDeep(apiResponseData)
      const hightConfig = config?.filter((item: any) =>
        ['total', 'limit', 'offset', 'next_offset'].includes(item.param_name)
      )
      const configData = config?.filter(
        (item: any) => !['total', 'limit', 'offset', 'next_offset'].includes(item.param_name)
      )
      setDataSource(configData)
      setHighDataSource(hightConfig as unknown as IHightData[])
    }
  }, [setDataSource, setHighDataSource, apiResponseData])

  const onClose = () => {
    dtsDevStore.set({ showResponseSetting: false })
  }

  const handleSyncStore = () => {
    const config = {
      ...cloneDeep(apiConfigData),
      api_config: {
        ...cloneDeep(apiConfigData?.api_config),
        response_params: {
          response_params: [...dataSource, ...highDataSource]
        }
      }
    }
    dtsDevStore.set({
      apiConfigData: config,
      oldApiTableNam: get(config, 'api_config.table_name') // 旧表名
    })
  }

  const handleOK = () => {
    const configSource = cloneDeep(get(apiConfigData, 'data_source'))
    const apiConfig: any = cloneDeep(get(apiConfigData, 'api_config', {}))

    if (!configSource?.id) {
      Notify.warning({
        title: '操作提示',
        content: '请先选择数据源',
        placement: 'bottomRight'
      })
      return
    }
    mutation.mutate(
      {
        ...apiConfig,
        apiId: get(apiConfig, 'api_id', ''),
        datasource_id: configSource?.id,
        table_name: apiConfig?.table_name,
        response_params: {
          response_params: [...dataSource, ...highDataSource]
        }
      },
      {
        onSuccess: (res) => {
          if (res.ret_code === 0) {
            Notify.success({
              title: '操作提示',
              content: '配置保存成功',
              placement: 'bottomRight'
            })
            handleSyncStore()
            onClose()
          }
        }
      }
    )
  }

  const renderColumns = {
    [getName('param_name')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          onChange={(_, value) => {
            setDataSource((draft) => {
              draft[index].param_name = `${value}`
            })
          }}
        />
      )
    },
    [getName('example_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入示例值"
          onChange={(_, value) => {
            setDataSource((draft) => {
              draft[index].example_value = `${value}`
            })
          }}
        />
      )
    },
    [getName('param_description')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入描述内容"
          onChange={(_, value) => {
            setDataSource((draft) => {
              draft[index].param_description = `${value}`
            })
          }}
        />
      )
    }
  }

  const { columns } = useColumns(
    dataServiceDataSettingKey,
    ResponseSettingColumns,
    renderColumns as any
  )

  const renderTotalColumns = {
    [getName('example_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入示例值"
          onChange={(_, value) => {
            setHighDataSource((draft) => {
              draft[index].example_value = `${value}`
            })
          }}
        />
      )
    },
    [getName('param_description')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入描述内容"
          onChange={(_, value) => {
            setHighDataSource((draft) => {
              draft[index].param_description = `${value}`
            })
          }}
        />
      )
    }
  }
  const ResponseColumns = ResponseSettingColumns.filter(
    (item) => item.key !== getName('column_name')
  )
  const { columns: totalColumns } = useColumns(
    dataServiceDataTotalSettingKey,
    ResponseColumns,
    renderTotalColumns as any
  )

  return (
    <ResizeModal
      minWidth={800}
      maxWidth={1200}
      maskClosable={false}
      enableResizing={{ left: true }}
      orient="fullright"
      visible
      title="返回参数设置"
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={onClose}>取消</Button>
          {!isHistory && (
            <Button type="primary" onClick={handleOK}>
              保存
            </Button>
          )}
        </div>
      }
    >
      <CollapseWrapper defaultActiveKey={['p1', 'p2']}>
        <CollapseItem
          key="p1"
          label={
            <FlexBox tw="items-center space-x-1">
              <Icon name="record" tw="(relative top-0 left-0)!" type="light" />
              <span>基本设置</span>
            </FlexBox>
          }
        >
          <TableWrapper>
            <DargTable
              columns={columns as unknown as any}
              runDarg={false}
              dataSource={dataSource}
              disabled={isHistory}
              rowKey="column_name"
            />
          </TableWrapper>
        </CollapseItem>
        <CollapseItem
          key="p2"
          label={
            <FlexBox tw="items-center space-x-1">
              <Icon name="record" tw="(relative top-0 left-0)!" type="light" />
              <span>高级设置</span>
            </FlexBox>
          }
        >
          <>
            <div tw="mb-3">分页设置</div>
            <TableWrapper>
              <DargTable
                columns={totalColumns as unknown as any}
                runDarg={false}
                dataSource={highDataSource}
                disabled={isHistory}
                rowKey="column_name"
              />
            </TableWrapper>
          </>
        </CollapseItem>
      </CollapseWrapper>
    </ResizeModal>
  )
})

export default ResponseSettingModal
