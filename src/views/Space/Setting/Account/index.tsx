import { Form, Icon, PageTab } from '@QCFE/qingcloud-portal-ui'
import { Button, Field, Label } from '@QCFE/lego-ui'
import { Card } from 'components/Card'
import { useRef, useState } from 'react'
import { Modal } from 'components/Modal'

import { AffixLabel } from 'components/AffixLabel'
import tw, { css } from 'twin.macro'
import { get, set } from 'lodash-es'
import { accountSettings, pageTabsData } from './constants'
import { useMutationUser } from '../../../../hooks/useGlobalAPI'

const { TextField } = Form

const formModalStyle = css`
  &.form.is-horizon-layout {
    ${tw`pl-5`}
  }

  &.form.is-horizon-layout > .field .label {
    ${tw`w-[128px]`}
  }

  &.form.is-horizon-layout > .field .help {
    ${tw`ml-[130px]`}
  }
`

const modalStyle = css`
  & .modal-card-body {
    ${tw`pt-8 pb-[66px]`}
  }
`

const cardStyles = {
  card: tw`px-20 pt-5 pb-7 leading-5`,
  title: tw`mb-3 text-[14px]`,
  row: [
    tw`mb-1 grid h-12 items-center border border-separator rounded-[6px] hover:bg-[rgba(226, 232, 240, 0.5)]`,
    css`
      & {
        grid-template-columns: 100px 1fr 110px;
      }
    `
  ]
}

const Account = () => {
  const userInfo: Record<string, any> = get(window, 'USER', {})
  const [visible, setVisible] = useState(false)
  const formRef = useRef<Form>(null)
  const { mutateAsync } = useMutationUser()
  const handleEdit = () => {
    setVisible(true)
  }
  const handleOk = () => {
    if (formRef.current?.validateFields()) {
      const { email } = formRef.current.getFieldsValue()
      mutateAsync({
        op: 'update',
        userId: userInfo?.user_id,
        email
      }).then(() => {
        set(window, 'USER.email', email)
        setVisible(false)
      })
    }
  }

  return (
    <div tw="py-5">
      <PageTab tabs={pageTabsData} />
      <Card tw="mt-5" css={cardStyles.card}>
        <div css={cardStyles.title}>基础设置</div>
        {accountSettings.map((item) => (
          <div css={cardStyles.row} key={item.dataIndex}>
            <div title="text-font-placeholder" tw="ml-6">
              {item.label}
            </div>
            <div tw="font-semibold">
              {item.dataIndex === 'password' ? '*******' : userInfo[item.dataIndex]}
            </div>
            {item.disabled ? (
              <div tw="text-font-placeholder cursor-not-allowed">不可编辑</div>
            ) : (
              <Button tw="w-[74px]" onClick={handleEdit}>
                <Icon name="if-pen" type="dark" />
                编辑
              </Button>
            )}
          </div>
        ))}
      </Card>
      {visible && (
        <Modal
          visible
          title="更改邮箱"
          width={600}
          appendToBody
          css={modalStyle}
          onCancel={() => setVisible(false)}
          onOk={handleOk}
        >
          <Form css={formModalStyle} ref={formRef}>
            <Field>
              <Label>原邮箱</Label>
              <span>{userInfo.email}</span>
            </Field>
            <TextField
              label={<AffixLabel required>新邮箱</AffixLabel>}
              name="email"
              placeholder="请输入新邮箱"
              validateOnBlur
              defaultValue={null}
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入新邮箱',
                  status: 'error'
                }
              ]}
            />
          </Form>
        </Modal>
      )}
    </div>
  )
}

export default Account
