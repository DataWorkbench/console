import { Button, Control, Field, Form, Icon, Label } from '@QCFE/lego-ui'
import { AffixLabel, ButtonWithClearField } from 'components'
import { get, isEmpty } from 'lodash-es'
import { forwardRef, useImperativeHandle, useState } from 'react'
import tw, { css } from 'twin.macro'
import ClusterTableModal from '../../Cluster/ClusterTableModal'

interface SyncClusterProps {
  onChange?: (clusterId: string) => void
}

const SyncCluster = forwardRef((props: SyncClusterProps, ref) => {
  const { onChange } = props
  const [visible, setVisible] = useState(false)
  const [cluster, setCluster] = useState(null)
  const clusterId = get(cluster, 'id', '')
  const clusterName = get(cluster, 'name', '')

  useImperativeHandle(ref, () => ({
    getCluster: () => cluster,
  }))

  const handleConnection = () => {}

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
        <Field>
          <Label>
            <AffixLabel help="more" theme="green">
              计算集群连通性
            </AffixLabel>
          </Label>
          <Control>
            <Button
              type="outlined"
              tw="text-green-11!"
              onClick={handleConnection}
            >
              连通性测试
            </Button>
          </Control>
        </Field>
      </Form>
      <ClusterTableModal
        visible={visible}
        onOk={(v) => {
          setCluster(v)
          setVisible(false)
          if (onChange) {
            onChange(v)
          }
        }}
        selectedIds={isEmpty(clusterId) ? [] : [clusterId]}
        onCancel={() => setVisible(false)}
      />
    </>
  )
})

export default SyncCluster
