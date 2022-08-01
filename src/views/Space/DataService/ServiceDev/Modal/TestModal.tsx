import { useEffect } from 'react'
import { DargTable, Modal, FlexBox, ModalContent } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore, useMutationTestDataServiceApi } from 'hooks'
import { Button, Input } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { cloneDeep, get } from 'lodash-es'
import { Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'

import { TitleItem, TestContent, MessageBox, TableWrapper } from '../styled'
import {
  RequestSettingColumns,
  serviceDevRequestSettingMapping,
  ParameterPosition
} from '../constants'
import { fieldDataToRequestData } from '../Sync/SyncUtil'

const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

const dataServiceDataLimitSettingKey = 'DATA_SERVICE_DATA_REQUEST_HIGH'

const TestModal = observer(() => {
  const {
    dtsDevStore: { apiConfigData, fieldSettingData },
    dtsDevStore
  } = useStore()
  const [testSource, setTestSource] = useImmer<any[]>([])
  const [testRequest, setTestRequest] = useImmer<string>('')
  const [testResponse, setTestResponse] = useImmer<string>('')
  const [testMessage, setTestMessage] = useImmer<{ test_status: string; item_out: number }>({
    test_status: '',
    item_out: 0
  })
  const apiConfig = cloneDeep(get(apiConfigData, 'api_config'))
  const apiCroup = cloneDeep(get(apiConfigData, 'api_group'))

  useEffect(() => {
    const requestConfig = cloneDeep(get(apiConfigData, 'api_config.request_params.request_params'))

    if (requestConfig) {
      // 如果有默认值，就填充默认值，没有默认值就填充示例值，都没有才置空
      const configData = requestConfig.map((item: { default_value: any; example_value: any }) => {
        let value = item.default_value ? item.default_value : ''
        value = value === '' ? item.example_value : value
        return {
          ...item,
          default_value: value
        }
      })
      const filedRequest = cloneDeep(fieldSettingData)
        .filter((item) => item.isRequest)
        .map((item) => ({
          item,
          param_name: item.field,
          column_name: item.field,
          type: item.type,
          customType: item.customType
        }))
      const config = fieldDataToRequestData(filedRequest, configData)
      setTestSource(config)
    }
  }, [apiConfigData, fieldSettingData, setTestSource])

  const testMutation = useMutationTestDataServiceApi()

  const onClose = () => {
    dtsDevStore.set({ showTestModal: false })
  }

  const startTest = () => {
    const requiredParams = testSource.filter((item) => item.is_required)

    const allRequired = requiredParams.every((item) => item.default_value !== '')

    if (!allRequired) {
      Notify.warning({
        title: '操作提示',
        content: '请填写必填的请求参数',
        placement: 'bottomRight'
      })
      return
    }

    testMutation.mutate(
      { apiId: apiConfig?.api_id, request_params: testSource },
      {
        onSuccess: (res) => {
          if (res.ret_code === 0) {
            let logs = ''
            let content = ''
            try {
              logs = res.logs
              content = JSON.stringify(JSON.parse(res.response_content), null, 2)
              setTestRequest(logs)
              setTestResponse(content)
              setTestMessage({
                test_status: res.test_status,
                item_out: res.item_out
              })
            } catch (error) {
              console.log(error)
            }
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
      render: (text: boolean) => <span>{text ? '是' : '否'}</span>
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
        <div tw="mb-3">
          API Path: {apiCroup?.group_path === '/' ? '' : apiCroup?.group_path}
          {apiConfig?.api_path}
        </div>
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
              {testMessage.test_status === 'pass' && (
                <MessageBox>
                  <Icon name="success" color={{ secondary: 'green' }} type="dark" />
                  测试通过，API 调用延迟 {testMessage.item_out}ms
                </MessageBox>
              )}
              {testMessage.test_status === 'failed' && (
                <MessageBox color="red">
                  <Icon name="error" color={{ secondary: 'red' }} type="dark" />
                  测试通过，API 调用延迟 {testMessage.item_out}ms
                </MessageBox>
              )}
            </div>
          </div>
          <div tw="flex-1">
            <FlexBox orient="column" tw="h-full overflow-hidden">
              <div tw="flex-1">
                <TitleItem>请求详情</TitleItem>
                <TestContent>
                  <code tw="break-words whitespace-pre-wrap bg-transparent text-white">
                    {testRequest || '点击开始测试后会有返回详情'}
                  </code>
                </TestContent>
              </div>
              <div tw="flex-1">
                <TitleItem>响应详情</TitleItem>
                <TestContent>
                  <code tw="break-words whitespace-pre-wrap bg-transparent text-white">
                    {testResponse || '点击开始测试后会有返回详情'}
                  </code>
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
