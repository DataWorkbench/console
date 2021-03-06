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
import {
  set,
  range,
  trim,
  filter,
  assign,
  flatten,
  pick,
  keys,
} from 'lodash-es'
import { useQueryClient } from 'react-query'
import Tippy from '@tippyjs/react'
import dayjs from 'dayjs'
import {
  useStore,
  useQueryFlinkVersions,
  useInfiniteQueryNetworks,
  useMutationCluster,
  getFlinkClusterKey,
  getNetworkKey,
} from 'hooks'
import {
  Modal,
  FlexBox,
  Center,
  KVTextAreaField,
  AffixLabel,
  SelectWithRefresh,
  HelpCenterLink,
  TextLink,
} from 'components'
import { strlen, nameMatchRegex } from 'utils/convert'
import { NetworkModal } from 'views/Space/Dm/Network'
import { Button } from '@QCFE/qingcloud-portal-ui'

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

const KVTextAreaFieldWrapper = styled(KVTextAreaField)(() => [
  css`
    & > .label {
      ${tw`items-start! mt-1.5`}
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
      failure_rate_failure_rate_interval: 60,
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
      dmStore,
    } = useStore()

    const [params, setParams] = useImmer(
      opCluster
        ? pick(opCluster, keys(defaultParams).concat(['created']))
        : defaultParams
    )
    const baseFormRef = useRef<Form>(null)
    const networkFormRef = useRef<Form>(null)
    const optFormRef = useRef<Form>(null)

    const queryClient = useQueryClient()
    const { data: flinkVersions } = useQueryFlinkVersions()
    const networksRet = useInfiniteQueryNetworks({
      offset: 0,
      limit: 100,
    })
    const networks = flatten(
      networksRet.data?.pages.map((page) => page.infos || [])
    )
    const mutation = useMutationCluster()
    const totalCU = params.task_num * params.task_cu + params.job_cu
    const viewMode = op === 'view'

    const handleOk = () => {
      const baseForm = baseFormRef.current
      const optForm = optFormRef.current
      const networkForm = networkFormRef.current
      if (viewMode) {
        setOp('')
        return
      }
      if (
        baseForm?.validateFields() &&
        optForm?.validateFields() &&
        networkForm?.validateFields() &&
        totalCU <= 12
      ) {
        const paramsData = assign(
          {
            op,
            ...params,
          },
          opCluster && { clusterId: opCluster.id }
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
        set(o, v, v === 0 ? '0.5' : String(v))
      })
      return o
    }, [])
    return (
      <Modal
        title={(() => {
          let opTxt = '??????'
          if (op === 'create') {
            opTxt = '??????'
          } else if (op === 'update') {
            opTxt = '??????'
          }
          return `${opTxt}????????????`
        })()}
        orient="fullright"
        visible
        footer={
          <>
            {op !== 'view' && <Button onClick={() => setOp('')}>??????</Button>}
            <Button
              type="primary"
              onClick={handleOk}
              loading={mutation.isLoading}
            >
              {op === 'create' ? '????????????' : '??????'}
            </Button>
          </>
        }
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
                    <span>????????????</span>
                  </FlexBox>
                }
              >
                <Form ref={baseFormRef}>
                  <TextField
                    autoComplete="off"
                    label={<AffixLabel required>??????</AffixLabel>}
                    name="name"
                    placeholder="???????????????????????????"
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
                          matchRegex: nameMatchRegex,
                        },
                        status: 'error',
                        help: '????????????,??????????????????????????????_???,????????????_???????????????',
                      },
                      {
                        rule: (value: string) => {
                          const l = strlen(value)
                          return l >= 2 && l <= 128
                        },
                        help: '????????????2,????????????128',
                        status: 'error',
                      },
                    ]}
                  />
                  <SelectField
                    clearable
                    label={<AffixLabel required>??????</AffixLabel>}
                    name="version"
                    validateOnChange
                    placeholder="???????????????"
                    disabled={viewMode || op === 'update'}
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
                        help: '????????????',
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
                        theme="green"
                        help="????????????????????? Flink Job ?????????????????????????????? Job????????? No Restarts:????????????Fixed Delay:???????????????Failure Rate:?????????????????????????????????"
                      >
                        ????????????
                      </AffixLabel>
                    }
                    validateOnChange
                    placeholder="?????????????????????"
                    disabled={viewMode}
                    value={strategy.restart_strategy}
                    onChange={(v: any) =>
                      setStrategy('restart_strategy', v || 'none')
                    }
                    options={[
                      {
                        label: 'NoRestart:  ?????????',
                        value: 'none',
                      },
                      {
                        label: 'FixedDelay:  ????????????',
                        value: 'fixed-delay',
                      },
                      {
                        label: 'FailureRate: ?????????',
                        value: 'failure-rate',
                      },
                    ]}
                    help={
                      <>
                        {{
                          none: '???????????????????????? Job',
                          'fixed-delay':
                            '??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????Job ??????????????????',
                          'failure-rate':
                            '???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????Job ??????????????????',
                        }[strategy.restart_strategy] || ''}
                      </>
                    }
                  />
                  {strategy.restart_strategy === 'fixed-delay' && (
                    <RestartWrapper>
                      <Field>
                        <Label>* ??????????????????</Label>
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
                        <Label>* ??????????????????</Label>
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
                        <Center tw="ml-1">???</Center>
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
                        <Label>* ???????????????????????????</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={86400}
                            value={strategy.failure_rate_failure_rate_interval}
                            onChange={(v: any) =>
                              setStrategy(
                                'failure_rate_failure_rate_interval',
                                v
                              )
                            }
                          />
                        </Control>
                        <Center tw="ml-1">???</Center>
                      </Field>
                      <Field>
                        <Label>* ?????????????????????????????????</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={1000}
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
                        <Label>* ??????????????????</Label>
                        <Control>
                          <InputNumber
                            disabled={viewMode}
                            isMini
                            min={1}
                            max={86400}
                            value={strategy.failure_rate_delay}
                            onChange={(v: any) => {
                              setStrategy('failure_rate_delay', v)
                            }}
                          />
                        </Control>
                        <Center tw="ml-1">???</Center>
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
                    <span>????????????</span>
                  </FlexBox>
                }
              >
                <Form>
                  <NumberField
                    label={
                      <AffixLabel
                        help="Flink ??? TaskManager ?????????"
                        theme="green"
                      >
                        TM ??????
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
                    <AffixLabel
                      theme="green"
                      help={
                        <>
                          <div>Flink ??? TaskManager ??? CPU ???????????????</div>
                          <div>??????????????? 0.5???TaskManager CU???8</div>
                        </>
                      }
                    >
                      TM ??????
                    </AffixLabel>
                    <Control tw="pl-7 pt-3 w-80!">
                      <Slider
                        min={0}
                        max={8}
                        step={1}
                        marks={marks}
                        hasTooltip
                        markDots
                        tipFormatter={(v) => `${v === 0 ? '0.5' : v} CU`}
                        disabled={viewMode}
                        value={params.task_cu}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.task_cu = v === 0 ? 0.5 : v
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
                        upHandler={(v: number) => {
                          setParams((draft) => {
                            const fmVal = Math.ceil(v)
                            draft.task_cu = fmVal === 0 ? 0.5 : fmVal
                          })
                        }}
                        downHandler={(v: number) => {
                          setParams((draft) => {
                            const fmVal = Math.floor(v)
                            draft.task_cu = fmVal === 0 ? 0.5 : fmVal
                          })
                        }}
                      />
                    </Control>
                    <Center tw="ml-3 text-neut-8">?????? CU???1??? 4G???</Center>
                  </Field>
                  <Field>
                    <AffixLabel
                      theme="green"
                      help={
                        <>
                          <div>Flink ??? JobManager ??? CPU ???????????????</div>
                          <div>??????????????? 0.5???JobManager CU???8</div>
                        </>
                      }
                    >
                      JM ??????
                    </AffixLabel>
                    <Control tw="pl-7 pt-3 w-80!">
                      <Slider
                        min={0}
                        max={8}
                        step={1}
                        marks={marks}
                        hasTooltip
                        markDots
                        tipFormatter={(v) => `${v === 0 ? '0.5' : v} CU`}
                        disabled={viewMode}
                        value={params.job_cu}
                        onChange={(v: number) => {
                          setParams((draft) => {
                            draft.job_cu = v === 0 ? 0.5 : v
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
                        upHandler={(v: number) => {
                          setParams((draft) => {
                            const fmVal = Math.ceil(v)
                            draft.job_cu = fmVal === 0 ? 0.5 : fmVal
                          })
                        }}
                        downHandler={(v: number) => {
                          setParams((draft) => {
                            const fmVal = Math.floor(v)
                            draft.job_cu = fmVal === 0 ? 0.5 : fmVal
                          })
                        }}
                      />
                    </Control>
                    <Center tw="ml-3 text-neut-8">?????? CU???1??? 4G???</Center>
                  </Field>
                  <Field>
                    <div tw="space-x-1">
                      <span>??????????????? CU =</span>
                      <span css={[totalCU > 12 && tw`text-red-10`]}>
                        {totalCU}
                      </span>
                      <span tw="text-neut-8">
                        [ ?????????????????????????????? CU=TM ?????? * TM ??????(CU) + JM
                        ??????(CU)]
                      </span>
                    </div>
                    <div
                      css={[
                        totalCU <= 12 && tw`hidden`,
                        tw`text-red-10 w-full ml-24 mt-1`,
                      ]}
                    >
                      ??????????????? CU ???????????? 12??????????????????????????????
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
                    <span>????????????</span>
                  </FlexBox>
                }
              >
                <Form ref={networkFormRef} layout="column">
                  <SelectWithRefresh
                    label={
                      <AffixLabel tw="font-medium text-sm">????????????</AffixLabel>
                    }
                    name="network_id"
                    value={params.network_id}
                    validateOnChange
                    disabled={viewMode}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.network_id = v
                      })
                    }}
                    onRefresh={() => {
                      queryClient.invalidateQueries(getNetworkKey())
                    }}
                    schemas={[
                      {
                        rule: {
                          required: true,
                          isExisty: false,
                        },
                        status: 'error',
                        help: (
                          <>
                            ???????????????,?????????????????? VPC????????????
                            <span
                              tw="text-green-11 cursor-pointer"
                              onClick={() => dmStore.setNetWorkOp('create')}
                            >
                              ?????? VPC
                            </span>
                          </>
                        ),
                      },
                    ]}
                    options={networks.map(({ name, id }) => ({
                      label: name,
                      value: id,
                    }))}
                    isLoading={networksRet.isFetching}
                    isLoadingAtBottom
                    searchable={false}
                    onMenuScrollToBottom={() => {
                      if (networksRet.hasNextPage) {
                        networksRet.fetchNextPage()
                      }
                    }}
                    bottomTextVisible
                    help={
                      <div>
                        ?????????????????? VPC????????????
                        <span
                          tw="text-green-11 cursor-pointer"
                          onClick={() => dmStore.setNetWorkOp('create')}
                        >
                          ?????? VPC
                        </span>
                      </div>
                    }
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
                    <span>????????????</span>
                  </FlexBox>
                }
              >
                <Form>
                  <SelectField
                    label={
                      <AffixLabel
                        theme="green"
                        help={
                          <>
                            <div>
                              TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR
                            </div>
                            <div>
                              TRACE ??????????????????????????????????????????ERROR
                              ???????????????????????????????????????
                            </div>
                          </>
                        }
                      >
                        ????????????
                      </AffixLabel>
                    }
                    name="root_log_level"
                    disabled={viewMode}
                    value={params.config.logger.root_log_level}
                    onChange={(v: string) => {
                      setParams((draft) => {
                        draft.config.logger.root_log_level = v
                      })
                    }}
                    options={[
                      { label: 'TRACE???????????????', value: 'TRACE' },
                      { label: 'DEBUG???????????????', value: 'DEBUG' },
                      { label: 'INFO???????????????', value: 'INFO' },
                      { label: 'WARN???????????????', value: 'WARN' },
                      { label: 'ERROR???????????????', value: 'ERROR' },
                    ]}
                    help={<div>????????????????????????</div>}
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
                    <span>????????????</span>
                  </FlexBox>
                }
              >
                <Form ref={optFormRef}>
                  <KVTextAreaFieldWrapper
                    disabled={viewMode}
                    label="Host??????"
                    title="Hosts ??????"
                    name="host_aliases"
                    kvs={['IP', 'Hostname']}
                    validateOnBlur
                    defaultValue={params.host_aliases.items
                      ?.map(
                        (item: { hostname: string; ip: string }) =>
                          `${item.ip} ${item.hostname}`
                      )
                      .join('\r\n')}
                    placeholder={`????????? IP hostname ?????????????????????????????????????????????
192.168.3.2 proxy.mgmt.pitrix.yunify.com
192.168.2.8 pgpool.mgmt.pitrix.yunify.com`}
                    schemas={[
                      {
                        rule: isKvStr,
                        help: '???????????????,????????? IP hostname?????????????????????????????????',
                        status: 'error',
                      },
                    ]}
                    onChange={sethostAliases}
                  />
                  <KVTextAreaFieldWrapper
                    disabled={viewMode}
                    label={
                      <AffixLabel
                        required={false}
                        help={
                          <div>
                            Flink ??????
                            <TextLink
                              href="https://nightlies.apache.org/flink/flink-docs-master/docs/deployment/config/"
                              color="white"
                              tw="ml-1"
                            >
                              ????????????
                            </TextLink>
                          </div>
                        }
                      >
                        Flink??????
                      </AffixLabel>
                    }
                    name="custom"
                    validateOnBlur
                    division=":"
                    defaultValue={params.config.custom
                      ?.map(
                        (item: { key: string; value: string }) =>
                          `${item.key} ${item.value}`
                      )
                      .join('\r\n')}
                    placeholder={`Flink ???????????????, yaml ????????????????????????????????????
?????????
key01:value01
key02:value02`}
                    schemas={[
                      {
                        rule: isKvStr,
                        help: '???????????????,????????? key value?????????????????????????????????',
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
            {op === 'view' ? (
              <div>
                <div tw="text-base font-semibold mb-4">????????????</div>
                <FlexBox>
                  <div tw="w-24 text-right">???????????????</div>
                  <div tw="text-neut-8">????????????</div>
                </FlexBox>
                <FlexBox>
                  <div tw="w-24 text-right">?????????????????????</div>
                  <div tw="text-neut-8">
                    {dayjs(params.created * 1000).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </FlexBox>
                <FlexBox>
                  <div tw="w-24 text-right">?????????????????????</div>
                  <div tw="text-neut-8">?????????</div>
                </FlexBox>
                <FlexBox>
                  <div tw="w-24 text-right">?????????</div>
                  <div tw="text-neut-8">
                    ??0 <del>0.281</del> ?????????
                    <span tw="text-[#B24B06] ml-1">????????????</span>
                  </div>
                </FlexBox>
              </div>
            ) : (
              <>
                <div tw="text-base font-semibold">????????????</div>
                <RadioGroup value={1}>
                  <RadioButton value={1}>????????????</RadioButton>
                  <Tippy
                    theme="light"
                    animation="fade"
                    arrow
                    delay={100}
                    offset={[60, 10]}
                    content={
                      <Center tw="h-9 px-3 text-neut-13">
                        ???????????????????????????????????????
                      </Center>
                    }
                  >
                    <div>
                      <RadioButton
                        value={2}
                        tw="bg-neut-13! text-neut-8! cursor-not-allowed"
                      >
                        ????????????
                      </RadioButton>
                    </div>
                  </Tippy>
                </RadioGroup>
                <div>
                  <InDemandTitle tw="text-sm">
                    TM ?????????<span>{params.task_num}</span>
                  </InDemandTitle>
                  <div tw="text-neut-8">Flink ??? TaskNumber ?????????</div>
                </div>
                <div>
                  <InDemandTitle tw="text-sm">
                    TM ?????????<span>{params.task_cu}</span>
                  </InDemandTitle>
                  <div tw="text-neut-8">
                    Flink ??? TaskManager ??? CPU ???????????????
                  </div>
                </div>
                <div>
                  <InDemandTitle tw="text-sm">
                    JM ?????????<span>{params.job_cu}</span>
                  </InDemandTitle>
                  <div tw="text-neut-8">
                    Flink ??? JobManager ??? CPU ???????????????
                  </div>
                </div>
                <div>
                  <InDemandTitle tw="text-sm">
                    ??????????????? CU???
                    <span css={[totalCU > 12 && tw`text-red-10!`]}>
                      {totalCU}
                    </span>
                  </InDemandTitle>
                  <div tw="text-neut-8">
                    [??????????????? CU=TM ?????? * TM ?????? + JM ??????]
                  </div>
                </div>
                <div tw="pt-4 pb-2 border-b border-neut-13">
                  ??????????????????
                  {/* <a href="###" className="link"> */}
                  <HelpCenterLink href="/billing/price/" isIframe={false}>
                    ????????????????????????????????????
                  </HelpCenterLink>
                  {/* <QIcon name="if-external-link" /> */}
                </div>
                <div>
                  <FlexBox tw="justify-between">
                    <div tw="text-sm">??????</div>
                    <div tw="text-neut-8">
                      <span tw="text-xl text-green-11">?? 0</span>{' '}
                      <del tw="">8.1245/??????</del>
                    </div>
                  </FlexBox>
                  <FlexBox tw="justify-between">
                    <div
                      tw="rounded-sm px-1"
                      css={css`
                        background: #b34b06;
                      `}
                    >
                      ???????????????????????????
                    </div>

                    <div tw="text-neut-8">
                      (??? <span tw="text-green-11">??0</span> <del>2718</del>{' '}
                      ?????? )
                    </div>
                  </FlexBox>
                </div>
              </>
            )}
          </div>
        </FlexBox>
        {dmStore.networkOp === 'create' && <NetworkModal appendToBody />}
      </Modal>
    )
  }
)

export default ClusterModal
