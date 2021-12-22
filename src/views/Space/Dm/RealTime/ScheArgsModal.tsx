import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react'
import { DarkModal, FlexBox, TextHighlight, Icons } from 'components'
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
  useQueryInConnectorsQuery,
  useQueryResource,
  useQueryStreamJobArgs,
} from 'hooks'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { theme } from 'twin.macro'
import { ScheForm } from './styled'

const { CollapseItem } = Collapse
const { NumberField, SelectField } = Form

interface ResourceSelectProps {
  type: number
  icon: ReactElement
  [propName: string]: any
}

const renderLabel = (label: string, icon: ReactElement, search: string) => {
  return (
    <FlexBox tw="items-center gap-1" key={label}>
      {icon}
      <TextHighlight key={label} text={label} filterText={search} />
    </FlexBox>
  )
}

const ResourceSelect = (props: ResourceSelectProps) => {
  const { type, icon } = props
  const [filter, setFilter] = useImmer<{
    limit: number
    offset: number
    resource_type: number
    search: string
  }>({
    limit: 15,
    offset: 0,
    resource_type: type,
    search: '',
  })

  const v = useQueryResource(filter)
  const { status, data, fetchNextPage, hasNextPage } = v
  const options = flatten(
    data?.pages.map((page: Record<string, any>) => page.infos || [])
  ).map((i) => {
    return {
      label: (
        <Fragment key={i.resource_id}>
          {renderLabel(i.name, icon, filter.search)}
          <span tw="text-neut-8">ID:{i.resource_id}</span>
        </Fragment>
      ),
      value: i.resource_id,
    }
  })

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const onSearch = (_search: string) => {
    setFilter((_) => {
      _.offset = 0
      _.search = _search.toLowerCase()
    })
  }

  return (
    <SelectField
      {...props}
      options={options}
      multi
      searchable
      closeOnSelect={false}
      openOnClick
      isLoading={status === 'loading'}
      isLoadingAtBottom
      onMenuScrollToBottom={loadData}
      onInputChange={onSearch}
      bottomTextVisible
      // valueKey="resource_id"
      // labelKey="name"
    />
  )
}

const ScheArgsModal = ({ onCancel }: { onCancel: () => void }) => {
  const [params, setParams] = useImmer({
    clusterId: 'eng-0000000000000000',
    udfs: [] as string[],
    connectors: [] as string[],
    parallelism: 0,
    builtInConnectors: [] as string[],
  })
  const [show, setShow] = useState(false)
  const [cluster, setCluster] = useState(null)

  const mutation = useMutationStreamJobArgs()
  const { data, isFetching } = useQueryStreamJobArgs()

  const [connectorsKeyword, setConnectorsKeyword] = useState('')
  const { isFetching: conIsFetching, data: builtInConnectorsRes } =
    useQueryInConnectorsQuery()
  const builtInConnectors = useMemo(
    () =>
      !conIsFetching && builtInConnectorsRes.ret_code === 0
        ? builtInConnectorsRes?.items
            .filter((i: string) => i.indexOf(connectorsKeyword) !== -1)
            .map((i: string) => ({
              value: i,
              label: renderLabel(
                i,
                <Icons name="connector" />,
                connectorsKeyword
              ),
            })) || []
        : [],
    [builtInConnectorsRes, conIsFetching, connectorsKeyword]
  )

  useEffect(() => {
    setParams((draft) => {
      draft.clusterId = get(data, 'cluster_id', '')
      draft.parallelism = get(data, 'parallelism', 0)
      draft.udfs = get(data, 'udfs', [])
      draft.connectors = get(data, 'connectors', [])
      draft.builtInConnectors = get(data, 'built_in_connectors', [])
    })
  }, [data, setParams])

  const onFilterConnectors = (_input: string) => {
    const input = _input.toLowerCase()
    setConnectorsKeyword(input)
  }
  const save = () => {
    mutation.mutate(
      {
        cluster_id: params.clusterId,
        connectors: params.connectors,
        udfs: params.udfs,
        parallelism: params.parallelism,
        built_in_connectors: params.builtInConnectors,
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
                    name="record"
                    tw="(relative top-0 left-0)!"
                    type="light"
                  />
                  <span>依赖资源</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <ResourceSelect
                  name="connectors"
                  label="依赖包"
                  icon={<Icons name="dependency" />}
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
                  name="udfs"
                  label="函数包"
                  icon={
                    <Icon
                      name="terminal"
                      size={20}
                      type="light"
                      color={{
                        secondary: theme('colors.green')[11],
                        primary: theme('colors.green')[4],
                      }}
                      tw="bg-transparent!"
                    />
                  }
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
                <SelectField
                  name="builtInConnectors"
                  label="内置 connectors"
                  multi
                  searchable
                  closeOnSelect={false}
                  openOnClick
                  onInputChange={onFilterConnectors}
                  value={params.builtInConnectors}
                  onChange={(_builtInConnectors: string[]) =>
                    setParams((draft) => {
                      draft.builtInConnectors = _builtInConnectors
                    })
                  }
                  options={builtInConnectors || []}
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
