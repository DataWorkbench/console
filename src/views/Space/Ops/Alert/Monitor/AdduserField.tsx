import { Control, Form } from '@QCFE/lego-ui'
import { Button, Icon, Select } from '@QCFE/qingcloud-portal-ui'
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, ModalContent } from 'components/Modal'
import tw from 'twin.macro'

const { TextField } = Form

interface IAdduserProps {}

interface IAdduserRefs {
  onBlur: () => void
  onFocus: () => void
}

const AdduserSelect = forwardRef(
  (props: IAdduserProps, ref: ForwardedRef<IAdduserRefs>) => {
    // eslint-disable-next-line no-empty-pattern
    const {} = props
    // todo 请求用户接口
    const [users] = useState([
      {
        label: 'user1',
        value: 'user1',
      },
      {
        label: 'user2',
        value: 'user2',
      },
      {
        label: 'user3',
        value: 'user3',
      },
    ])

    const [visible, setVisible] = useState(false)

    useImperativeHandle(ref, () => ({
      onBlur: () => {},
      onFocus: () => {},
    }))

    return (
      <Control>
        <Select
          tw="w-[500px] mb-0"
          css={`
            .control {
              ${tw`max-w-full!`}
            }
            .select {
              ${tw`w-[500px]`}
            }
          `}
          options={users}
          {...props}
          label={null}
          placeholder="请选择消息接收人"
        />
        <Button type="primary" tw="ml-2" onClick={() => setVisible(true)}>
          <Icon name="admin" />
          新增消息接收人
        </Button>
        <Modal
          appendToBody
          visible={visible}
          title="新增消息接收人"
          onCancel={() => setVisible(false)}
          onOk={() => setVisible(false)}
        >
          <ModalContent>
            <Form>
              <TextField name="user" label="消息接收人" options={users} />
            </Form>
          </ModalContent>
        </Modal>
      </Control>
    )
  }
)

const AdduserField = (Form as any).getFormField(AdduserSelect)

export default AdduserField
