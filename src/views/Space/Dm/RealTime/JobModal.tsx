import { useRef, useMemo, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
import {
  Modal,
  ModalStep,
  ModalContent,
  AffixLabel,
  SelectTreeField,
} from 'components'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, cloneDeep } from 'lodash-es'
import { useWindowSize } from 'react-use'
import tw, { css, styled } from 'twin.macro'
import { TreeNodeProps } from 'rc-tree'
import { observer } from 'mobx-react-lite'
import { useStore, useMutationStreamJob, useFetchJob } from 'hooks'
import { Control, Field, Label } from '@QCFE/lego-ui'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { nameMatchRegex, strlen } from 'utils/convert'
import { JobModeItem } from './JobModeItem'
import {
  JobMode,
  JobType,
  jobModeData,
  renderIcon,
  getJobMode,
  renderSwitcherIcon,
  isRootNode,
  getNewTreeData,
  filterFolderOfTreeData,
  RootKey,
} from './JobUtils'
import { SyncTypeRadioGroupField, SyncTypeVal } from './SyncTypeRadioGroup'

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
  `,
])

interface JobModalProps {
  op: 'create' | 'edit'
  jobType?: JobType
  jobNode?: TreeNodeProps
  onClose?: (created: boolean, op: 'create' | 'edit') => void
}

export const JobModal = observer(
  ({
    op = 'create',
    jobType = JobType.SQL,
    jobNode,
    onClose,
  }: JobModalProps) => {
    const fetchJob = useFetchJob()
    const {
      workFlowStore,
      workFlowStore: { treeData, loadedKeys },
    } = useStore()
    const form = useRef<Form>(null)
    const [showCluster, setShowCluster] = useState(false)
    const [cluster, setCluster] = useState(null)
    const { width: winWidth } = useWindowSize()
    const [params, setParams] = useImmer(() => {
      const jobMode = getJobMode(jobType)
      const isEdit = op === 'edit'
      return {
        step: !isEdit && !jobNode ? 0 : 1,
        jobMode,
        jobType,
        pid: jobNode ? get(jobNode, isEdit ? 'pid' : 'key') : '',
        job: isEdit ? get(jobNode, 'job') : null,
        syncTypeInfo: {
          type: 'full',
          fullSource: '',
          fullSink: '',
          incrSource: '',
          incrSink: '',
        } as SyncTypeVal,
      }
    })
    const { job } = params
    const mutation = useMutationStreamJob()

    useEffect(() => {
      if (jobType) {
        setParams((draft) => {
          draft.jobMode = getJobMode(jobType)
        })
      }
    }, [jobType, setParams])

    const fetchJobTreeData = (node: any) => {
      return fetchJob({
        pid: isRootNode(node.key) ? '' : node.key,
      }).then((data) => {
        const jobs = get(data, 'infos') || []
        const newTreeData = getNewTreeData(treeData, node, jobs)
        // setTreeData(newTreeData)
        workFlowStore.set({
          treeData: newTreeData,
          loadedKeys: [...loadedKeys, node.key],
        })
      })
    }

    const handleClose = (created = false) => {
      setParams((draft) => {
        draft.step = 0
      })
      if (onClose) {
        onClose(created, op)
      }
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

    const handleNext = () => {
      if (params.step === 0) {
        setParams((draft) => {
          draft.step = 1
        })
      } else if (form.current?.validateForm()) {
        const fields = form.current.getFieldsValue()
        const { syncTypeInfo, ...rest }: { syncTypeInfo: SyncTypeVal } = fields
        const data: any = {
          op,
          jobMode: params.jobMode,
          type: params.jobType,
          ...rest,
          is_directory: false,
          pid: isRootNode(fields.pid) ? '' : fields.pid,
        }
        // job && { jobId: job.id },
        // cluster && { cluster_id: cluster.id }
        // type: params.jobMode === JobMode.RT ? params.jobType :

        if (job) {
          data.jobId = job.id
        }
        if (cluster) {
          data.cluster_id = cluster.id
        }
        if (params.jobMode === JobMode.RT) {
          data.type = params.jobType
        } else if (params.jobMode === JobMode.DI) {
          if (params.jobType === JobType.OFFLINE) {
            data.type = syncTypeInfo.type === 'full' ? 0 : 1
          }
          if (params.jobType === JobType.REALTIME) {
            data.type = syncTypeInfo.type === 'full' ? 2 : 3
          }
          if (syncTypeInfo.type === 'full') {
            data.source_type = syncTypeInfo.fullSource
            data.target_type = syncTypeInfo.fullSink
          } else {
            data.source_type = syncTypeInfo.incrSource
            data.target_type = syncTypeInfo.incrSink
          }
        }
        mutation.mutate(data, {
          onSuccess: () => {
            handleClose(true)
          },
        })
      }
    }

    const isXl = winWidth >= 1280
    const modalWidth = useMemo(() => {
      if (job) {
        return 700
      }
      return isXl ? 1200 : 900
    }, [isXl, job])
    return (
      <>
        <Modal
          visible
          title={`${job ? '修改' : '创建'}作业`}
          width={modalWidth}
          maskClosable={false}
          appendToBody
          draggable
          onCancel={() => handleClose(false)}
          footer={
            <div tw="flex justify-end space-x-2">
              {params.step === 0 || job ? (
                <Button onClick={() => handleClose(false)}>取消</Button>
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
              <div tw="mb-4 text-sm leading-6">
                请选择您要进行作业开发的模式：
              </div>
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
                            {params.jobType === JobType.OFFLINE && (
                              <span>数据集成-离线同步</span>
                            )}
                            {params.jobType === JobType.REALTIME && (
                              <span>数据集成-实时同步</span>
                            )}
                          </Control>
                        </Field>
                        <SyncTypeRadioGroupField
                          label={<AffixLabel>同步类型</AffixLabel>}
                          name="syncTypeInfo"
                          value={params.syncTypeInfo}
                          onChange={(v) => {
                            setParams((draft) => {
                              draft.syncTypeInfo = v
                            })
                          }}
                          validateOnChange
                          schemas={[
                            {
                              rule: (value: SyncTypeVal) => {
                                if (
                                  (value.type === 'full' &&
                                    (value.fullSource === '' ||
                                      value.fullSink === '')) ||
                                  (value.type === 'incr' &&
                                    (value.incrSource === '' ||
                                      value.incrSink === ''))
                                ) {
                                  return false
                                }
                                return true
                              },
                              help: '请选择同步数据源',
                              status: 'error',
                            },
                          ]}
                        />
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
                            matchRegex: nameMatchRegex,
                          },
                          help: '允许包含字母、数字或下划线（_）,不能以（_）开始结尾',
                          status: 'error',
                        },
                        {
                          rule: (value: string) => {
                            const l = strlen(value)
                            return l >= 2 && l <= 128
                          },
                          help: '允许包含字母、数字 及 "_"，长度2～128',
                          status: 'error',
                        },
                      ]}
                    />
                    <SelectTreeField
                      name="pid"
                      label={<AffixLabel>作业所在目录</AffixLabel>}
                      placeholder="选择作业所在目录"
                      validateOnChange
                      schemas={[
                        {
                          rule: (v: string) => {
                            return v !== ''
                          },
                          help: '请选择作业所在目录',
                          status: 'error',
                        },
                      ]}
                      icon={renderIcon}
                      switcherIcon={renderSwitcherIcon}
                      treeData={filterFolderOfTreeData(
                        cloneDeep(
                          treeData.filter(
                            (item) => item.key === RootKey[params.jobMode]
                          )
                        )
                      )}
                      loadData={fetchJobTreeData}
                      loadedKeys={loadedKeys}
                      onLoad={(keys: string | number) =>
                        workFlowStore.set({ loadedKeys: keys })
                      }
                      value={params.pid}
                      onChange={(v: string) => {
                        setParams((draft) => {
                          draft.pid = v
                        })
                      }}
                    />
                    {!job && (
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
                                `,
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
                          status: 'error',
                        },
                      ]}
                    />
                  </Form>
                </FormWrapper>
              </div>
            )}
          </ModalContent>
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
  }
)

export default JobModal
