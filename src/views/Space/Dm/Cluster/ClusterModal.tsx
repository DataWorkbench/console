import { useRef, useMemo } from 'react'
import {
  Collapse,
  Control,
  Field,
  Form,
  Icon,
  Label,
  InputNumber,
  Slider,
  RadioGroup,
  RadioButton,
} from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled, css } from 'twin.macro'
import { useImmer } from 'use-immer'
import { set, range, trim, filter, assign } from 'lodash-es'
import { useQueryClient } from 'react-query'
import Tippy from '@tippyjs/react'
import {
  useStore,
  useQueryFlinkVersions,
  useMutationCluster,
  getFlinkClusterKey,
} from 'hooks'
import { Modal, FlexBox, Center, KVTextAreaField, AffixLabel } from 'components'

const { CollapseItem } = Collapse
const { TextField, SelectField, NumberField } = Form
const splitReg = /\s*[=:]\s*|\s+/

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-[686px] overflow-auto `}
    form.is-horizon-layout {
      ${tw`pl-0`}
      > .field {
        > .label {
          ${tw`pr-2`}
        }
        > .control {
          ${tw`w-auto`}
          .select-control {
            ${tw`w-[328px]`}
          }
        }
        > .help {
          ${tw`w-[328px]`}
        }
      }
    }
  `,
])

const RestartWrapper = styled('div')(() => [
  tw`bg-neut-17 ml-24 px-4 py-5`,
  css`
    .field > .label {
      ${tw`w-24 mb-0 mr-4 inline-flex items-center`}
    }
  `,
])

const InDemandTitle = styled('div')(() => [
  tw`text-sm leading-6`,
  css`
    span {
      ${tw`text-green-11 font-semibold text-xl`}
    }
  `,
])

const isKvStr = (v: string) => {
  const str = trim(v)
  if (str === '') {
    return true
  }
  const rows = str.split(/[\r\n]/).filter((n) => n !== '')
  let invalid = false
  rows.forEach((row) => {
    const r = filter(trim(row).split(splitReg), (o) => o !== '')
    if (r.length < 2) {
      invalid = true
    }
  })
  return !invalid
}

const defaultParams = {
  config: {
    custom: [],
    logger: {
      root_log_level: 'INFO',
    },
    restart_strategy: {
      failure_rate_delay: 1,
      failure_rate_failure_rate_interval: 3,
      failure_rate_max_failures_per_interval: 1,
      fixed_delay_attempts: 1,
      fixed_delay_delay: 1,
      restart_strategy: 'none', // "none | fixed-delay | failure-rate"
    },
  },
  host_aliases: {
    items: [],
  },
  job_cu: 1,
  name: '',
  network_id: '',
  task_cu: 1,
  task_num: 1,
  version: '',
}

const ClusterModal = observer(
  ({ opCluster }: { opCluster: typeof defaultParams }) => {
    const {
      dmStore: { setOp, op },
    } = useStore()
    const [params, setParams] = useImmer(opCluster || defaultParams)
    const baseFormRef = useRef<Form>(null)
    const networkFormRef = useRef<Form>(null)
    const optFormRef = useRef<Form>(null)

    const queryClient = useQueryClient()
    const { data: flinkVersions } = useQueryFlinkVersions()
    const mutation = useMutationCluster()

    const handleOk = () => {
      const baseForm = baseFormRef.current
      const optForm = optFormRef.current
      const networkForm = networkFormRef.current
      if (
        baseForm?.validateFields() &&
        optForm?.validateFields() &&
        networkForm?.validateFields()
      ) {
        const paramsData = assign(
          {
            op,
            ...params,
          },
          opCluster && { cluster_id: opCluster.id }
        )
        mutation.mutate(paramsData, {
          onSuccess: () => {
            setOp('')
            queryClient.invalidateQueries(getFlinkClusterKey())
          },
        })
      }
    }

    const setStrategy = (field: string, value: any) => {
      setParams((draft) => {
        set(draft, `config.restart_strategy.${field}`, value)
      })
    }

    const sethostAliases = (v: string) => {
      const str = trim(v)
      const items: { hostname: string; ip: string }[] = []
      if (str !== '') {
        const rows = str.split(/[\r\n]/)
        rows.forEach((row) => {
          const r = trim(row)
          if (r !== '') {
            const arr = r.split(splitReg)
            items.push({
              ip: arr[0],
              hostname: arr[1],
            })
          }
        })
      }
      setParams((draft) => {
        set(draft, 'host_aliases.items', items)
      })
    }

    const setConfigCustom = (v: string) => {
      const str = trim(v)
      const items: { key: string; value: string }[] = []
      if (str !== '') {
        const rows = str.split(/[\r\n]/)
        rows.forEach((row) => {
          const r = trim(row)
          if (r !== '') {
            const arr = r.split(splitReg)
            items.push({
              key: arr[0],
              value: arr[1],
            })
          }
        })
      }
      setParams((draft) => {
        set(draft, 'config.custom', items)
      })
    }
    const strategy = params.config.restart_strategy
    const marks = useMemo(() => {
      const o = {}
      range(0, 9, 1).forEach((v) => {
        set(o, v, String(v))
      })
      return o
    }, [])

    const viewMode = op === 'view'

    return (
      <Modal
        title={(() => {
          let opTxt = '查看'
          if (op === 'create') {
            opTxt = '创建'
          } else if (op === 'update') {
            opTxt = '修改'
          }
          return `${opTxt}计算集群`
        })()}
        orient="fullright"
        confirmLoading={mutation.isLoading}
        visible
        onOk={handleOk}
        onCancel={() => setOp('')}
        width={1000}
      >
        <FlexBox tw="h-full overflow-hidden">
          <FormWrapper>
            <Collapse
              defaultActiveKey={['p1', 'p2', 'p3', 'p4', 'p5']}
              tw="border-r!"
            >
              <CollapseItem
                key="p1"
                label={
                  <FlexBox tw="items-center space-x-1">
                    <Icon
                      name="record"
                      tw="(relative top-0 left-0)!"
                      type="light"
                    />
                    <span>基础属性</span>
                  </FlexBox>
                }
              >
                <Form ref={baseFormRef}>
                  <TextField
                    label={<AffixLabel required>名称</AffixLabel>}
                    name="name"
                    placeholder="请输入计算集群名称"
                    validateOnBlur
                    disabled={viewMode}
                    value={params.name}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.name = v
                      })
                    }}
                    schemas={[
                      {
                        rule: {
                          required: true,
                          matchRegex: /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
                        },
                        status: 'error',
                        help: '不能为空,字母、数字或下划线（_）,不能以（_）开始结尾',
                      },
                    ]}
                  />
                  <SelectField
                    label={<AffixLabel required>版本</AffixLabel>}
                    name="version"
                    validateOnBlur
                    placeholder="请选择版本"
                    disabled={viewMode}
                    options={flinkVersions?.map((version: string) => ({
                      label: version,
                      value: version,
                    }))}
                    value={params.version}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.version = v
                      })
                    }}
                    schemas={[
                      {
                        rule: {
                          required: true,
                          isExisty: false,
                        },
                        status: 'error',
                        help: '不能为空',
                      },
                    ]}
                    css={[
                      css`
                        .select-control {
                          ${tw`w-48!`}
                        }
                      `,
                    ]}
                  />
                  <SelectField
                    name="restart_strategy"
                    label={
                      <AffixLabel
                        required
                        help="如果您没有配置该参数，则按Apache Flink默认的重启策略，即当有Task失败时，如果没有开启Checkpoint，JobManager进程不会重启。如果开启了Checkpoint，则JobManager进程会重启。"
                      >
                        重启策略
                      </AffixLabel>
                    }
                    placeholder="请选择重启策略"
                    clearable
                    disabled={viewMode}
                    value={strategy.restart_strategy}
                    onChange={(v: any) =>
                      setStrategy('restart_strategy', v || 'none')
                    }
                    options={[
                      {
                        label: 'NoRestart:  不重启',
                        value: 'none',
                      },
                      {
                        label: 'FixedDelay:  固定延迟',
                        value: 'fixed-delay',
                      },
                      {
                        label: 'FailureRate: 故障率',
                        value: 'failure-rate',
                      },
                    ]}
                    help="重启策略是指在发生故障时. 如何处理(重启)任务作业"
                  />
                  {strategy.restart_strategy === 'fixed-delay' && (
                    <RestartWrapper>
                      <Field>
                        <Label>* 尝试重启次数</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={1000}
                            value={strategy.fixed_delay_attempts}
                            onChange={(v: any) =>
                              setStrategy('fixed_delay_attempts', v)
                            }
                          />
                        </Control>
                      </Field>
                      <Field>
                        <Label>* 重启时间间隔</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={86400}
                            value={strategy.fixed_delay_delay}
                            onChange={(v: any) =>
                              setStrategy('fixed_delay_delay', v)
                            }
                          />
                        </Control>
                        <Center tw="ml-1">秒</Center>
                      </Field>
                    </RestartWrapper>
                  )}
                  {strategy.restart_strategy === 'failure-rate' && (
                    <RestartWrapper
                      css={[
                        css`
                          .field > .label {
                            ${tw`w-36`}
                          }
                        `,
                      ]}
                    >
                      <Field>
                        <Label>* 检测故障率时间间隔</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={86400}
                            value={strategy.failure_rate_delay}
                            onChange={(v: any) =>
                              setStrategy('failure_rate_delay', v)
                            }
                          />
                        </Control>
                        <Center tw="ml-1">秒</Center>
                      </Field>
                      <Field>
                        <Label>* 时间间隔内最大失败次数</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={10800}
                            value={
                              strategy.failure_rate_max_failures_per_interval
                            }
                            onChange={(v: any) =>
                              setStrategy(
                                'failure_rate_max_failures_per_interval',
                                v
                              )
                            }
                          />
                        </Control>
                      </Field>
                      <Field>
                        <Label>* 重启时间间隔</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={1440}
                            value={strategy.failure_rate_failure_rate_interval}
                            onChange={(v: any) =>
                              setStrategy(
                                'failure_rate_failure_rate_interval',
                                v
                              )
                            }
                          />
                        </Control>
                        <Center tw="ml-1">分</Center>
                      </Field>
                    </RestartWrapper>
                  )}
                </Form>
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
                    <span>资源配置</span>
                  </FlexBox>
                }
              >
                <Form>
                  <NumberField
                    label={
                      <AffixLabel help="Flink 的 TaskNumber 的数量">
                        Task 数量
                      </AffixLabel>
                    }
                    name="task_num"
                    isMini
                    min={1}
                    max={24}
                    disabled={viewMode}
                    value={params.task_num}
                    onChange={(v: number) => {
                      setParams((draft) => {
                        draft.task_num = v
                      })
                    }}
                  />

                  <Field>
                    <AffixLabel help="Flink 的 TaskManager 的 CPU 和内存设置单个集群： 0.5≤TaskManager CU≦8">
                      Task CU
                    </AffixLabel>
                    <Control tw="pl-12 pt-3 w-80!">
                      <Slider
                        min={0.5}
                        max={8}
                        step={0.5}
                        marks={marks}
                        hasTooltip
                        markDots
                        disabled={viewMode}
                        value={params.task_cu}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.task_cu = v
                          })
                        }}
                      />
                    </Control>
                    <Control tw="items-center">
                      <InputNumber
                        isMini
                        min={0.5}
                        max={8}
                        step={0.5}
                        tw="ml-3"
                        disabled={viewMode}
                        value={params.task_cu}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.task_cu = v
                          })
                        }}
                      />
                    </Control>
                    <Center tw="ml-3 text-neut-8">（每 CU：1核 4G）</Center>
                  </Field>
                  <Field>
                    <AffixLabel help="Flink 的 JobManager 的 CPU 和内存设置单个集群： 0.5≤JobManager CU≦8">
                      Job CU
                    </AffixLabel>
                    <Control tw="pl-12 pt-3 w-80!">
                      <Slider
                        min={0.5}
                        max={8}
                        step={0.5}
                        marks={marks}
                        hasTooltip
                        markDots
                        disabled={viewMode}
                        value={params.job_cu}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.job_cu = v
                          })
                        }}
                      />
                    </Control>
                    <Control tw="items-center">
                      <InputNumber
                        min={0.5}
                        max={8}
                        step={0.5}
                        value={params.job_cu}
                        isMini
                        tw="ml-3"
                        disabled={viewMode}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.job_cu = v
                          })
                        }}
                      />
                    </Control>
                    <Center tw="ml-3 text-neut-8">（每 CU：1核 4G）</Center>
                  </Field>
                  <Field>
                    <div>
                      总计算资源 CU ={' '}
                      {params.task_num * params.task_cu + params.job_cu}
                      <span tw="text-neut-8">
                        （ Task 数量 * Task CU + Job CU）
                      </span>
                    </div>
                  </Field>
                </Form>
              </CollapseItem>
              <CollapseItem
                key="p3"
                label={
                  <FlexBox tw="items-center space-x-1">
                    <Icon
                      name="record"
                      tw="(relative top-0 left-0)!"
                      type="light"
                    />
                    <span>网络配置</span>
                  </FlexBox>
                }
              >
                <Form ref={networkFormRef}>
                  <SelectField
                    label={<AffixLabel>选择网络</AffixLabel>}
                    name="network_id"
                    value={params.network_id}
                    validateOnBlur
                    disabled={viewMode}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.network_id = v
                      })
                    }}
                    schemas={[
                      {
                        rule: {
                          required: true,
                          isExisty: false,
                        },
                        status: 'error',
                        help: '请选择网络',
                      },
                    ]}
                    options={[
                      {
                        label: 'net-0526a830be4f3000',
                        value: 'net-0526a830be4f3000',
                      },
                    ]}
                    help={<div>如需选择新的 VPC，您可以新建 VPC 网络</div>}
                  />
                </Form>
              </CollapseItem>
              <CollapseItem
                key="p4"
                label={
                  <FlexBox tw="items-center space-x-1">
                    <Icon
                      name="record"
                      tw="(relative top-0 left-0)!"
                      type="light"
                    />
                    <span>日志配置</span>
                  </FlexBox>
                }
              >
                <Form>
                  <SelectField
                    label={<AffixLabel>日志级别</AffixLabel>}
                    name="root_log_level"
                    disabled={viewMode}
                    value={params.config.logger.root_log_level}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.config.logger.root_log_level = v
                      })
                    }}
                    options={[
                      { label: 'TRACE', value: 'TRACE' },
                      { label: 'DEBUG', value: 'DEBUG' },
                      { label: 'INFO', value: 'INFO' },
                      { label: 'WARN', value: 'WARN' },
                      { label: 'ERROR', value: 'ERROR' },
                    ]}
                    help={<div>默认与并行度一致</div>}
                  />
                </Form>
              </CollapseItem>
              <CollapseItem
                key="p5"
                label={
                  <FlexBox tw="items-center space-x-1">
                    <Icon
                      name="record"
                      tw="(relative top-0 left-0)!"
                      type="light"
                    />
                    <span>可选配置</span>
                  </FlexBox>
                }
              >
                <Form ref={optFormRef}>
                  <KVTextAreaField
                    disabled={viewMode}
                    label="Host别名"
                    title="Hosts 信息"
                    name="host_aliases"
                    kvs={['IP', 'Hostname']}
                    validateOnBlur
                    defaultValue={params.host_aliases.items
                      ?.map(
                        (item: { hostname: string; ip: string }) =>
                          `${item.ip} ${item.hostname}`
                      )
                      .join('\r\n')}
                    placeholder={`|请输入 IP hostname ，多条配置之间换行输入。例如：
192.168.3.2 proxy.mgmt.pitrix.yunify.com
192.168.2.8 pgpool.mgmt.pitrix.yunify.com`}
                    schemas={[
                      {
                        rule: isKvStr,
                        help: '格式不正确,请输入 IP hostname，多条配置之间换行输入',
                        status: 'error',
                      },
                    ]}
                    onChange={sethostAliases}
                  />
                  <KVTextAreaField
                    disabled={viewMode}
                    label={<AffixLabel required={false}>Flink参数</AffixLabel>}
                    name="custom"
                    validateOnBlur
                    division=":"
                    defaultValue={params.config.custom
                      ?.map(
                        (item: { key: string; value: string }) =>
                          `${item.key} ${item.value}`
                      )
                      .join('\r\n')}
                    placeholder={`Flink 的参数配置, yaml 格式，多个参数用，隔开。
示例：key01:value01，key02:value02`}
                    schemas={[
                      {
                        rule: isKvStr,
                        help: '格式不正确,请输入 key value，多条配置之间换行输入',
                        status: 'error',
                      },
                    ]}
                    onChange={setConfigCustom}
                  />
                </Form>
              </CollapseItem>
            </Collapse>
          </FormWrapper>
          <div tw="w-80 px-5 pt-5 space-y-4">
            <div tw="text-base font-semibold">费用预览</div>
            <RadioGroup value={1}>
              <RadioButton value={1}>按需计费</RadioButton>
              <Tippy
                theme="light"
                animation="fade"
                arrow
                delay={100}
                offset={[60, 10]}
                content={
                  <Center tw="h-9 px-3 text-neut-13">
                    限时免费，预留合约敬请期待
                  </Center>
                }
              >
                <div>
                  <RadioButton
                    value={2}
                    tw="bg-neut-13! text-neut-8! cursor-not-allowed"
                  >
                    预留合约
                  </RadioButton>
                </div>
              </Tippy>
            </RadioGroup>
            <div>
              <InDemandTitle tw="text-sm">
                Task 数量：<span>{params.task_num}</span>
              </InDemandTitle>
              <div tw="text-neut-8">Flink 的 TaskNumber 的数量</div>
            </div>
            <div>
              <InDemandTitle tw="text-sm">
                Task CU：<span>{params.task_cu}</span>
              </InDemandTitle>
              <div tw="text-neut-8">Flink 的 TaskManager 的 CPU 和内存设置</div>
            </div>
            <div>
              <InDemandTitle tw="text-sm">
                Job CU：<span>{params.job_cu}</span>
              </InDemandTitle>
              <div tw="text-neut-8">Flink 的 JobManager 的 CPU 和内存设置</div>
            </div>
            <div>
              <InDemandTitle tw="text-sm">
                总计算资源 CU：
                <span>{params.task_num * params.task_cu + params.job_cu}</span>
              </InDemandTitle>
              <div tw="text-neut-8">
                总计算资源 CU =Task 数量 * Task CU + Job CU{' '}
              </div>
            </div>
            <div tw="pt-4 pb-2 border-b border-neut-13">
              收费标准详见
              <a href="###" tw="text-green-11">
                《大数据平台计费说明》
              </a>
            </div>
            <div>
              <FlexBox tw="justify-between">
                <div tw="text-sm">总价</div>
                <div tw="text-neut-8">
                  <span tw="text-xl text-green-11">¥ 0</span>{' '}
                  <del tw="">8.1245/小时</del>
                </div>
              </FlexBox>
              <FlexBox tw="justify-between">
                <div
                  tw="rounded-sm px-1"
                  css={css`
                    background: #b34b06;
                  `}
                >
                  限时免费，机不可失
                </div>

                <div tw="text-neut-8">
                  (合 <span tw="text-green-11">¥0</span> <del>2718</del> 每月 )
                </div>
              </FlexBox>
            </div>
          </div>
        </FlexBox>
      </Modal>
    )
  }
)

export default ClusterModal
