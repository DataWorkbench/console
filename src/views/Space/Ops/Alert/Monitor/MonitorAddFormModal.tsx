import { Button, Form, Icon, InputNumber } from '@QCFE/qingcloud-portal-ui'
import {
  AffixLabel,
  Center,
  FlexBox,
  Modal,
  ModalContent,
  Tooltip,
} from 'components/index'
import { Checkbox, Field, Label, RadioButton } from '@QCFE/lego-ui'
import tw, { css, styled } from 'twin.macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useImmer } from 'use-immer'
import { flatten, get, isEqual, pick, set } from 'lodash-es'
import { monitorObjectTypes } from 'views/Space/Ops/Alert/common/constants'
import { toJS } from 'mobx'
import { useParams } from 'react-router-dom'
import { PbmodelAlertPolicy } from 'types/types'
import {
  // useQueryListAvailableUsers,
  useQueryListNotifications,
} from 'hooks/useMember'
import { useMutationAlert } from 'hooks/useAlert'
import { observer } from 'mobx-react-lite'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import JobSelectModal from './JobSelectModal'

const { TextField, TextAreaField, RadioGroupField, SelectField } = Form

const HiddenTextField = styled(TextField)`
  .control {
    ${tw`hidden!`}
  }
`

const Item = ({
  id,
  onDelete,
}: {
  id: string
  onDelete: (s: string) => void
}) => {
  return (
    <Center tw="gap-3 h-6 bg-neut-13 px-2">
      <span tw="text-white">{`ID: ${id}`}</span>
      <Icon
        clickable
        onClick={() => onDelete(id)}
        name="if-close"
        size={16}
        type="light"
      />
    </Center>
  )
}

interface IMonitorAddProps {
  onCancel: () => void
  data?: PbmodelAlertPolicy
  getQueryListKey?: () => string
}

const formStyle = {
  wrapper: tw`pl-0!`,
  itemWrapper: tw`w-full h-12 bg-neut-17 rounded-[2px] items-center pl-4`,
  textarea: css`
    & textarea.textarea {
      ${tw`min-w-[500px]!`}
    }
  `,
}

const getData = (data: Record<string, any>) => {
  const d: Record<string, any> = toJS(data) ?? {}
  let type = ''
  if (d?.monitor_object === 1) {
    type = 'stream_job'
  } else if (d?.monitor_object === 2) {
    type = 'sync_job'
  }
  if (type) {
    d.instance_run_failed_flag = get(
      d,
      `monitor_item.${type}.instance_run_failed`
    )
    d.instance_run_timeout_flag = get(
      d,
      `monitor_item.${type}.instance_run_timeout`
    )
    d.instance_run_timeout = get(d, `monitor_item.${type}.instance_timeout`)
    d.notification_ids = get(d, 'notification_ids', '').split(',')
  }
  return d
}

const MonitorAddFormModal = observer((props: IMonitorAddProps) => {
  const { onCancel, data } = props
  const { getQueryListKey, jobDetail } = useAlertStore()

  const form = useRef<Form>()
  const [value, setValue] = useImmer<
    Partial<Record<keyof PbmodelAlertPolicy | string, any>>
  >(() => {
    return getData(data as any)
  })

  useEffect(() => {
    const v = data ?? {}
    if (!isEqual(value, v)) {
      setValue(getData(v))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, data])

  const isEdit = useMemo(() => !!data?.id, [data])
  const op = useMemo(() => (isEdit ? 'update' : 'create'), [isEdit])

  const { mutateAsync, isLoading } = useMutationAlert({}, getQueryListKey)

  const {
    data: users,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useQueryListNotifications({})

  const userOptions = flatten(
    users?.pages.map((page: Record<string, any>) => page.infos || [])
  )

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  const [visible, setVisible] = useState(false)

  const { spaceId } = useParams<{ spaceId: string }>()
  return (
    <Modal
      visible
      width={800}
      orient="fullright"
      onOk={() => {
        if (form.current?.validateForm?.()) {
          const d = pick(value, [
            'id',
            'status',
            'job_ids',
            'monitor_object',
            'name',
            'desc',
            'notification_ids',
          ])
          if (jobDetail?.jobType) {
            set(d, 'monitor_object', jobDetail?.jobType)
          }
          set(d, 'trigger_action', 1)
          set(d, 'trigger_rule', 1)
          const item = {
            instance_run_failed: value?.instance_run_failed_flag,
            instance_run_timeout: value?.instance_run_timeout_flag,
            instance_timeout: value?.instance_run_timeout,
          }
          if (d.monitor_object === 1) {
            set(d, 'monitor_item', {
              stream_job: item,
            })
          } else {
            set(d, 'monitor_item', {
              sync_job: item,
            })
          }
          set(d, 'space_id', spaceId)
          mutateAsync({ uri: { alert_id: value?.id }, data: d, op }).then(
            () => {
              onCancel()
            }
          )
        }
      }}
      onCancel={onCancel}
      title={isEdit ? '编辑告警策略' : '创建告警策略'}
      appendToBody
      showConfirmLoading
      confirmLoading={isLoading}
    >
      <ModalContent>
        <div
          css={css`
            .form.is-horizon-layout > .field > .control {
              max-width: unset !important;
            }
          `}
        >
          <Form css={formStyle.wrapper} ref={form}>
            <TextField
              label="名称"
              name="name"
              labelClassName="label-required"
              placeholder="请输入告警策略名称"
              value={value?.name}
              onChange={(v) =>
                setValue((draft) => {
                  draft.name = v
                })
              }
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入告警策略名称',
                  status: 'error',
                },
              ]}
            />
            {jobDetail?.jobType && (
              <Field>
                <Label tw="label-required">监控对象</Label>
                <span>
                  {monitorObjectTypes[jobDetail?.jobType as 1]?.label}
                </span>
              </Field>
            )}
            {!jobDetail?.jobType &&
              (isEdit ? (
                <Field>
                  <Label tw="label-required">监控对象</Label>
                  <span>
                    {monitorObjectTypes[value?.monitor_object as 1]?.label}
                  </span>
                </Field>
              ) : (
                <RadioGroupField
                  label={<AffixLabel required>监控对象</AffixLabel>}
                  name="monitor-object"
                  onChange={(e) => {
                    setValue((draft) => {
                      draft.monitor_object = e
                      draft.job_ids = []
                    })
                  }}
                  validateOnChange
                  value={value?.monitor_object}
                  schemas={[
                    {
                      rule: { required: true },
                      help: '请选择监控对象',
                      status: 'error',
                    },
                  ]}
                >
                  <RadioButton value={1}>流式计算作业</RadioButton>
                  <RadioButton value={2}>数据集成作业</RadioButton>
                </RadioGroupField>
              ))}

            <Field>
              <Label tw="label-required mt-2 items-baseline!	">监控项</Label>
              <div tw="w-[640px]">
                <FlexBox css={formStyle.itemWrapper} tw="mb-2">
                  <Checkbox
                    tw="w-[180px]"
                    checked={value?.instance_run_failed_flag}
                    onChange={(e, checked) => {
                      setValue((draft) => {
                        draft.instance_run_failed_flag = checked
                      })
                    }}
                  >
                    作业实例失败数
                  </Checkbox>
                </FlexBox>
                <FlexBox css={formStyle.itemWrapper}>
                  <Checkbox
                    tw="w-[180px]"
                    checked={value?.instance_run_timeout_flag}
                    onChange={(e, checked) => {
                      setValue((draft) => {
                        draft.instance_run_timeout_flag = checked
                      })
                    }}
                  >
                    作业实例运行时超时
                  </Checkbox>

                  <InputNumber
                    min={0}
                    showButton={false}
                    placeholder="请输入"
                    tw="w-24"
                    value={value?.instance_run_timeout}
                    onChange={(e) => {
                      setValue((draft) => {
                        draft.instance_run_timeout = e
                      })
                    }}
                  />
                  <span tw="ml-2">秒</span>
                </FlexBox>
              </div>
            </Field>
            <HiddenTextField
              name="monitor-item"
              label={null}
              key={`${value?.instance_run_failed_flag}-${value?.instance_run_timeout_flag}-${value?.instance_run_timeout}`}
              value={{
                instance_run_failed_flag: value?.instance_run_failed_flag,
                instance_run_timeout_flag: value?.instance_run_timeout_flag,
                instance_run_timeout: value?.instance_run_timeout,
              }}
              schemas={[
                {
                  rule: (v) => {
                    return !(
                      !v.instance_run_failed_flag &&
                      !v.instance_run_timeout_flag
                    )
                  },
                  help: '监控项不能为空',
                  status: 'error',
                },
              ]}
            />

            <Field>
              <Label tw="label-required">触发规则</Label>
              <span>触发任意一项监控项</span>
            </Field>
            <Field>
              <Label tw="label-required">触发行为</Label>
              <span>发送通知</span>
            </Field>
            {!jobDetail?.jobId && (
              <>
                <Field tw="mb-1!" label="绑定作业">
                  <Label tw="label-required mt-2 items-baseline!">
                    绑定作业
                  </Label>
                  <div>
                    {value?.monitor_object ? (
                      <Button
                        type="black"
                        onClick={() => setVisible(true)}
                        disabled={!value?.monitor_object}
                      >
                        <Icon name="add" type="light" />
                        选择作业
                      </Button>
                    ) : (
                      <Tooltip
                        hasPadding
                        theme="light"
                        content="请先选择监控对象"
                      >
                        <Button type="black" disabled>
                          <Icon name="add" type="light" />
                          选择作业
                        </Button>
                      </Tooltip>
                    )}
                    {Array.isArray(value?.job_ids) &&
                      value?.job_ids.length > 0 && (
                        <div tw="mt-1 flex flex-wrap w-[640px] gap-1">
                          {value?.job_ids.map((i) => (
                            <Item
                              id={i}
                              key={i}
                              onDelete={(id) =>
                                setValue((draft) => {
                                  draft.job_ids = draft.job_ids?.filter(
                                    (j) => j !== id
                                  )
                                })
                              }
                            />
                          ))}
                        </div>
                      )}
                  </div>
                </Field>
                <HiddenTextField
                  name="job_ids"
                  label={null}
                  value={value?.job_ids}
                  key={value?.job_ids?.length}
                  schemas={[
                    {
                      rule: () => {
                        return !!value?.job_ids?.length
                      },
                      help: '请选择绑定作业',
                      status: 'error',
                    },
                  ]}
                />
              </>
            )}

            {/* <AdduserField label="消息接受人" labelClasName="label-required" /> */}
            <SelectField
              name="notify_user_ids"
              label={<AffixLabel required>消息接收人</AffixLabel>}
              value={value?.notification_ids ?? []}
              onChange={(e) => {
                setValue((draft) => {
                  draft.notification_ids = e
                })
              }}
              multi
              options={userOptions}
              isLoading={isFetching}
              isLoadingAtBottom
              labelKey="name"
              onMenuScrollToBottom={loadData}
              bottomTextVisible
              validateOnChange
              valueKey="id"
              clearable
              schemas={[
                {
                  rule: (v) => {
                    return Array.isArray(v) && v.length
                  },
                  help: '请选择消息接收人',
                  status: 'error',
                },
              ]}
            />

            <TextAreaField
              label="策略描述"
              name="description"
              value={value?.desc}
              onChange={(e) => {
                setValue((draft) => {
                  draft.desc = e
                })
              }}
              placeholder="请输入策略描述"
              css={formStyle.textarea}
              schemas={[
                {
                  rule: {
                    max: 1024,
                  },
                  help: '策略描述不能超过1024个字符',
                  status: 'error',
                },
              ]}
            />
          </Form>
        </div>
        {visible && (
          <JobSelectModal
            onCancel={() => setVisible(false)}
            type={value?.monitor_object as 1}
            value={value?.job_ids ?? []}
            onOk={(e) => {
              setValue((draft) => {
                draft.job_ids = e
              })
              setVisible(false)
            }}
          />
        )}
      </ModalContent>
    </Modal>
  )
})

export default MonitorAddFormModal
