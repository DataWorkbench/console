import { useState } from 'react'
import { Modal, Icon } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import { HelpCenterLink } from 'components'
import tw, { styled, css } from 'twin.macro'
import ClusterTable from './ClusterTable'

const Alert = styled('div')(() => [
  tw`flex items-center mb-7 text-blue-10 bg-blue-10! bg-opacity-10 py-2 pl-2 rounded-sm border border-blue-10 border-opacity-50`,
  css`
    svg {
      ${tw`text-white fill-[#2193D3]`}
    }
  `,
])

const ClusterTableModal = ({
  onCancel,
  onOk,
}: {
  onCancel?: () => void
  onOk?: (cluster) => void
}) => {
  const [cluster, setCluster] = useState(null)
  return (
    <Modal
      visible
      draggable
      width={1200}
      onCancel={onCancel}
      title="选择计算集群"
      onOk={() => {
        if (onOk) {
          onOk(cluster)
        }
      }}
    >
      <Alert>
        <Icon name="information" size={20} tw="mr-1.5" />
        请选择运行当前作业的计算集群，请注意保证网络联通性，具体可参考：
        <HelpCenterLink
          isIframe={false}
          href="/bigdata/dataplat/quickstart/create_net/"
        >
          网络联通文档
        </HelpCenterLink>
      </Alert>
      <ClusterTable
        selectMode
        onSelect={(clusters) => {
          setCluster(get(clusters, '[0]'))
        }}
      />
    </Modal>
  )
}

export default ClusterTableModal
