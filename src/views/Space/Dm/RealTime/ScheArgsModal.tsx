import { useEffect } from 'react'
import { DarkModal, FlexBox } from 'components'
import { Icon, Form, Collapse, Loading } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import { get, flatten } from 'lodash-es'
import {
  useMutationStreamJobArgs,
  useQueryStreamJobArgs,
  useQueryInfiniteFlinkClusters,
} from 'hooks'
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

  const mutation = useMutationStreamJobArgs()
  const { data, isFetching } = useQueryStreamJobArgs()
  const clustersRet = useQueryInfiniteFlinkClusters({
    filter: { limit: 50, status: 1 },
  })

  const clusters = flatten(
    clustersRet.data?.pages.map((page) => page.infos || [])
  )

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
                <Icon name="record" tw="(relative top-0 left-0)!" type="dark" />
                <span>基础设置</span>
              </FlexBox>
            }
          >
            <ScheForm layout="horizon">
              <SelectField
                name="clusters"
                label="计算集群"
                value={params.clusterId}
                onChange={(v: string) => {
                  setParams((draft) => {
                    draft.clusterId = v
                  })
                }}
                options={clusters.map(({ id, name }) => ({
                  value: id,
                  label: name,
                }))}
                schemas={[
                  {
                    rule: { required: true },
                    help: '请选择计算集群',
                    status: 'error',
                  },
                ]}
                isLoadingAtBottom
                searchable={false}
                onMenuScrollToBottom={() => {
                  if (clustersRet.hasNextPage) {
                    clustersRet.fetchNextPage()
                  }
                }}
                bottomTextVisible
                // options={[
                //   {
                //     label: 'eng-0000000000000000',
                //     value: 'eng-0000000000000000',
                //   },
                // ]}
                help={
                  <div>
                    如需选择新的集群，可以在计算集群
                    <a href="###" tw="text-green-13">
                      创建集群
                    </a>
                  </div>
                }
              />
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
                <Icon name="clock" tw="(relative top-0 left-0)!" type="light" />
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
  )
}

export default ScheArgsModal
