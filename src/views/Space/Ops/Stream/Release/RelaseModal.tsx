import { Input } from '@QCFE/lego-ui'
import { Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import tw, { styled, css } from 'twin.macro'
import { Modal } from 'components'
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
      okText="发布"
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={releaseMutation.isLoading}
    >
      <div tw="flex">
        <Icon
          name="exclamation"
          color={{ primary: '', secondary: '#F5C414' }}
          size={20}
        />
        <div tw="ml-3">
          <div tw="text-base">发布调度任务</div>
          <div tw="mt-2 text-neut-8">
            将根据当前调度配置重新发布并生成新的作业版本，您确定执行该操作吗？
          </div>
        </div>
      </div>
      <div tw="space-y-2 mt-4 mb-5">
        <div>描述</div>
        <div tw="w-80">
          <Input
            autoComplete="off"
            value={params.desc}
            onChange={(e: any, v: string | number) =>
              setParams((draft) => {
                draft.desc = String(v)
              })
            }
          />
        </div>
      </div>
    </ModalWrapper>
  )
}

export default ReleaseModal
