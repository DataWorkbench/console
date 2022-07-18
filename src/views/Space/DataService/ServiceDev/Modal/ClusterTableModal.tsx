import { useState } from 'react'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import { HelpCenterLink, PortalModal } from 'components'
import tw, { styled, css } from 'twin.macro'
import ClusterTable from '../../Cluster/ClusterTable'

const Alert = styled('div')(() => [
  tw`flex items-center mb-7 text-blue-10 bg-blue-10! bg-opacity-10 py-2 pl-2 rounded-sm border border-blue-10 border-opacity-50`,
  css`
    svg {
      ${tw`text-white fill-[#2193D3]`}
    }
  `
])

const ClusterTableModal = ({
  onCancel,
  onOk,
  selectedIds = [],
  visible = true
}: {
  onCancel?: () => void
  onOk?: (cluster: any) => void
  selectedIds?: string[]
  visible?: boolean
}) => {
  const [cluster, setCluster] = useState(null)
  if (!visible) {
    return null
  }
  return (
    <PortalModal
      visible
      draggable
      width={1200}
      appendToBody
      css={!visible && tw`hidden!`}
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
        请选择运行当前作业的计算集群，请注意保证网络连通性，具体可参考：
        <HelpCenterLink href="/manual/data_up_cloud/connect/" isIframe={false}>
          网络连通文档
        </HelpCenterLink>
      </Alert>
      <ClusterTable
        selectMode
        selectedIds={selectedIds}
        onSelect={(clusters) => {
          console.log(clusters)

          setCluster(get(clusters, '[0]'))
        }}
      />
    </PortalModal>
  )
}

export default ClusterTableModal
