import { useRef, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import {
  Modal,
  ModalStep,
  ModalContent,
  AffixLabel,
  SelectTreeField,
  Icons,
} from 'components'
import { Icon, Form, Button } from '@QCFE/qingcloud-portal-ui'
import { get, assign } from 'lodash-es'
import { useWindowSize } from 'react-use'
import tw, { css, styled } from 'twin.macro'
import { useMutationStreamJob, getFlowKey } from 'hooks'
import { useQueryClient } from 'react-query'

// import NodeTypeImg from 'assets/svgr/sourcetype_node.svg'
// import SQLTypeImg from 'assets/svgr/sourcetype_sql.svg'
// import CodeTypeImg from 'assets/svgr/sourcetype_code.svg'
import { Control, Field, Label } from '@QCFE/lego-ui'
import ClusterTableModal from 'views/Space/Dm/Cluster/ClusterTableModal'
import { nameMatchRegex, strlen } from 'utils/convert'
import { JobModeItem } from './JobModeItem'

const { TextField, TextAreaField } = Form

enum JobMode {
  DI = 'DI',
  RT = 'RT',
  OLE = 'OLE',
}

enum DiType {
  OFFLINE_BATCH = 'OFFLINE_BATCH',
  REALTIME_FLOW = 'REALTIME_FLOW',
}

enum RtType {
  OPERATOR = 1,
  SQL = 2,
  JAR = 3,
  PYTHON = 4,
  SCALA = 5,
}

// enum OleType {}

const jobModeData = [
  {
    mode: JobMode.DI,
    title: '数据集成',
    desc: '提供异构数据源之间的数据搬运和数据同步的能力',
    icon: 'equalizer',
    selTitle: '同步方式',
    items: [
      {
        icon: 'inbox1',
        title: '离线-批量同步作业',
        desc: '离线批量同步的描述文案，尽量简短，一句话内',
        value: DiType.OFFLINE_BATCH,
      },
      {
        icon: 'inbox0',
        title: '实时-流式同步作业',
        desc: '实时-流式的描述文案，尽量简短，一句话内',
        value: DiType.REALTIME_FLOW,
      },
    ],
  },
  {
    mode: JobMode.RT,
    title: '实时-流式开发',
    desc: '实时开发说明占位文字实时开发说明占位文字实时开发说明占位文字。占位文字',
    icon: 'flash',
    selTitle: '实时开发模式',
    items: [
      {
        icon: 'sql',
        title: 'SQL 模式',
        desc: 'SQL 模式的描述文案，尽量简短，一句话内',
        value: RtType.SQL,
      },
      {
        icon: 'jar',
        title: '代码开发-Jar 包模式',
        desc: 'Jar 模式的描述文案，尽量简短，一句话内',
        value: RtType.JAR,
      },
      {
        icon: 'python',
        title: '代码开发-Python 模式',
        desc: 'Python 模式的描述文案，尽量简短，一句话内',
        value: RtType.PYTHON,
      },
      {
        icon: 'scala',
        title: '代码开发-Scala 模式 ',
        desc: 'scala 模式的描述文案，尽量简短，一句话内',
        value: RtType.SCALA,
      },
      {
        icon: 'operator',
        title: '算子编排模式',
        desc: '算子编排模式描述文案，尽量简短，一句话内',
        value: RtType.OPERATOR,
      },
    ],
  },
  {
    mode: JobMode.OLE,
    title: '离线-批量开发（敬请期待）',
    desc: '离线开发说明占位文字离线开发说明占位文字离线开发说明占位文字。占位文字',
    icon: 'inbox1',
    items: [],
  },
]

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
  job: any
  onCancel: (data?: any) => void
}

const JobModal = ({ job, onCancel }: JobModalProps) => {
  const form = useRef<Form>(null)
  const [showCluster, setShowCluster] = useState(false)
  const [cluster, setCluster] = useState(null)
  const { width: winWidth } = useWindowSize()
  const [params, setParams] = useImmer({
    step: job ? 1 : 0,
    jobMode: job ? job.job_mode : JobMode.DI,
    jobType: -1,
    scheType: job ? job.type : 0,
    pid: '',
  })

  const mutation = useMutationStreamJob()
  const queryClient = useQueryClient()

  const handleCancel = (data?: any) => {
    setParams((draft) => {
      draft.step = 0
    })
    if (onCancel) {
      onCancel(data)
    }
  }

  const handleItemClick = ({ mode }, jobType) => {
    setParams((draft) => {
      draft.jobMode = mode
      draft.jobType = jobType
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
      const data = assign(
        {
          op: job ? 'update' : 'create',
          type: params.jobType,
          ...fields,
          pid: fields.pid === '/' ? '' : fields.pid,
        },
        job && { jobId: job.id },
        cluster && { cluster_id: cluster.id }
      )

      mutation.mutate(data, {
        onSuccess: (ret) => {
          handleCancel(ret)
          queryClient.invalidateQueries(getFlowKey())
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
        onCancel={handleCancel}
        footer={
          <div tw="flex justify-end space-x-2">
            {params.step === 0 || job ? (
              <Button onClick={handleCancel}>取消</Button>
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
                    itemData={modeItem}
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
                        rule: (pid: string) => {
                          return pid !== ''
                        },
                        help: '请选择作业所在目录',
                        status: 'error',
                      },
                    ]}
                    treeData={[
                      {
                        key: 'key-1',
                        icon: <Icons name="flash" size={16} />,
                        title: '实时-流式开发',
                        pid: '/',
                      },
                    ]}
                    // value={params.pid}
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
