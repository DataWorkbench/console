import { useEffect } from 'react'
import { DargTable, Modal, FlexBox, ModalContent } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore, useMutationTestDataServiceApi } from 'hooks'
import { Button, Input } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { TitleItem, TestContent, MessageBox, TableWrapper } from '../styled'
import {
  RequestSettingColumns,
  serviceDevRequestSettingMapping,
  ParameterPosition
} from '../constants'

const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

const dataServiceDataLimitSettingKey = 'DATA_SERVICE_DATA_REQUEST_HIGH'

const TestModal = observer(() => {
  const {
    dtsDevStore: { apiConfigData },
    dtsDevStore
  } = useStore()
  const [testSource, setTestSource] = useImmer<any[]>([])
  const [testApiContent, setApiTestContent] = useImmer<any>(null)
  const apiConfig = cloneDeep(get(apiConfigData, 'api_config'))

  useEffect(() => {
    const requestConfig = cloneDeep(get(apiConfigData, 'api_config.request_params.request_params'))

    if (requestConfig) {
      const config = requestConfig.filter(
        (item: { column_name: string }) => !['limit', 'offset'].includes(item.column_name)
      )
      setTestSource(config)
    }
  }, [apiConfigData, setTestSource])

  const testMutation = useMutationTestDataServiceApi()

  const onClose = () => {
    dtsDevStore.set({ showTestModal: false })
  }

  const startTest = () => {
    testMutation.mutate(
      { apiId: apiConfig?.api_id, request_params: testSource },
      {
        onSuccess: (res) => {
          if (res.ret_code === 0) {
            setApiTestContent(res)
          }
        }
      }
    )
  }

  const renderHighColumns = {
    [getName('param_name')]: {
      width: 90
    },
    [getName('is_required')]: {
      width: 60,
      title: '是否必填',
      render: () => <span>否</span>
    },
    [getName('type')]: {
      width: 60,
      title: '参数类型'
    },
    [getName('param_position')]: {
      width: 60,
      render: (text: string) => <span>{ParameterPosition.getLabel(text)}</span>
    },
    [getName('default_value')]: {
      title: '值',
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          onChange={(_, value) => {
            setTestSource((draft) => {
              draft[index].default_value = `${value}`
            })
          }}
        />
      )
    }
  }

  const excludeColumns = [
    getName('column_name'),
    getName('param_operator'),
    getName('example_value'),
    getName('param_description')
  ]
  const RequestColumns = RequestSettingColumns.filter(
    (item) => !excludeColumns.includes(item.key as string)
  )
  const { columns: limitColumns } = useColumns(
    dataServiceDataLimitSettingKey,
    RequestColumns,
    renderHighColumns as any
  )

  return (
    <Modal
      orient="fullright"
      maskClosable={false}
      visible
      title={`API ID: ${apiConfig?.api_id} 测试`}
      width={1200}
      onCancel={onClose}
      footer={null}
    >
      <ModalContent tw="overflow-hidden">
        <div tw="mb-3">API Path: {apiConfig?.api_path}</div>
        <FlexBox tw="h-full">
          <div tw="flex-1 mr-5">
            <TitleItem>请求参数</TitleItem>
            <TableWrapper tw="my-3">
              <DargTable
                columns={limitColumns as unknown as any}
                runDarg={false}
                dataSource={testSource}
                rowKey="column_name"
              />
            </TableWrapper>
            <Button
              type="primary"
              size="small"
              loading={testMutation.isLoading}
              onClick={startTest}
            >
              开始测试
            </Button>
            <div>
              <MessageBox>
                <Icon name="success" color={{ secondary: 'green' }} type="dark" />
                测试通过，API 调用延迟 180ms
              </MessageBox>
              <MessageBox color="red">
                <Icon name="error" color={{ secondary: 'red' }} type="dark" />
                测试通过，API 调用延迟 180ms
              </MessageBox>
            </div>
          </div>
          <div tw="flex-1">
            <FlexBox orient="column" tw="h-full overflow-hidden">
              <div tw="flex-1">
                <TitleItem>请求详情</TitleItem>
                <TestContent>
                  {testApiContent?.logs ? testApiContent?.logs : '点击开始测试后会有返回详情'}
                </TestContent>
              </div>
              <div tw="flex-1">
                <TitleItem>响应详情</TitleItem>
                <TestContent>
                  {testApiContent?.response_content
                    ? testApiContent?.response_content
                    : '点击开始测试后会有返回详情'}
                </TestContent>
              </div>
            </FlexBox>
          </div>
        </FlexBox>
      </ModalContent>
    </Modal>
  )
})

export default TestModal
