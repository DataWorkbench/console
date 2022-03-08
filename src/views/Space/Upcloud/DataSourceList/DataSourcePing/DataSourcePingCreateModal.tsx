import React, { useContext, useRef, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { Form } from '@QCFE/lego-ui'

import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useStore } from 'stores'

import { networkLink } from 'views/Space/Upcloud/DataSourceList/constant'
import { NetworkContext } from '../NetworkProvider'

const DataSourcePingCreateModal = ({
  onChange,
  onOk,
  onClose,
  networkId: networkIdProp,
}: {
  onChange: (network?: Record<string, any>) => void
  onOk: () => void
  onClose: () => void
  networkId?: string
}) => {
  const {
    dmStore: { setNetWorkOp },
  } = useStore()

  const { networks, refreshNetworks, networkMap } = useContext(NetworkContext)

  const [networkId, setNetworkId] = useState(networkIdProp)

  const form = useRef<Form>(null)

  const handleOk = () => {
    if (!form.current?.validateFields()) return false
    onChange(networkId ? networkMap.get(networkId) : undefined)
    onOk()
    return true
  }

  return (
    <Modal
      visible
      width={800}
      title="选择可用性测试所需网络配置"
      onCancel={onClose}
      okText="确认"
      onOk={handleOk}
    >
      <Form ref={form}>
        <SelectWithRefresh
          name="network_id"
          placeholder="请选择网络配置"
          validateOnChange
          label={<AffixLabel required>网络配置</AffixLabel>}
          value={networkId}
          onChange={setNetworkId}
          help={
            <div>
              <div>
                <span tw="mr-0.5">详情请见</span>
                <HelpCenterLink href={networkLink} isIframe={false}>
                  网络配置选择说明文档
                </HelpCenterLink>
              </div>
              <div>
                <span tw="mr-0.5">
                  选择网络后可测试对应此网络的数据源可用性，如需选择新的网络配置，您可
                </span>
                <span
                  tw="text-green-11 cursor-pointer"
                  onClick={() => setNetWorkOp('create')}
                >
                  绑定VPC
                </span>
              </div>
            </div>
          }
          onRefresh={refreshNetworks}
          options={networks.map(({ name, id }) => ({
            label: name,
            value: id,
          }))}
          searchable={false}
          schemas={[
            {
              rule: {
                required: true,
              },
              help: (
                <div>
                  <div>
                    <span tw="text-error">请先选择网络配置，</span>
                    <span tw="text-neut-8 mr-0.5">详情请见</span>
                    <HelpCenterLink href={networkLink} isIframe={false}>
                      网络配置选择说明文档
                    </HelpCenterLink>
                  </div>
                  <div>
                    <span tw="text-neut-8 mr-0.5">
                      选择网络后可测试对应此网络的数据源可用性，如需选择新的网络配置，您可
                    </span>
                    <span
                      tw="text-green-11 cursor-pointer"
                      onClick={() => setNetWorkOp('create')}
                    >
                      绑定VPC
                    </span>
                  </div>
                </div>
              ),
              status: 'error',
            },
          ]}
        />
      </Form>
    </Modal>
  )
}

export default DataSourcePingCreateModal
