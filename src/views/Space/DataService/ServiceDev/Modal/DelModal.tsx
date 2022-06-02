import { Confirm } from 'components'
import tw, { css } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { Button } from '@QCFE/lego-ui'

export interface JobModalData {
  id: string
  pid: string
  type: number
  isApiGroup: boolean
  pNode?: Record<string, any>
}

interface JobModalProps {
  isApiGroup?: boolean
  onClose?: (data?: JobModalData) => void
}

export const JobModal = observer((props: JobModalProps) => {
  const { isApiGroup = false, onClose } = props

  const handleOK = () => {}

  return (
    <Confirm
      title={`删除API ${isApiGroup ? '服务组' : ':'} ${'xxx'}(ID)`}
      visible
      css={css`
        .modal-card-head {
          ${tw`border-0`}
        }
      `}
      type="warn"
      width={400}
      maskClosable={false}
      appendToBody
      draggable
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={() => onClose?.()}>取消</Button>
          <Button type="danger" onClick={handleOK}>
            删除
          </Button>
        </div>
      }
    >
      <div>
        {isApiGroup
          ? '删除 API 服务组 XXXX 以及组内包含的 API，同时下线组内所有已发布 API，请谨慎操作，删除后不可恢复。'
          : '如 API 已发布，删除的同时会下线 API，不可访问、测试，请谨慎操作，删除后不可恢复。'}
      </div>
    </Confirm>
  )
})

export default JobModal
