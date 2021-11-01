import { TextArea, Input } from '@QCFE/lego-ui'
import { FlexBox } from 'components/Box'

interface IKVTextArea {
  type?: 'batch' | 'single'
  title?: string
  className?: string
}

const KVTextArea = ({
  type = 'batch',
  title = '',
  className = '',
}: IKVTextArea) => {
  return type === 'batch' ? (
    <div className={className}>
      <div tw="flex pl-4 h-8 mb-3 items-center bg-neut-17">
        <span>{title}</span>
      </div>
      <TextArea />
    </div>
  ) : (
    <div>
      <FlexBox>
        <Input />
        <Input />
      </FlexBox>
      <FlexBox>
        <Input />
        <Input />
      </FlexBox>
    </div>
  )
}

export default KVTextArea
