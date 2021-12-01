import { useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import ClusterTable from './ClusterTable'

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
      onOk={() => {
        if (onOk) {
          onOk(cluster)
        }
      }}
    >
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
