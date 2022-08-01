import { DargTable, Modal, FlexBox, ModalContent } from 'components'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'

import {
  useMutationDescribeDataServiceApiVersion,
  useMutationPublishedApiHttpDetails,
  testPublishApi,
  useQueryListApiServices
} from 'hooks'
import { Button, Input } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { get, isEmpty, omitBy } from 'lodash-es'
import { PbmodelRoute } from 'types/types'
import { useMount } from 'react-use'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { TitleItem, TestContent, TableWrapper } from '../../ServiceDev/styled'

import {
  serviceDevRequestSettingMapping,
  ParameterPosition,
  RequestSettingColumns,
  typeStatus
} from '../../ServiceDev/constants'

interface TestModalProps {
  onCancel: () => void
  currentRow?: PbmodelRoute
}

const getName = (name: MappingKey<typeof serviceDevRequestSettingMapping>) =>
  serviceDevRequestSettingMapping.get(name)!.apiField

const dataServiceDataLimitSettingKey = 'DATA_SERVICE_API_ROUTER_TEST'

export const TestModal = observer((props: TestModalProps) => {
  const { onCancel, currentRow } = props

  const { spaceId } = useParams<{ spaceId: string }>()
  const [testSource, setTestSource] = useImmer<any[]>([])
  const [testAuthKey, setTestAuthKey] = useImmer<string>('')
  const [testResponse, setTestResponse] = useImmer<string>('')
  const mutationApiVersion = useMutationDescribeDataServiceApiVersion()
  const mutationPublishApiDetail = useMutationPublishedApiHttpDetails()
  const { data: serviceData } = useQueryListApiServices({
    uri: { space_id: spaceId },
    params: { ids: currentRow?.api_service_id }
  })
  const currentService = get(serviceData, 'entities[0]', {})

  useMount(() => {
    if (currentRow) {
      const apiId = get(currentRow, 'id')
      const verId = get(currentRow, 'api_version_id')
      const params = {
        apiId,
        verId
      }
      mutationApiVersion.mutate(params, {
        onSuccess: (res) => {
          const dataSource = get(res, 'api_config.request_params.request_params', []) || []
          // 如果有默认值，就填充默认值，没有默认值就填充示例值，都没有才置空
          const configData = dataSource.map(
            (item: { default_value: any; example_value: any; data_type: string }) => {
              let value = item.default_value ? item.default_value : ''
              value = value === '' ? item.example_value : value
              let type = 'INT'
              try {
                type = typeStatus.getLabel(item.data_type) as string
              } catch (error) {
                console.log(error)
              }
              return {
                ...item,
                type: type.toLocaleUpperCase(),
                default_value: value
              }
            }
          )
          setTestSource(configData)
        }
      })
    }
  })

  const onClose = () => {
    onCancel()
  }

  const startTest = () => {
    if (currentService.auth_key_id !== '' && testAuthKey.length === 0) {
      Notify.warning({
        title: '操作提示',
        content: '请填写密钥',
        placement: 'bottomRight'
      })
      return
    }

    const verId = get(currentRow, 'api_version_id')
    mutationPublishApiDetail.mutate(
      { verId, request_params: testSource },
      {
        onSuccess: (res) => {
          try {
            const method = get(res, 'request_method') === 1 ? 'GET' : 'POST'
            const requestContent = JSON.parse(get(res, 'request_content', ''))
            const host = get(currentRow, 'host', '')
            const uri = get(res, 'uri', '')
            const params = {
              uri,
              host,
              method,
              token: testAuthKey,
              requestContent
            }
            testPublishApi(omitBy(params, isEmpty)).then((data: any) => {
              setTestResponse(JSON.stringify(data, null, 2))
            })
          } catch (error) {
            console.log(error)
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
      title={`API ID: ${currentRow?.id} 测试`}
      width={1200}
      onCancel={onClose}
      footer={null}
    >
      <ModalContent tw="h-full overflow-hidden">
        <div tw="mb-3">API Path: {currentRow?.uri}</div>
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
            {currentService.auth_key_id && (
              <Input
                tw="mb-3"
                placeholder="请输入密钥（API所属API服务组详情可查看已绑密钥）"
                value={testAuthKey}
                onChange={(_, v) => setTestAuthKey(v as string)}
              />
            )}
            <Button type="primary" size="small" onClick={startTest}>
              开始测试
            </Button>
          </div>
          <div tw="flex-1 h-full">
            <FlexBox orient="column" tw="h-full overflow-hidden">
              <TitleItem>响应详情</TitleItem>
              <TestContent tw="h-[90%]">
                <code tw="break-words whitespace-pre-wrap bg-transparent text-white">
                  {testResponse || '点击开始测试后会有返回详情'}
                </code>
              </TestContent>
            </FlexBox>
          </div>
        </FlexBox>
      </ModalContent>
    </Modal>
  )
})

export default TestModal
