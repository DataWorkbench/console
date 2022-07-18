import { DargTable, Modal, FlexBox, ModalContent } from 'components'
import { useMutationDescribeDataServiceApiVersion } from 'hooks'
import { Button, Input } from '@QCFE/lego-ui'
import { useColumns } from 'hooks/useHooks/useColumns'
import { MappingKey } from 'utils/types'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import { PbmodelRoute } from 'types/types'
import { useMount } from 'react-use'
import { observer } from 'mobx-react-lite'
import { TitleItem, TestContent } from '../../ServiceDev/styled'

import {
  serviceDevRequestSettingMapping,
  ParameterPosition,
  RequestSettingColumns
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

  const [testSource, setTestSource] = useImmer<any[]>([])
  const [testAuthKey, setTestAuthKey] = useImmer<string>('')
  const mutationApiVersion = useMutationDescribeDataServiceApiVersion()

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
          const dataSource = get(res, 'api_version.request_params.request_params', []) || []
          const config = dataSource.filter(
            (item: { column_name: string }) => !['limit', 'offset'].includes(item.column_name)
          )
          console.log(config, '历史版本')
          setTestSource(config)
        }
      })
    }
  })

  const onClose = () => {
    onCancel()
  }

  const startTest = () => {
    const params: any = {}
    testSource.forEach((source: any) => {
      const keyV = source.param_name
      const value = source.data_type === 2 ? Number(source.example_value) : source.example_value
      params[keyV] = value
    })
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
    [getName('example_value')]: {
      title: '值',
      render: (text: string, __: any, index: number) => (
        <Input
          value={text}
          onChange={(_, value) => {
            setTestSource((draft) => {
              draft[index].example_value = `${value}`
            })
          }}
        />
      )
    }
  }

  const excludeColumns = [
    getName('column_name'),
    getName('param_operator'),
    getName('default_value'),
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
      <ModalContent tw="h-full">
        <div tw="mb-3">API Path: {currentRow?.proxy_uri}</div>
        <FlexBox tw="h-full">
          <div tw="flex-1 mr-5">
            <TitleItem>请求参数</TitleItem>
            <div tw="my-3">
              <DargTable
                columns={limitColumns as unknown as any}
                runDarg={false}
                dataSource={testSource}
                rowKey="key"
              />
            </div>
            <Input
              tw="mb-3"
              placeholder="请输入密钥（API所属API服务组详情可查看已绑密钥）"
              value={testAuthKey}
              onChange={(_, v) => setTestAuthKey(v as string)}
            />
            <Button type="primary" size="small" onClick={startTest}>
              开始测试
            </Button>
          </div>
          <div tw="flex-1 h-full">
            <FlexBox orient="column" tw="h-full overflow-hidden">
              <div tw="flex-row flex-1">
                <TitleItem>响应详情</TitleItem>
                <TestContent tw="h-[90%]">点击开始测试后会有返回详情</TestContent>
              </div>
            </FlexBox>
          </div>
        </FlexBox>
      </ModalContent>
    </Modal>
  )
})

export default TestModal
