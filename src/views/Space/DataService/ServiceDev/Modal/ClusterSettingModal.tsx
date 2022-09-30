import { useEffect, useRef, useState } from 'react'
import {
  AffixLabel,
  ButtonWithClearField,
  Center,
  DarkModal,
  ModalContent,
  PopConfirm
} from 'components'
import { cloneDeep, get, isEmpty } from 'lodash-es'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useMutationUpdateApiConfig, useStore } from 'hooks'
import { Form, Button, Icon, Alert } from '@QCFE/lego-ui'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import ClusterTableModal from './ClusterTableModal'

const Root = styled.div`
  ${tw`text-white space-y-2 mb-5`}
`

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-full`}
    .form {
      ${tw`pl-0`}
      &.is-horizon-layout>.field {
        > .label {
          ${tw`w-28`}
        }
        > .control {
          ${tw`flex-1 max-w-[556px]`}
          .select {
            ${tw`w-full`}
          }
          .textarea {
            ${tw`w-[556px] max-w-[556px]`}
          }
        }
        > .help {
          ${tw`w-full  ml-28`}
        }
      }
    }
  `
])

const ClusterSettingModal = observer(() => {
  const mutation = useMutationUpdateApiConfig()
  const [cluster, setCluster] = useState<{ id: string; name?: string } | null>()
  const clusterId = get(cluster, 'id', '')
  const clusterName = get(cluster, 'name', '')
  const [visible, setVisible] = useState(false)
  const form = useRef<Form>(null)

  const {
    dtsDevStore,
    dtsDevStore: { apiConfigData, curApi, apiRequestData, apiResponseData }
  } = useStore()
  const isHistory = get(curApi, 'is_history', false) || false
  const requestConfig = cloneDeep(apiRequestData) as any[]
  const responseConfig = cloneDeep(apiResponseData) as any[]

  useEffect(() => {
    const serviceCluster = cloneDeep(get(apiConfigData, 'service_cluster'))
    if (serviceCluster?.id) {
      setCluster({ id: serviceCluster.id, name: serviceCluster.name })
    }
  }, [apiConfigData])

  const onClose = () => {
    dtsDevStore.set({ showClusterSetting: false })
  }

  const handleSyncStore = () => {
    const config = {
      ...cloneDeep(apiConfigData),
      api_config: {
        ...cloneDeep(apiConfigData?.api_config),
        cluster_id: clusterId,
        request_params: {
          request_params: requestConfig
        },
        response_params: {
          response_params: responseConfig
        }
      },
      service_cluster: {
        id: clusterId,
        name: clusterName
      }
    }
    dtsDevStore.set({
      apiConfigData: config,
      showClusterErrorTip: false,
      oldApiTableNam: get(config, 'api_config.table_name') // 旧表名
    })
  }

  const handleOK = () => {
    if (form.current?.validateForm()) {
      const configSource = cloneDeep(get(apiConfigData, 'data_source'))
      const apiConfig: any = cloneDeep(get(apiConfigData, 'api_config', {}))

      mutation.mutate(
        {
          ...apiConfig,
          apiId: get(apiConfig, 'api_id', ''),
          datasource_id: configSource?.id,
          table_name: apiConfig?.table_name,
          cluster_id: cluster?.id,
          request_params: {
            request_params: requestConfig
          },
          response_params: {
            response_params: responseConfig
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
  }

  return (
    <DarkModal
      orient="fullright"
      visible
      title="服务集群"
      width={800}
      onCancel={onClose}
      maskClosable={false}
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
      <ModalContent>
        <FormWrapper>
          <Root>
            <Alert
              message="提示：排序字段非必须，如你需要排序字段，请在下方添加并选择需要排序的字段。"
              type="info"
            />
          </Root>
          <Form layout="horizon" ref={form}>
            <ButtonWithClearField
              clearable={!!cluster}
              name="cluster"
              popConfirm={<PopConfirm type="warning" content="请确认是否移除服务集群？" />}
              icon={<Icon name="pod" size={16} color={{ secondary: 'rgba(255,255,255,0.4)' }} />}
              value={clusterId}
              placeholder="选择服务集群"
              onClick={() => {
                setVisible(true)
              }}
              disabled={isHistory}
              onClear={() => {
                setCluster(null)
                mutation.reset()
              }}
              label={<AffixLabel required>服务集群</AffixLabel>}
            >
              <Center tw="space-x-1">
                <span tw="ml-1">{clusterName}</span>
                <span tw="text-neut-8">(ID:{clusterId})</span>
              </Center>
            </ButtonWithClearField>
          </Form>
        </FormWrapper>
      </ModalContent>
      <ClusterTableModal
        visible={visible}
        onOk={(v) => {
          setCluster(v)
          setVisible(false)
          mutation.reset()
        }}
        selectedIds={isEmpty(clusterId) ? [] : [clusterId]}
        onCancel={() => setVisible(false)}
      />
    </DarkModal>
  )
})

export default ClusterSettingModal
