import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react'
import {
  DarkModal,
  FlexBox,
  TextHighlight,
  Icons,
  HelpCenterLink,
} from 'components'
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
  useQueryUdf,
  useQueryStreamJobArgs,
  useStore,
} from 'hooks'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import tw, { css } from 'twin.macro'
import { ScheForm } from './styled'

const { CollapseItem } = Collapse
const { NumberField, SelectField } = Form

interface ResourceSelectProps {
  type: number
  icon: ReactElement
  isUdf?: boolean
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
  const { icon, isUdf = false } = props
  const [filter, setFilter] = useImmer<{
    limit: number
    offset: number
    udf_type?: number
    search: string
  }>({
    limit: 15,
    offset: 0,
    search: '',
    // ...(isUdf ? { udf_type: type } : { type }),
  })

  const fn = !isUdf ? useQueryResource : useQueryUdf
  const key = !isUdf ? 'id' : 'udf_id'
  const v = fn(filter)
  const { status, data, fetchNextPage, hasNextPage } = v
  const options = flatten(
    data?.pages.map((page: Record<string, any>) => page.infos || [])
  ).map((i) => {
    return {
      label: (
        <Fragment key={i[key]}>
          {renderLabel(i.name, icon, filter.search)}
          <span tw="text-neut-8">ID:{i[key]}</span>
        </Fragment>
      ),
      value: i[key],
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
    connectors: [] as string[],
    parallelism: 0,
    builtInConnectors: [] as string[],
  })
  const [showCluster, setShowCluster] = useState(false)
  const [cluster, setCluster] = useState(null)
  const [showMsg, setShowMsg] = useState(false)

  const mutation = useMutationStreamJobArgs()
  const { data, isFetching } = useQueryStreamJobArgs()

  const {
    workFlowStore: { curJob },
  } = useStore()

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
      draft.files = get(data, 'files', [])
      draft.connectors = get(data, 'connectors', [])
      draft.builtInConnectors = get(data, 'built_in_connectors', [])
    })
  }, [data, setParams])

  const onFilterConnectors = (_input: string) => {
    const input = _input.toLowerCase()
    setConnectorsKeyword(input)
  }
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
        title="??????????????????"
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
                  <span>????????????</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <Field>
                  <Label tw="label-required">????????????</Label>
                  <Control>
                    <>
                      <Button
                        onClick={() => {
                          setShowCluster(true)
                          setShowMsg(true)
                        }}
                        type={
                          showMsg && !params.clusterId ? 'outlined' : 'default'
                        }
                        css={[
                          showMsg && !params.clusterId
                            ? tw`border-red-10! border`
                            : '',
                        ]}
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

                          return params.clusterId || '????????????'
                        })()}
                      </Button>
                    </>
                  </Control>
                  {showMsg && !params.clusterId && (
                    <div className="help is-danger has-danger-help">
                      ???????????????
                    </div>
                  )}
                </Field>
                <NumberField
                  isMini
                  min={1}
                  labelClassName="label-required"
                  max={100}
                  name="id"
                  label="?????????"
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
                  <span>????????????</span>
                </FlexBox>
              }
            >
              <ScheForm layout="horizon">
                <ResourceSelect
                  name="connectors"
                  label="????????????"
                  icon={<Icons name="icon_dependency" />}
                  placeholder={
                    curJob?.type === 2
                      ? '????????????????????????????????????????????? connector ???'
                      : '?????????????????????????????????'
                  }
                  value={params.files}
                  multi
                  closeOnSelect={false}
                  onChange={(files: string[]) =>
                    setParams((draft) => {
                      draft.files = files
                    })
                  }
                  type={3}
                />
                {curJob?.type === 2 && false && (
                  <SelectField
                    clearable
                    name="builtInConnectors"
                    label="?????? Connector"
                    placeholder="??????????????????????????? Connector ???"
                    multi
                    searchable
                    css={css`
                      .select-control {
                        ${tw`w-[620px]`}
                      }
                    `}
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
                    help={
                      <div>
                        ???????????????
                        <HelpCenterLink
                          href="/developer_sql/summary/"
                          isIframe={false}
                        >
                          ????????????
                        </HelpCenterLink>
                      </div>
                    }
                  />
                )}
              </ScheForm>
            </CollapseItem>
          </Collapse>
        </Loading>
      </DarkModal>
      <div css={!showCluster && tw`hidden`}>
        <ClusterTableModal
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
      </div>
    </>
  )
}

export default ScheArgsModal
