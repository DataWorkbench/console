import { Input, Checkbox } from '@QCFE/lego-ui'
import { Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import tw, { styled, css } from 'twin.macro'
import { Modal, AffixLabel } from 'components'
import { useImmer } from 'use-immer'
import { useMutationReleaseStreamJob } from 'hooks'

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-body {
      ${tw`py-0`}
    }
  `,
])

const ReleaseModal = ({ onCancel }: { onCancel: () => void }) => {
  const releaseMutation = useMutationReleaseStreamJob()
  const [params, setParams] = useImmer({
    desc: '',
    stopRunning: false,
  })
  const onOk = () => {
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
          onCancel()
        },
      }
    )
  }
  return (
    <ModalWrapper
      visible
      noBorder
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={releaseMutation.isLoading}
    >
      <div tw="flex">
        <Icon name="exclamation" color={{ secondary: '#F5C414' }} size={20} />
        <div tw="ml-3">
          <div tw="text-base">发布调度任务</div>
          <div tw="mt-2 text-neut-8">
            将根据当前调度配置和节点参数进行任务调度，您确定执行该操作吗？
          </div>
        </div>
      </div>
      <div tw="space-y-2">
        <div>描述</div>
        <div tw="w-80">
          <Input
            autocomplete="off"
            value={params.desc}
            onChange={(e: any, v: string | number) =>
              setParams((draft) => {
                draft.desc = String(v)
              })
            }
          />
        </div>
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
            help="如果当前作业有任务实例正在运行 ，勾选后发布，此运行中的任务实例会被强制终止"
          >
            终止当前作业正在运行中的实例
          </AffixLabel>
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ReleaseModal
