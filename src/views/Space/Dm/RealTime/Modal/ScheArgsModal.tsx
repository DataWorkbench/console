import { Fragment, ReactElement, useEffect, useState } from 'react'
import { DarkModal, FlexBox, TextHighlight, Icons } from 'components'
import { Icon, Form, Collapse, Loading, Field, Label, Control } from '@QCFE/lego-ui'
import { Button } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { flatten, get } from 'lodash-es'
import {
  useMutationStreamJobArgs,
  useQueryResource,
  useQueryUdf,
  useQueryStreamJobArgs,
  useStore
} from 'hooks'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import tw, { css } from 'twin.macro'
import { ScheForm } from '../styled'

const { CollapseItem } = Collapse
const { NumberField, SelectField } = Form

interface ResourceSelectProps {
  type: number
  icon: ReactElement
  isUdf?: boolean
  [propName: string]: any
}

const renderLabel = (label: string, icon: ReactElement, search: string) => (
  <FlexBox tw="items-center gap-1" key={label}>
    {icon}
    <TextHighlight key={label} text={label} filterText={search} />
  </FlexBox>
)

const renderReadOnlyOption = (label: string, icon: ReactElement, id?: string) => (
  <div tw="inline-flex items-center rounded-sm bg-neut-13 px-2 mr-1 tracking-wider text-2xs">
    {icon}
    <TextHighlight key={label} text={label} tw="ml-1" />
    <span tw="text-neut-8">ID: {id}</span>
  </div>
)

const ResourceOption = ({ files }: { files: string[] }) => {
  const { data } = useQueryResource({ limit: 100 })

  return (
    <div tw="w-[620px]">
      {flatten(data?.pages.map((page: Record<string, any>) => page.infos || []))
        .filter((i) => files.includes(i.id))
        .map((i) => renderReadOnlyOption(i.name, <Icons name="icon_dependency" />, i.id))}
    </div>
  )
}

const ResourceSelect = (props: ResourceSelectProps) => {
  const { icon, isUdf = false, type } = props
  const [filter, setFilter] = useImmer<{
    limit: number
    offset: number
    udf_type?: number
    search: string
  }>({
    limit: 15,
    offset: 0,
    search: '',
    ...(isUdf ? { udf_type: type } : { types: [type] })
  })

  const fn = !isUdf ? useQueryResource : useQueryUdf
  const key = !isUdf ? 'id' : 'udf_id'
  const v = fn(filter)
  const { status, data, fetchNextPage, hasNextPage } = v
  const options = flatten(data?.pages.map((page: Record<string, any>) => page.infos || [])).map(
    (i) => ({
      label: (
        <Fragment key={i[key]}>
          {renderLabel(i.name, icon, filter.search)}
          <span tw="text-neut-8">ID:{i[key]}</span>
        </Fragment>
      ),
      value: i[key]
    })
  )

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
      css={css`
        .select-control {
          ${tw`w-[620px]`}
        }
      `}
      clearable
      // valueKey="resource_id"
      // labelKey="name"
    />
  )
}

const ScheArgsModal = ({ onCancel }: { onCancel: () => void }) => {
  const [params, setParams] = useImmer({
    clusterId: '',
    files: [] as string[],
    pyFiles: [] as string[],
    connectors: [] as string[],
    parallelism: 0,
    builtInConnectors: [] as string[]
  })
  const [showCluster, setShowCluster] = useState(false)
  const [cluster, setCluster] = useState(null)
  const [showMsg, setShowMsg] = useState(false)

  const mutation = useMutationStreamJobArgs()
  const { data, isFetching } = useQueryStreamJobArgs()

  const {
    workFlowStore: { curJob, curVersion }
  } = useStore()

  useEffect(() => {
    setParams((draft) => {
      draft.clusterId = get(data, 'cluster_id', '')
      draft.parallelism = get(data, 'parallelism', 0)
      draft.files = get(data, 'files', [])
      draft.pyFiles = get(data, 'py_files', [])
      draft.connectors = get(data, 'connectors', [])
      draft.builtInConnectors = get(data, 'built_in_connectors', [])
    })
  }, [data, setParams])

  const save = () => {
    setShowMsg(true)
    if (!params.clusterId) {
      return
    }
    mutation.mutate(
      {
        cluster_id: params.clusterId,
        // connectors: params.connectors,
        files: params.files,
        py_files: params.pyFiles,
        parallelism: params.parallelism,
        built_in_connectors: params.builtInConnectors
      },
      {
        onSuccess: () => {
          if (onCancel) {
            onCancel()
          }
        }
      }
    )
  }

  const readOnly = !!curVersion
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
                  <Icon name="record" tw="(relative top-0 left-0)!" type="dark" />
                  <span>基础设置</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <Field>
                  <Label tw="label-required">计算集群</Label>
                  <Control>
                    {readOnly ? (
                      <span>{params.clusterId}</span>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setShowCluster(true)
                            setShowMsg(true)
                          }}
                          type={showMsg && !params.clusterId ? 'outlined' : 'default'}
                          css={[showMsg && !params.clusterId ? tw`border-red-10! border` : '']}
                        >
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
                      </>
                    )}
                  </Control>
                  {showMsg && !params.clusterId && (
                    <div className="help is-danger has-danger-help">请选择集群</div>
                  )}
                </Field>
                {readOnly ? (
                  <Field>
                    <Label tw="label-required">并行度</Label>
                    <Control>{params.parallelism}</Control>
                  </Field>
                ) : (
                  <NumberField
                    isMini
                    min={1}
                    labelClassName="label-required"
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
                )}
              </ScheForm>
            </CollapseItem>
            <CollapseItem
              key="p2"
              label={
                <FlexBox tw="items-center space-x-1">
                  <Icon name="record" tw="(relative top-0 left-0)!" type="light" />
                  <span>依赖资源</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                {readOnly ? (
                  <Field>
                    <Label>资源引用</Label>
                    <Control>
                      <ResourceOption files={params.files} />
                    </Control>
                  </Field>
                ) : (
                  <>
                    <ResourceSelect
                      name="connectors"
                      label="JAR 类型资源"
                      icon={<Icons name="icon_dependency" />}
                      placeholder={
                        curJob?.type === 2
                          ? '请选择运行所需的函数包及自定义 connector 包'
                          : '请选择运行所需依赖资源'
                      }
                      value={params.files}
                      multi
                      closeOnSelect={false}
                      onChange={(files: string[]) =>
                        setParams((draft) => {
                          draft.files = files
                        })
                      }
                      type={1}
                    />

                    <ResourceSelect
                      name="connectors"
                      label="Python 类型资源"
                      icon={<Icons name="icon_dependency" />}
                      placeholder={
                        curJob?.type === 2
                          ? '请选择运行所需的函数包及自定义 connector 包'
                          : '请选择运行所需依赖资源'
                      }
                      value={params.pyFiles}
                      multi
                      closeOnSelect={false}
                      onChange={(files: string[]) =>
                        setParams((draft) => {
                          draft.pyFiles = files
                        })
                      }
                      type={2}
                    />
                  </>
                )}
              </ScheForm>
            </CollapseItem>
          </Collapse>
        </Loading>
      </DarkModal>
      <ClusterTableModal
        flinkType={1}
        visible={showCluster}
        selectedIds={[params.clusterId]}
        onCancel={() => setShowCluster(false)}
        onOk={(clusterItem) => {
          if (clusterItem) {
            setCluster(clusterItem)
            setParams((draft) => {
              draft.clusterId = clusterItem.id
            })
          }
          setShowCluster(false)
        }}
      />
    </>
  )
}

export default ScheArgsModal
