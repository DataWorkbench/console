import { useEffect, useState } from 'react'
import { DarkModal, FlexBox } from 'components'
import {
  Icon,
  Form,
  Collapse,
  Loading,
  Field,
  Label,
  Control,
} from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import { useMutationStreamJobArgs, useQueryStreamJobArgs } from 'hooks'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { ScheForm } from './styled'

const { CollapseItem } = Collapse
const { NumberField, SelectField } = Form

const ScheArgsModal = ({ onCancel }: { onCancel: () => void }) => {
  const [params, setParams] = useImmer({
    clusterId: 'eng-0000000000000000',
    udf_ids: [],
    udtf_ids: [],
    udttf_ids: [],
    parallelism: 0,
  })
  const [show, setShow] = useState(false)
  const [cluster, setCluster] = useState(null)

  const mutation = useMutationStreamJobArgs()
  const { data, isFetching } = useQueryStreamJobArgs()

  useEffect(() => {
    setParams((draft) => {
      draft.clusterId = get(data, 'cluster_id', '')
      draft.parallelism = get(data, 'parallelism', 0)
      draft.udf_ids = get(data, 'function.udf_ids', [])
      draft.udtf_ids = get(data, 'function.udtf_ids', [])
      draft.udttf_ids = get(data, 'function.udttf_ids', [])
    })
  }, [data, setParams])

  const save = () => {
    mutation.mutate(
      {
        cluster_id: params.clusterId,
        function: {
          udf_ids: params.udf_ids,
          udtf_ids: params.udtf_ids,
          udttf_ids: params.udttf_ids,
        },
        parallelism: params.parallelism,
      },
      {
        onSuccess: () => {
          if (onCancel) {
            onCancel()
          }
        },
      }
    )
  }
  return (
    <>
      <DarkModal
        orient="fullright"
        onCancel={onCancel}
        title="运行参数配置"
        width={800}
        visible
        onOk={save}
        confirmLoading={mutation.isLoading}
      >
        <Loading spinning={isFetching}>
          <Collapse defaultActiveKey={['p1', 'p2']}>
            <CollapseItem
              key="p1"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="dark"
                  />
                  <span>基础设置</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <Field>
                  <Label>计算集群</Label>
                  <Control>
                    <Button onClick={() => setShow(true)}>
                      <Icon name="pod" />
                      {(() => {
                        if (cluster) {
                          return (
                            <>
                              {cluster.name}
                              <span tw="text-neut-8">({cluster.id})</span>
                            </>
                          )
                        }

                        return params.clusterId || '选择集群'
                      })()}
                    </Button>
                  </Control>
                </Field>
                <NumberField
                  isMini
                  min={0}
                  max={100}
                  name="id"
                  label="并行度"
                  value={params.parallelism}
                  onChange={(v: number) => {
                    setParams((draft) => {
                      draft.parallelism = v
                    })
                  }}
                />
              </ScheForm>
            </CollapseItem>
            <CollapseItem
              key="p2"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon
                    name="clock"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>函数配置</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <SelectField
                  name="udf"
                  label="UDF"
                  value={params.udf_ids}
                  multi
                  closeOnSelect={false}
                  options={[]}
                />
                <SelectField
                  name="udtf"
                  label="UDTF"
                  multi
                  closeOnSelect={false}
                  value={params.udtf_ids}
                  options={[]}
                />
                <SelectField
                  name="udttf"
                  label="UDTTF"
                  multi
                  closeOnSelect={false}
                  value={params.udttf_ids}
                  options={[]}
                />
              </ScheForm>
            </CollapseItem>
          </Collapse>
        </Loading>
      </DarkModal>
      {show && (
        <ClusterTableModal
          onCancel={() => setShow(false)}
          onOk={(clusterItem) => {
            if (clusterItem) {
              setCluster(clusterItem)
              setParams((draft) => {
                draft.clusterId = clusterItem.id
              })
            }
            setShow(false)
          }}
        />
      )}
    </>
  )
}

export default ScheArgsModal
