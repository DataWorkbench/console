import { useMemo, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import {
  AffixLabel,
  Modal,
  ModalContent,
  ModalStep,
  SelectTreeField,
  HelpCenterLink,
  Center
} from 'components'
import { Button, Form, Icon } from '@QCFE/qingcloud-portal-ui'
import { cloneDeep, get } from 'lodash-es'
import { useWindowSize } from 'react-use'
import tw, { css, styled } from 'twin.macro'
import { TreeNodeProps } from 'rc-tree'
import { observer } from 'mobx-react-lite'
import {
  useFetchJob,
  useMutationStreamJob,
  useMutationSyncJobConf1,
  useMutationSyncJobConvert,
  useStore
} from 'hooks'
import { Control, Field, Label } from '@QCFE/lego-ui'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { nameMatchRegex, strlen } from 'utils/convert'
import {
  RealTimeRadioGroupField,
  RealTimeSyncTypeVal
} from 'views/Space/Dm/RealTime/Sync/RealTimeRadioGroup'
// import { sourceTypes } from 'views/Space/Ops/DataIntegration/constants'
import { SourceType } from 'views/Space/Upcloud/DataSourceList/constant'
import { JobModeItem } from './JobModeItem'
import {
  filterFolderOfTreeData,
  getDataSourceTypes,
  getDiJobType,
  getJobMode,
  getNewTreeData,
  isRootNode,
  JobMode,
  jobModeData,
  JobType,
  renderIcon,
  renderSwitcherIcon,
  SyncJobType
} from '../Job/JobUtils'
import { SyncTypeRadioGroupField, SyncTypeVal } from '../Sync/SyncTypeRadioGroup'

const { TextField, TextAreaField } = Form

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-[668px]`}
    .form {
      ${tw`pl-0`}
      &.is-horizon-layout>.field {
        > .label {
          ${tw`w-28`}
        }
        > .control {
          ${tw`flex-1 max-w-[556px]`}
          .select {
            ${tw`w-full`}
          }
          .textarea {
            ${tw`w-[556px] max-w-[556px]`}
          }
        }
        > .help {
          ${tw`w-full  ml-28`}
        }
      }
    }
  `
])

export interface JobModalData {
  id: string
  pid: string
  jobMode: JobMode
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}

interface JobModalProps {
  isEdit?: boolean
  jobType?: JobType
  jobNode?: TreeNodeProps
  onClose?: (data?: JobModalData) => void
}

export const JobModal = observer((props: JobModalProps) => {
  const { isEdit = false, jobType = JobType.OFFLINE, jobNode, onClose } = props
  const fetchJob = useFetchJob()
  const {
    workFlowStore,
    workFlowStore: { treeData, loadedKeys }
  } = useStore()
  const form = useRef<Form>(null)
  const [showCluster, setShowCluster] = useState(false)
  const [cluster, setCluster] = useState(null)
  const [pNode, setPNode] = useState<Record<string, any>>()
  const { width: winWidth } = useWindowSize()
  const [params, setParams] = useImmer(() => {
    const jobMode = isEdit ? get(jobNode, 'jobMode') : getJobMode(jobType)
    let type = jobType
    if (isEdit && jobMode === JobMode.DI) {
      type = getDiJobType(get(jobNode, 'job.type'))
    }
    return {
      step: !isEdit && !jobNode ? 0 : 1,
      jobMode,
      jobType: type,
      pid: jobNode ? get(jobNode, isEdit ? 'pid' : 'key') : '',
      job: isEdit ? get(jobNode, 'job') : null,
      realTimeInfo: {
        targetType: '',
        sourceType: ''
      },
      syncTypeInfo: {
        type: 'full',
        fullSource: '',
        fullSink: '',
        incrSource: '',
        incrSink: ''
      } as SyncTypeVal
    }
  })

  // useEffect(() => {
  //   if (!isEdit && !jobNode) {
  //     setParams((draft) => {
  //       draft.step = 0
  //     })
  //   }
  // }, [isEdit, jobNode, setParams])

  const { job } = params
  const mutation = useMutationStreamJob()

  // useEffect(() => {
  //   if (jobType) {
  //     setParams((draft) => {
  //       draft.jobMode = getJobMode(jobType)
  //     })
  //   }
  // }, [jobType, setParams])

  const fetchJobTreeData = (node: any) => {
    const tp = params.jobMode === JobMode.DI ? 'sync' : 'stream'
    return fetchJob(tp, {
      pid: isRootNode(node.key) ? '' : node.key
    }).then((data) => {
      const jobs = get(data, 'infos') || []
      const newTreeData = getNewTreeData(treeData, node, jobs)
      workFlowStore.set({
        treeData: newTreeData,
        loadedKeys: [...loadedKeys, node.key]
      })
    })
  }

  const handleItemClick = ({ mode }, type) => {
    setParams((draft) => {
      draft.jobMode = mode
      draft.jobType = type
    })
  }

  const handleTypeItemChange = (type: any) => {
    setParams((draft) => {
      draft.jobType = type
    })
  }

  const mutationConvert = useMutationSyncJobConvert()
  const mutationSyncJob = useMutationSyncJobConf1()
  const handleNext = () => {
    if (params.step === 0) {
      setParams((draft) => {
        draft.step = 1
      })
    } else if (form.current?.validateForm()) {
      const fields = form.current.getFieldsValue()
      const {
        syncTypeInfo,
        realTimeInfo,
        ...rest
      }: { syncTypeInfo: SyncTypeVal; realTimeInfo: RealTimeSyncTypeVal } = fields
      const data: any = {
        op: isEdit ? 'edit' : 'create',
        jobMode: params.jobMode,
        ...rest
      }
      if (isEdit) {
        data.jobId = job.id
      } else {
        data.type = params.jobType
        data.is_directory = false
        data.pid = isRootNode(fields.pid) ? '' : fields.pid
        if (cluster) {
          data.cluster_id = get(cluster, 'id')
        }
        if (params.jobMode === JobMode.RT) {
          data.type = params.jobType
        } else if (params.jobMode === JobMode.DI && params.jobType === JobType.OFFLINE) {
          data.type =
            syncTypeInfo.type === 'full' ? SyncJobType.OFFLINEFULL : SyncJobType.OFFLINEINCREMENT

          if (syncTypeInfo.type === 'full') {
            data.source_type = syncTypeInfo.fullSource
            data.target_type = syncTypeInfo.fullSink
          } else {
            data.source_type = syncTypeInfo.incrSource
            data.target_type = syncTypeInfo.incrSink
          }
        } else if (params.jobMode === JobMode.DI && params.jobType === JobType.REALTIME) {
          data.type = SyncJobType.REALTIME
          data.source_type = realTimeInfo.sourceType
          data.target_type = realTimeInfo.targetType
        }
      }
      mutation.mutateAsync(data).then((ret) => {
        const close = () => {
          onClose?.({
            id: ret.id as string,
            pid: String(data.pid),
            pNode,
            jobMode: params.jobMode,
            type: data.type,
            isEdit
          })
        }
        if (data.target_type === SourceType.Oracle || data.source_type === SourceType.Oracle) {
          const isReal = params.jobMode === JobMode.DI && params.jobType === JobType.REALTIME
          mutationConvert
            .mutateAsync({
              data: {
                conf: {
                  sync_resource: {
                    [`${(
                      getDataSourceTypes(data.source_type, isReal) as any
                    )?.toLowerCase()}_source`]: {},
                    [`${(
                      getDataSourceTypes(data.target_type, isReal) as any
                    )?.toLowerCase()}_target`]: {}
                  },
                  job_content: '',
                  job_mode: 1
                }
              },
              uri: { job_id: ret?.id! }
            })
            .then((res) => {
              return mutationSyncJob.mutateAsync({
                jobId: ret?.id!,
                job_mode: 2,
                job_content: res?.job
              })
            }, close)
            .finally(close)
        } else {
          close()
        }

        // onClose?.({
        //   id: ret.id as string,
        //   pid: String(data.pid),
        //   pNode,
        //   jobMode: params.jobMode,
        //   type: data.type,
        //   isEdit
        // })
      })
    }
  }

  const isXl = winWidth >= 1280
  const modalWidth = useMemo(() => {
    if (params.step === 0) {
      return 850
    }
    if (job && params.jobMode === JobMode.RT) {
      return 700
    }
    return isXl ? 1200 : 900
  }, [isXl, job, params.jobMode, params.step])
  return (
    <>
      <Modal
        visible
        title={`${job ? '修改' : '创建'}作业`}
        width={modalWidth}
        maskClosable={false}
        appendToBody
        draggable
        onCancel={onClose}
        footer={
          <div tw="flex justify-end space-x-2">
            {params.step === 0 || job ? (
              <Button onClick={() => onClose?.()}>取消</Button>
            ) : (
              <Button
                onClick={() =>
                  setParams((draft) => {
                    draft.step = 0
                  })
                }
              >
                上一步
              </Button>
            )}
            <Button
              type="primary"
              loading={mutation.isLoading}
              onClick={handleNext}
              // disabled={params.jobType === JobType.REALTIME}
            >
              {params.step === 0 ? '下一步' : '确定'}
            </Button>
          </div>
        }
      >
        <>
          {!job && (
            <ModalStep
              step={params.step}
              sameLine
              stepTexts={['选择模式', '填写信息']}
              stepClassName={tw`w-80`}
            />
          )}
          <ModalContent>
            <div css={params.step !== 0 && tw`hidden`}>
              <div tw="mb-4 text-sm leading-6">请选择您要进行作业开发的模式：</div>
              <div tw="flex justify-between space-x-3 2xl:space-x-5 mb-5">
                {jobModeData.map((modeItem) => {
                  const selected = params.jobMode === modeItem.mode
                  let defaultType: string | number = -1
                  if (modeItem.mode === JobMode.DI) {
                    defaultType = JobType.OFFLINE
                  } else if (modeItem.mode === JobMode.RT) {
                    defaultType = JobType.SQL
                  }
                  if (selected) {
                    defaultType = params.jobType
                  }
                  return (
                    <JobModeItem
                      key={modeItem.mode}
                      jobModeData={modeItem}
                      defaultType={defaultType}
                      selected={selected}
                      disabled={modeItem.mode === JobMode.OLE}
                      onClick={handleItemClick}
                      onTypeItemChange={handleTypeItemChange}
                    />
                  )
                })}
              </div>
            </div>
            {params.step === 1 && (
              <div css={[tw`flex justify-center mb-10`]}>
                <FormWrapper>
                  <Form layout="horizon" ref={form}>
                    {params.jobMode === JobMode.DI && (
                      <>
                        <Field>
                          <Label>
                            <AffixLabel>开发模式</AffixLabel>
                          </Label>
                          <Control>
                            {params.jobType === JobType.OFFLINE && <span>数据集成-离线同步</span>}
                            {params.jobType === JobType.REALTIME && <span>数据集成-实时同步</span>}
                          </Control>
                        </Field>
                        {!isEdit && params.jobType === JobType.REALTIME && (
                          <Field>
                            <Label>
                              <AffixLabel>同步类型</AffixLabel>
                            </Label>
                            <Control>
                              <span>实时同步</span>
                            </Control>
                          </Field>
                        )}

                        {!isEdit && params.jobType === JobType.OFFLINE && (
                          <SyncTypeRadioGroupField
                            css={css`
                              .label {
                                ${tw`items-start!`}
                              }
                            `}
                            label={<AffixLabel>同步类型</AffixLabel>}
                            name="syncTypeInfo"
                            value={params.syncTypeInfo}
                            onChange={(v: SyncTypeVal) => {
                              setParams((draft) => {
                                draft.syncTypeInfo = v
                              })
                            }}
                            validateOnChange
                            schemas={[
                              {
                                rule: (value: SyncTypeVal) => {
                                  if (
                                    (value.type === 'full' && value.fullSource === '') ||
                                    (value.type === 'incr' && value.incrSource === '')
                                  ) {
                                    return false
                                  }
                                  return true
                                },
                                help: (
                                  <Center>
                                    <div tw="mr-1.5 pt-[1px]">请选择同步来源数据源信息</div>
                                    <HelpCenterLink
                                      hasIcon
                                      isIframe={false}
                                      href="/manual/integration_job/offline/sync_type/#全量同步与增量同步支持的数据源类型"
                                    >
                                      支持数据源
                                    </HelpCenterLink>
                                  </Center>
                                ),
                                status: 'error'
                              },
                              {
                                rule: (value: SyncTypeVal) => {
                                  if (
                                    (value.type === 'full' && value.fullSink === '') ||
                                    (value.type === 'incr' && value.incrSink === '')
                                  ) {
                                    return false
                                  }
                                  return true
                                },
                                help: (
                                  <Center>
                                    <div tw="mr-1.5 pt-[1px]">请选择同步目的数据源信息</div>
                                    <HelpCenterLink
                                      hasIcon
                                      isIframe={false}
                                      href="/manual/integration_job/offline/sync_type/#全量同步与增量同步支持的数据源类型"
                                    >
                                      支持数据源
                                    </HelpCenterLink>
                                  </Center>
                                ),
                                status: 'error'
                              }
                            ]}
                          />
                        )}
                        {!isEdit && params.jobType === JobType.REALTIME && (
                          <RealTimeRadioGroupField
                            name="realTimeInfo"
                            label={<AffixLabel>数据源类型</AffixLabel>}
                            value={params.realTimeInfo}
                            onChange={(v: RealTimeSyncTypeVal) => {
                              setParams((draft) => {
                                draft.realTimeInfo = v
                              })
                            }}
                            validateOnChange
                            schemas={[
                              {
                                rule: ({
                                  sourceType
                                }: {
                                  sourceType?: string
                                } = {}) => {
                                  if (!sourceType) {
                                    return false
                                  }
                                  return true
                                },
                                help: '请选择同步来源数据源信息',
                                status: 'error'
                              },
                              {
                                rule: ({
                                  targetType
                                }: {
                                  targetType?: string
                                } = {}) => {
                                  if (!targetType) {
                                    return false
                                  }
                                  return true
                                },
                                help: '请选择同步目的数据源信息',
                                status: 'error'
                              }
                            ]}
                          />
                        )}
                      </>
                    )}

                    <TextField
                      autoComplete="off"
                      name="name"
                      label={<AffixLabel>作业名称</AffixLabel>}
                      placeholder='允许包含字母、数字 及 "_"，长度2～128'
                      validateOnChange
                      defaultValue={get(job, 'name', '')}
                      schemas={[
                        {
                          rule: {
                            required: true,
                            matchRegex: nameMatchRegex
                          },
                          help: '允许包含字母、数字或下划线（_）,不能以（_）开始结尾',
                          status: 'error'
                        },
                        {
                          rule: (value: string) => {
                            const l = strlen(value)
                            return l >= 2 && l <= 128
                          },
                          help: '允许包含字母、数字 及 "_"，长度2～128',
                          status: 'error'
                        }
                      ]}
                    />
                    <SelectTreeField
                      name="pid"
                      label={<AffixLabel>作业所在目录</AffixLabel>}
                      placeholder="选择作业所在目录"
                      validateOnChange
                      disabled={isEdit}
                      schemas={[
                        {
                          rule: (v: string) => v !== '',
                          help: '请选择作业所在目录',
                          status: 'error'
                        }
                      ]}
                      icon={renderIcon}
                      switcherIcon={renderSwitcherIcon}
                      treeData={filterFolderOfTreeData(
                        cloneDeep(treeData.filter((item) => item.jobMode === params.jobMode))
                      )}
                      loadData={fetchJobTreeData}
                      loadedKeys={loadedKeys}
                      onLoad={(keys: string | number) => workFlowStore.set({ loadedKeys: keys })}
                      value={params.pid}
                      onChange={(v: string, node: Record<string, any>) => {
                        setParams((draft) => {
                          draft.pid = v
                        })
                        setPNode(node)
                      }}
                    />
                    {params.jobMode === JobMode.RT && !job && (
                      <Field>
                        <Label>计算集群</Label>
                        <Control tw="space-x-2">
                          <Button onClick={() => setShowCluster(true)}>
                            <Icon name="pod" />
                            <span tw="ml-1!">
                              {cluster ? (
                                <>
                                  {cluster.name}
                                  <span tw="text-neut-8">({cluster.id})</span>
                                </>
                              ) : (
                                '选择集群'
                              )}
                            </span>
                          </Button>
                          {cluster && (
                            <Button
                              type="black"
                              onClick={() => setCluster(null)}
                              css={[
                                css`
                                  .icon:hover {
                                    ${tw`bg-neut-13!`}
                                  }
                                `
                              ]}
                            >
                              <Icon name="close" size={20} />
                            </Button>
                          )}
                        </Control>
                      </Field>
                    )}
                    <TextAreaField
                      name="desc"
                      label="描述"
                      defaultValue={get(job, 'desc', '')}
                      validateOnChange
                      placeholder="请输入作业描述"
                      schemas={[
                        {
                          rule: (value: string) => {
                            const l = strlen(value)
                            return l <= 1024
                          },
                          help: '最大字符长度1024字节',
                          status: 'error'
                        }
                      ]}
                    />
                  </Form>
                </FormWrapper>
              </div>
            )}
          </ModalContent>
        </>
      </Modal>

      <ClusterTableModal
        visible={showCluster}
        onCancel={() => setShowCluster(false)}
        onOk={(clusterItem) => {
          if (clusterItem) {
            setCluster(clusterItem)
          }
          setShowCluster(false)
        }}
        selectedIds={cluster ? [cluster.id] : []}
      />
    </>
  )
})

export default JobModal
