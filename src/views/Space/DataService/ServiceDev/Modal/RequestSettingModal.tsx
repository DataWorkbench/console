import { useRef, useEffect } from 'react'
import { DargTable, ResizeModal, FlexBox } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore, DataServiceManageDescribeApiConfig, useMutationUpdateApiConfig } from 'hooks'
import { Button, Collapse, Icon, Input, Select } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import {
  RequestSettingColumns,
  serviceDevRequestSettingMapping,
  ParameterOperator,
  ParameterPosition,
  configMapData
} from '../constants'

type DataSourceProp = DataServiceManageDescribeApiConfig['request_params']['request_params']
export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}
const dataServiceDataSettingKey = 'DATA_SERVICE_DATA_REQUEST_TABLE'
const dataServiceDataLimitSettingKey = 'DATA_SERVICE_DATA_REQUEST_LIMIT'
const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

const { CollapseItem } = Collapse

export const JobModal = observer(() => {
  const modal = useRef(null)

  const [dataSource, setDataSource] = useImmer<DataSourceProp>([])
  const [limitSource, setLimitSource] = useImmer([
    {
      param_name: 'limit',
      data_type: 'INT',
      param_operator: ParameterOperator.EQUAL,
      param_position: ParameterPosition.QUERY,
      is_required: false,
      example_value: '',
      default_value: '',
      param_description: ''
    },
    {
      param_name: 'limit',
      data_type: 'INT',
      param_operator: ParameterOperator.EQUAL,
      param_position: ParameterPosition.QUERY,
      is_required: false,
      example_value: '',
      default_value: '',
      param_description: ''
    }
  ])

  const {
    dtsDevStore: { apiConfigData, fieldSettingData },
    dtsDevStore
  } = useStore()

  const mutation = useMutationUpdateApiConfig()

  useEffect(() => {
    if (apiConfigData) {
      const filedData = cloneDeep(fieldSettingData)
        .filter((item) => item.isRequest)
        .map((item) => ({ param_name: item.field, column_name: item.field, type: item.type }))
      const config = cloneDeep(get(apiConfigData, 'api_config.request_params', []))

      if (filedData.length) {
        // 拼数据
        const defaultValue = {
          data_type: 0, // TODO: 暂时写死 字段映射表
          param_operator: ParameterOperator.EQUAL,
          param_position: ParameterPosition.QUERY,
          is_required: false,
          example_value: '',
          default_value: '',
          param_description: ''
        }
        const newRequestData = configMapData(filedData, config, defaultValue)
        setDataSource(newRequestData)
      }
    }
  }, [apiConfigData, setDataSource, fieldSettingData])

  const onClose = () => {
    dtsDevStore.set({ showRequestSetting: false })
  }

  const handleOK = () => {
    const apiConfig = cloneDeep(apiConfigData)
    mutation.mutate(
      {
        apiId: get(apiConfig, 'api_config.api_id', ''),
        request_params: {
          request_params: dataSource
        }
      },
      {
        onSuccess: () => {
          onClose()
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
      render: (text: string) => (
        <Select options={ParameterOperator.getList().map((item) => item)} value={text} />
      )
    },
    [getName('param_position')]: {
      width: 100,
      render: (text: string) => (
        <Select value={text} options={ParameterPosition.getList().map((item) => item)} />
      )
    },
    [getName('example_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
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
          onChange={(_, value) => {
            setDataSource((draft) => {
              draft[index].param_description = `${value}`
            })
          }}
        />
      )
    }
  }

  const renderLimitColumns = {
    [getName('is_required')]: {
      width: 50,
      title: '必填',
      render: () => <span>否</span>
    },
    [getName('param_operator')]: {
      width: 100,
      render: () => <span>=</span>
    },
    [getName('param_position')]: {
      width: 100,
      render: (text: string) => (
        <Select value={text} options={ParameterPosition.getList().map((item) => item)} />
      )
    },
    [getName('example_value')]: {
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          onChange={(_, value) => {
            setLimitSource((draft) => {
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
          onChange={(_, value) => {
            setLimitSource((draft) => {
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
          onChange={(_, value) => {
            setLimitSource((draft) => {
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
  const RequestColumns = RequestSettingColumns.filter((item) => item.key !== getName('column_name'))
  const { columns: limitColumns } = useColumns(
    dataServiceDataLimitSettingKey,
    RequestColumns,
    renderLimitColumns as any
  )

  return (
    <ResizeModal
      orient="fullright"
      maskClosable={false}
      closable={false}
      ref={modal}
      visible
      maxWidth={1500}
      enableResizing={{ left: true }}
      title="请求参数设置"
      width={1200}
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOK}>
            保存
          </Button>
        </div>
      }
    >
      <Collapse defaultActiveKey={['p1', 'p2']}>
        <CollapseItem
          key="p1"
          label={
            <FlexBox tw="items-center space-x-1">
              <Icon name="record" tw="(relative top-0 left-0)!" type="light" />
              <span>基本设置</span>
            </FlexBox>
          }
        >
          <DargTable
            columns={columns as unknown as any}
            runDarg={false}
            dataSource={dataSource}
            rowKey="param_name"
          />
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
          <DargTable
            columns={limitColumns as unknown as any}
            runDarg={false}
            dataSource={limitSource}
            rowKey="param_name"
          />
        </CollapseItem>
      </Collapse>
    </ResizeModal>
  )
})

export default JobModal
