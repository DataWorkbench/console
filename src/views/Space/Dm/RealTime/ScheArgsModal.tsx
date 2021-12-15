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
import { flatten, get } from 'lodash-es'
import {
  useMutationStreamJobArgs,
  useQueryResource,
  useQueryStreamJobArgs,
} from 'hooks'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { ScheForm } from './styled'

const { CollapseItem } = Collapse
const { NumberField, SelectField } = Form

interface ResourceSelectProps {
  type: number
  [propName: string]: any
}
const ResourceSelect = (props: ResourceSelectProps) => {
  const { type } = props
  const [filter] = useImmer<{
    limit: number
    offset: number
    resource_type: number
  }>({
    limit: 15,
    offset: 0,
    resource_type: type,
  })

  const v = useQueryResource(filter)
  const { status, data, fetchNextPage, hasNextPage } = v
  const options = flatten(
    data?.pages.map((page: Record<string, any>) => page.infos || [])
  )

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  return (
    <SelectField
      {...props}
      options={options}
      isLoading={status === 'loading'}
      isLoadingAtBottom
      onMenuScrollToBottom={loadData}
      bottomTextVisible
      valueKey="resource_id"
      labelKey="name"
    />
  )
}

const ScheArgsModal = ({ onCancel }: { onCancel: () => void }) => {
  const [params, setParams] = useImmer({
    clusterId: 'eng-0000000000000000',
    udfs: [] as string[],
    connectors: [] as string[],
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
      draft.udfs = get(data, 'udfs', [])
      draft.connectors = get(data, 'connectors', [])
    })
  }, [data, setParams])

  const save = () => {
    mutation.mutate(
      {
        cluster_id: params.clusterId,
        connectors: params.connectors,
        udfs: params.udfs,
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
          <Collapse defaultActiveKey={['p1']}>
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
                <ResourceSelect
                  name="udf"
                  label="依赖包"
                  value={params.connectors}
                  multi
                  closeOnSelect={false}
                  onChange={(connectors: string[]) =>
                    setParams((draft) => {
                      draft.connectors = connectors
                    })
                  }
                  type={3}
                />
                <ResourceSelect
                  name="函数包"
                  label="函数包"
                  multi
                  closeOnSelect={false}
                  value={params.udfs}
                  onChange={(udfs: string[]) =>
                    setParams((draft) => {
                      draft.udfs = udfs
                    })
                  }
                  type={2}
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
