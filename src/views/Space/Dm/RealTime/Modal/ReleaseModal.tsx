import { useRef } from 'react'
import { Form, RadioGroup } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { styled, css } from 'twin.macro'
import { Modal } from 'components'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import {
  useMutationReleaseStreamJob,
  useMutationReleaseSyncJob,
  useQueryStreamJobSchedule,
  useQuerySyncJobSchedule,
  useStore,
} from 'hooks'
import { strlen } from 'utils'

const { TextAreaField } = Form

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-body {
      ${tw`py-0`}
    }
  `,
])

const ReleaseModal = ({
  onCancel,
  onSuccess,
  onOk: onOkProp,
}: {
  onCancel?: () => void
  onSuccess?: () => void
  onOk: (isSubmit?: boolean, cb?: Function) => void
}) => {
  const {
    workFlowStore: { curJob },
  } = useStore()
  const form = useRef<Form>(null)
  const useMutationReleaseJob =
    curJob?.jobMode === 'RT'
      ? useMutationReleaseStreamJob
      : useMutationReleaseSyncJob
  const releaseMutation = useMutationReleaseJob()
  const useQueryJobSchedule =
    curJob?.jobMode === 'RT'
      ? useQueryStreamJobSchedule
      : useQuerySyncJobSchedule
  const { data: scheData } = useQueryJobSchedule()

  const [params, setParams] = useImmer({
    desc: '',
    stopRunning: false,
  })
  const concurrency = [
    {
      value: 1,
      text: '允许',
      desc: '同一时间，允许运行多个作业实例',
      ntEndDesc:
        '如有实例正在运行，本次发布并执行后，新生成的实例会与当前正在运行中的实例同时运行',
    },
    {
      value: 2,
      text: '禁止',
      desc: '同一时间，只允许运行一个作业实例, 如果到达调度周期的执行时间点时上一个实例还没有运行完成, 则放弃本次实例的运行',
      ntEndDesc: '如有实例正在运行，本次发布成功后，会被忽略执行',
    },
    {
      value: 3,
      text: '替换',
      desc: '同一时间，只允许运行一个作业实例，如果到达调度周期的执行点时上一个实例还没运行完成, 则将这个实例终止, 然后启动新的实例',
      ntEndDesc:
        '如有实例正在运行，本次发布并执行后，当前运行中的实例会被强制终止, 并启动新的实例',
    },
  ].find((o) => o.value === get(scheData, 'concurrency_policy'))

  const onOk = () => {
    if (form.current?.validateForm()) {
      onOkProp(true, () => {
        releaseMutation.mutate(
          {
            desc: params.desc,
            stop_running: params.stopRunning,
          },
          {
            onSuccess: () => {
              if (onSuccess) {
                onSuccess()
              }
            },
          }
        )
      })
    }
  }
  return (
    <ModalWrapper
      visible
      noBorder
      onCancel={onCancel}
      onOk={onOk}
      okText="发布"
      confirmLoading={releaseMutation.isLoading}
      escClosable={!releaseMutation.isLoading}
      maskClosable={!releaseMutation.isLoading}
    >
      <div tw="flex">
        <Icon
          name="exclamation"
          color={{ secondary: '#F5C414', primary: '' }}
          size={20}
        />
        <div tw="ml-3">
          <div tw="text-base">发布此作业至调度系统</div>
          <div tw="mt-2 text-neut-8">
            调度系统将根据当前作业的调度配置和运行参数进行调度和执行作业
          </div>
        </div>
      </div>
      <div tw="mt-4">
        <Form layout="vertical" tw="max-w-full!" ref={form}>
          <TextAreaField
            label=""
            name="desc"
            autoComplete="off"
            rows={3}
            placeholder="请输入描述信息"
            validateOnChange
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
            value={params.desc}
            onChange={(v: string | number) =>
              setParams((draft) => {
                draft.desc = String(v)
              })
            }
          />
        </Form>
        <div tw="border-b mb-3 border-neut-13" />
        {concurrency && (
          <div tw="mb-3">
            <div>当前并发策略：“{concurrency.text}”</div>
            <div tw="text-neut-8">{concurrency.desc}</div>
          </div>
        )}
        <div>
          <RadioGroup
            direction="column"
            name="stoprunning"
            value={params.stopRunning}
            onChange={(v) => {
              setParams((draft) => {
                draft.stopRunning = v
              })
            }}
            options={[
              {
                label: (
                  <>
                    <span>不终止 当前作业正在运行中的实例</span>
                    <div tw="ml-5 text-neut-8">{concurrency?.ntEndDesc}</div>
                  </>
                ),
                value: false,
              },
              {
                label: (
                  <>
                    <span>终止 当前作业正在运行中的实例</span>
                    <div tw="ml-5 text-neut-8">
                      如有实例正在运行 ，此运行中的实例会被强制终止
                    </div>
                  </>
                ),
                value: true,
              },
            ]}
          />
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ReleaseModal
