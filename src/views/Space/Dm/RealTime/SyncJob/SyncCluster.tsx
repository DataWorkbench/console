import { Form, Icon } from '@QCFE/lego-ui'
import { AffixLabel, ButtonWithClearField } from 'components'
import { get, isEmpty } from 'lodash-es'
import { useState } from 'react'
import tw, { css } from 'twin.macro'
import ClusterTableModal from '../../Cluster/ClusterTableModal'

const SyncCluster = () => {
  const [visible, setVisible] = useState(false)
  const [cluster, setCluster] = useState(null)
  const clusterId = get(cluster, 'id', '')
  const clusterName = get(cluster, 'name', '')
  return (
    <>
      <Form
        tw="pl-0!"
        css={css`
          &.form .label {
            ${tw`w-[132px]!`}
          }
        `}
      >
        <ButtonWithClearField
          clearable={!!cluster}
          name="cluster"
          icon={
            <Icon
              name="pod"
              size={16}
              color={{ secondary: 'rgba(255,255,255,0.4)' }}
            />
          }
          value={clusterId}
          placeholder="选择集群"
          onClick={() => setVisible(true)}
          onClear={() => setCluster(null)}
          label={<AffixLabel>计算集群</AffixLabel>}
        >
          {clusterName}
        </ButtonWithClearField>

        <ButtonWithClearField
          clearable={false}
          name="connection"
          icon={
            <Icon
              name="pod"
              size={16}
              color={{ secondary: 'rgba(255,255,255,0.4)' }}
            />
          }
          placeholder="连通性测试"
          label={
            <AffixLabel help="more" theme="green">
              计算集群连通性
            </AffixLabel>
          }
        />
      </Form>
      <ClusterTableModal
        visible={visible}
        onOk={(v) => {
          setCluster(v)
          setVisible(false)
        }}
        selectedIds={isEmpty(clusterId) ? [] : [clusterId]}
        onCancel={() => setVisible(false)}
      />
    </>
  )
}

export default SyncCluster
