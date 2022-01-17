import { useRef } from 'react'
import { Checkbox, Form } from '@QCFE/lego-ui'
import { Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import tw, { styled, css } from 'twin.macro'
import { Modal, AffixLabel } from 'components'
import { useImmer } from 'use-immer'
import { useMutationReleaseStreamJob } from 'hooks'
import { strlen } from 'utils'

const { TextField } = Form

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
}: {
  onCancel?: () => void
  onSuccess?: () => void
}) => {
  const form = useRef<Form>(null)
  const releaseMutation = useMutationReleaseStreamJob()
  const [params, setParams] = useImmer({
    desc: '',
    stopRunning: false,
  })
  const onOk = () => {
    if (form.current?.validateForm()) {
      releaseMutation.mutate(
        {
          desc: params.desc,
          stop_running: params.stopRunning,
        },
        {
          onSuccess: () => {
            Notify.success({
              title: '操作提示',
              content: '发布成功',
              placement: 'bottomRight',
            })
            if (onSuccess) {
              onSuccess()
            }
          },
        }
      )
    }
  }
  return (
    <ModalWrapper
      visible
      noBorder
      onCancel={onCancel}
      onOk={onOk}
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
          <div tw="text-base">发布调度任务</div>
          <div tw="mt-2 text-neut-8">
            将根据当前调度配置和节点参数进行任务调度，您确定执行该操作吗？
          </div>
        </div>
      </div>
      <div tw="space-y-2">
        <Form layout="vertical" ref={form}>
          <TextField
            label="描述"
            name="desc"
            autoComplete="off"
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
        <div tw="border-b border-neut-13 pt-3" />
        <div tw="pt-2 flex items-center">
          <Checkbox
            checked={params.stopRunning}
            onChange={(e, checked) => {
              setParams((draft) => {
                draft.stopRunning = checked
              })
            }}
          />
          <AffixLabel
            tw="ml-2"
            required={false}
            theme="green"
            help="如果当前作业有任务实例正在运行，勾选后发布，此运行中的任务实例会被强制终止"
          >
            终止当前作业正在运行中的实例
          </AffixLabel>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ReleaseModal
