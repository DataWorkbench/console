import { useEffect } from 'react'
import { DargTable, ResizeModal, FlexBox } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore, DataServiceManageDescribeApiConfig, useMutationUpdateApiConfig } from 'hooks'
import { Button, Collapse, Icon, Input, Select } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import {
  RequestSettingColumns,
  serviceDevRequestSettingMapping,
  ParameterOperator,
  ParameterPosition
} from '../constants'

import { CollapseWrapper, TableWrapper } from '../styled'

type DataSourceProp = DataServiceManageDescribeApiConfig['request_params']['request_params']
export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}
const dataServiceDataSettingKey = 'DATA_SERVICE_DATA_REQUEST_TABLE'
const dataServiceDataLimitSettingKey = 'DATA_SERVICE_DATA_REQUEST_HIGH'
const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

interface IHighSource {
  column_name: string
  param_name: string
  data_type: number
  type: string
  param_operator: number
  param_position: number
  is_required: boolean
  field_category: number
  example_value: string
  default_value: string
  param_description: string
}

const { CollapseItem } = Collapse

const RequestSettingModal = observer(() => {
  const [dataSource, setDataSource] = useImmer<DataSourceProp>([])
  const [highSource, setHighSource] = useImmer<IHighSource[]>([])

  const {
    dtsDevStore: { apiConfigData, curApi, apiRequestData },
    dtsDevStore
  } = useStore()
  const isHistory = get(curApi, 'is_history', false) || false

  const mutation = useMutationUpdateApiConfig()

  useEffect(() => {
    if (apiRequestData) {
      const config = cloneDeep(apiRequestData)
      const configData = config?.filter(
        (item: any) => !['limit', 'offset'].includes(item.param_name)
      )
      const hightConfig = config?.filter((item: any) =>
        ['limit', 'offset'].includes(item.param_name)
      )
      setDataSource(configData)
      setHighSource(hightConfig as IHighSource[])
    }
  }, [setDataSource, setHighSource, apiRequestData])

  const onClose = () => {
    dtsDevStore.set({ showRequestSetting: false })
  }

  const handleSyncStore = () => {
    const config = {
      ...cloneDeep(apiConfigData),
      api_config: {
        ...cloneDeep(apiConfigData?.api_config),
        request_params: {
          request_params: [...dataSource, ...highSource]
        }
      }
    }
    dtsDevStore.set({
      apiConfigData: config
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
        request_params: {
          request_params: [...dataSource, ...highSource]
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
      width: 140,
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
    [getName('is_required')]: {
      width: 50,
      title: '必填',
      checkbox: true,
      onSelect: (checked: boolean, record: any, index: number) => {
        setDataSource((draft) => {
          draft[index].is_required = checked
        })
      },
      onAllSelect: (checked: boolean) => {
        setDataSource((draft) => {
          draft.forEach((item) => {
            item.is_required = checked
          })
        })
      }
    },
    [getName('param_operator')]: {
      width: 100,
      render: (text: string, __: any, index: number) => (
        <Select
          value={text}
          options={ParameterOperator.getList().map((item) => item)}
          onChange={(_, item) => {
            setDataSource((draft) => {
              draft[index].param_operator = item.value
            })
          }}
        />
      )
    },
    [getName('param_position')]: {
      width: 100,
      render: (text: string, __: any, index: number) => (
        <Select
          value={text}
          options={ParameterPosition.getList().map((item) => item)}
          onChange={(_, item) => {
            setDataSource((draft) => {
              draft[index].param_position = item.value
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
    [getName('default_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入默认值"
          onChange={(_, value) => {
            setDataSource((draft) => {
              draft[index].default_value = `${value}`
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
    RequestSettingColumns,
    renderColumns as any
  )

  const renderHighColumns = {
    [getName('is_required')]: {
      width: 50,
      title: '必填',
      render: () => <span>否</span>
    },
    [getName('param_operator')]: {
      width: 100,
      render: (text: string) => <div>{ParameterOperator.getLabel(text)}</div>
    },
    [getName('param_position')]: {
      width: 100,
      render: (text: string, __: any, index: number) => (
        <Select
          value={text}
          options={ParameterPosition.getList().map((item) => item)}
          onChange={(_, item) => {
            setHighSource((draft) => {
              draft[index].param_position = item.value
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
            setHighSource((draft) => {
              draft[index].example_value = `${value}`
            })
          }}
        />
      )
    },
    [getName('default_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          placeholder="请输入默认值"
          onChange={(_, value) => {
            setHighSource((draft) => {
              draft[index].default_value = `${value}`
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
            setHighSource((draft) => {
              draft[index].param_description = `${value}`
            })
          }}
        />
      )
    }
  }

  const RequestColumns = RequestSettingColumns.filter((item) => item.key !== getName('column_name'))
  const { columns: limitColumns } = useColumns(
    dataServiceDataLimitSettingKey,
    RequestColumns,
    renderHighColumns as any
  )

  return (
    <ResizeModal
      orient="fullright"
      maskClosable={false}
      visible
      maxWidth={1500}
      enableResizing={{ left: true }}
      title="请求参数设置"
      width={1200}
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
      <>
        <TableWrapper tw="p-5">
          <DargTable
            columns={columns as unknown as any}
            runDarg={false}
            dataSource={dataSource}
            disabled={isHistory}
            rowKey="column_name"
          />
        </TableWrapper>
        <CollapseWrapper defaultActiveKey={['p1']}>
          <CollapseItem
            key="p1"
            label={
              <FlexBox tw="items-center space-x-1">
                <Icon name="record" tw="(relative top-0 left-0)!" type="light" />
                <span>高级设置</span>
              </FlexBox>
            }
          >
            <TableWrapper>
              <DargTable
                columns={limitColumns as unknown as any}
                runDarg={false}
                disabled={isHistory}
                dataSource={highSource}
                rowKey="column_name"
              />
            </TableWrapper>
          </CollapseItem>
        </CollapseWrapper>
      </>
    </ResizeModal>
  )
})

export default RequestSettingModal
