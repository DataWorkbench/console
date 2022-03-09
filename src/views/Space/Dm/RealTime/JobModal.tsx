import { useRef, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import {
  Modal,
  ModalStep,
  ModalContent,
  AffixLabel,
  SelectTreeField,
} from 'components'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, assign } from 'lodash-es'
import { useWindowSize } from 'react-use'
import tw, { css, styled } from 'twin.macro'
import { useMutationStreamJob } from 'hooks'
// import { useQueryClient } from 'react-query'
import { Control, Field, Label } from '@QCFE/lego-ui'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { nameMatchRegex, strlen } from 'utils/convert'
import { JobModeItem } from './JobModeItem'
import { JobMode, jobModeData, RtType } from './JobUtils'

const { TextField, TextAreaField } = Form

const FormWrapper = styled('div')(() => [
  tw`w-[450px]`,
  css`
    .form {
      ${tw`pl-0`}
      &.is-horizon-layout>.field {
        > .label {
          ${tw`w-28`}
        }
        > .control {
          ${tw`max-w-[328px] flex-1`}
          .select {
            ${tw`w-full`}
          }
        }
        > .help {
          ${tw`w-full ml-28`}
        }
      }
    }
  `,
])

interface JobModalProps {
  op?: 'create' | 'edit'
  jobType?: string | number
  jobMode?: string
  pid?: string
  job?: any
  treeData: any[]
  onClose?: (data?: any) => void
}

export const JobModal = ({
  op = 'create',
  jobMode,
  jobType,
  pid = '',
  job,
  treeData = [],
  onClose,
}: JobModalProps) => {
  const form = useRef<Form>(null)
  const [showCluster, setShowCluster] = useState(false)
  const [cluster, setCluster] = useState(null)
  const { width: winWidth } = useWindowSize()
  const [params, setParams] = useImmer({
    step: op === 'create' && !jobMode ? 0 : 1,
    jobMode: jobMode || JobMode.RT,
    jobType: jobType || RtType.SQL,
    pid,
    job,
  })

  const mutation = useMutationStreamJob()
  // const queryClient = useQueryClient()

  const handleClose = (created = false) => {
    setParams((draft) => {
      draft.step = 0
    })
    if (onClose) {
      onClose(created)
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
      const isRootNode = ['rt-root', 'sql-root'].includes(fields.pid)
      const data = assign(
        {
          op: job ? 'update' : 'create',
          type: params.jobType,
          ...fields,
          is_directory: false,
          pid: isRootNode ? '' : fields.pid,
        },
        job && { jobId: job.id },
        cluster && { cluster_id: cluster.id }
      )
      mutation.mutate(data, {
        onSuccess: () => {
          handleClose(true)
          // queryClient
          // queryClient.invalidateQueries(getFlowKey())
        },
      })
    }
  }

  const isXl = winWidth >= 1280
  const modalWidth = useMemo(() => {
    if (job) {
      return 600
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
              disabled={params.jobType === -1}
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
                return (
                  <JobModeItem
                    key={modeItem.mode}
                    jobModeData={modeItem}
                    defaultType={params.jobType}
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
                    treeData={treeData}
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

export default JobModal
