import { Button, Control, Field, Form, Icon, Label } from '@QCFE/lego-ui'
import { AffixLabel, ButtonWithClearField, FlexBox, Tooltip } from 'components'
import { get, isEmpty } from 'lodash-es'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import tw, { css, theme } from 'twin.macro'
import { useMutationPingSyncJobConnection } from 'hooks'
import { FormH7Wrapper } from 'views/Space/Dm/RealTime/styled'
import ClusterTableModal from '../../Cluster/ClusterTableModal'

interface SyncClusterProps {
  onChange?: (clusterId: string) => void
  sourceId?: string
  targetId?: string
  clusterId?: string
  defaultClusterName?: string
  flinkType?: number
}

const SyncCluster = forwardRef((props: SyncClusterProps, ref) => {
  const {
    onChange,
    sourceId,
    targetId,
    clusterId: clusterIdProps,
    defaultClusterName = '',
    flinkType
  } = props
  const [visible, setVisible] = useState(false)
  const [cluster, setCluster] = useState<{ id: string; name?: string } | null>()
  const clusterId = get(cluster, 'id', '')
  const clusterName = get(cluster, 'name', defaultClusterName)
  const enablePing = !!(sourceId && targetId && clusterId)
  const mutation = useMutationPingSyncJobConnection()
  useEffect(() => {
    if (clusterIdProps) {
      setCluster({ id: clusterIdProps })
    }
  }, [clusterIdProps])

  useImperativeHandle(ref, () => ({
    getCluster: () => cluster,
    checkPingSuccess: () => mutation.isSuccess
  }))

  const handlePingConnection = () => {
    if (!enablePing) {
      return
    }
    mutation.mutate({
      clusterId,
      sourceId,
      targetId
    })
  }

  return (
    <FormH7Wrapper>
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
          icon={<Icon name="pod" size={16} color={{ secondary: 'rgba(255,255,255,0.4)' }} />}
          value={clusterId}
          placeholder="选择集群"
          onClick={() => setVisible(true)}
          onClear={() => {
            setCluster(null)
            mutation.reset()
          }}
          label={<AffixLabel>计算集群</AffixLabel>}
        >
          {clusterName || clusterId}
        </ButtonWithClearField>
        {false && (
          <Field>
            <Label>
              <AffixLabel
                help="数据来源、数据目的、计算集群均选择完成后，可以测试连通性"
                theme="light"
              >
                计算集群连通性
              </AffixLabel>
            </Label>
            <Control tw="flex-wrap">
              <Tooltip
                disabled={enablePing}
                theme="light"
                content="数据来源、数据目的、计算集群均选择完成后，可以测试连通性"
                hasPadding
              >
                <Button
                  type="outlined"
                  loading={mutation.isLoading}
                  css={[tw`text-green-11!`, !enablePing && tw`cursor-not-allowed opacity-50`]}
                  onClick={() => {
                    if (enablePing) {
                      handlePingConnection()
                    }
                  }}
                >
                  连通性测试
                </Button>
              </Tooltip>
            </Control>
            {clusterId && mutation.isSuccess && (
              <FlexBox
                className="help"
                tw="w-full ml-[132px]! items-center text-green-11! space-x-0.5"
              >
                <Icon
                  name="clock"
                  size={16}
                  color={{
                    primary: theme('colors.transparent'),
                    secondary: theme('colors.green.11')
                  }}
                />
                <span>测试通过</span>
              </FlexBox>
            )}
          </Field>
        )}
      </Form>
      <ClusterTableModal
        visible={visible}
        onOk={(v) => {
          setCluster(v)
          setVisible(false)
          mutation.reset()
          if (onChange) {
            onChange(v)
          }
        }}
        flinkType={flinkType}
        selectedIds={isEmpty(clusterId) ? [] : [clusterId]}
        onCancel={() => setVisible(false)}
      />
    </FormH7Wrapper>
  )
})

export default SyncCluster
