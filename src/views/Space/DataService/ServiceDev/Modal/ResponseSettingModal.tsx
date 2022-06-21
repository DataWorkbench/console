import { useEffect } from 'react'
import { DargTable, DarkModal, FlexBox } from 'components'
import { observer } from 'mobx-react-lite'
import { DataServiceManageDescribeApiConfig, useMutationUpdateApiConfig, useStore } from 'hooks'
import { Button, Collapse, Icon, Input, Toggle } from '@QCFE/lego-ui'
import tw, { css } from 'twin.macro'
import { MappingKey } from 'utils/types'
import { useColumns } from 'hooks/useHooks/useColumns'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import { ResponseSettingColumns, serviceDevResponseSettingMapping } from '../constants'

export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}

const styles = {
  table: css`
    .darg-table-body {
      .group {
        ${tw` bg-neut-17! hover:bg-neut-16!`}
      }
    }
  `
}

type DataSourceProp = DataServiceManageDescribeApiConfig['response_params']

const dataServiceDataSettingKey = 'DATA_SERVICE_DATA__RESPONSE'
const getName = (name: MappingKey<typeof serviceDevResponseSettingMapping>) =>
  serviceDevResponseSettingMapping.get(name)!.apiField

const { CollapseItem } = Collapse

export const JobModal = observer(() => {
  const {
    dtsDevStore: { apiConfigData },
    dtsDevStore
  } = useStore()
  const [dataSource, setDataSource] = useImmer<DataSourceProp>([])
  const mutation = useMutationUpdateApiConfig()

  useEffect(() => {
    if (apiConfigData) {
      const data = cloneDeep(get(apiConfigData, 'response_params', []))
      setDataSource(data)
    }
  }, [apiConfigData, setDataSource])

  const onClose = () => {
    dtsDevStore.set({ showResponseSetting: false })
  }

  const handleOK = () => {
    mutation.mutate(
      {
        apiId: get(apiConfigData, 'api_id') as string,
        wizardDetails: {
          response_params: dataSource
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
      render: (text: string) => <Input value={text} />
    },
    [getName('example_value')]: {
      render: (text: string) => <Input value={text} />
    },
    [getName('param_description')]: {
      render: (text: string) => <Input value={text} />
    }
  }

  const { columns } = useColumns(
    dataServiceDataSettingKey,
    ResponseSettingColumns,
    renderColumns as any
  )

  return (
    <DarkModal
      orient="fullright"
      visible
      title="返回参数设置"
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
          <div css={styles.table}>
            <DargTable
              columns={columns as unknown as any}
              runDarg={false}
              dataSource={dataSource}
              rowKey="key"
            />
          </div>
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
          <Toggle defaultChecked />
          <span tw="ml-2">返回结果分页</span>
        </CollapseItem>
      </Collapse>
    </DarkModal>
  )
})

export default JobModal
