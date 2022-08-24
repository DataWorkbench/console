import { FlexBox, Modal, AffixLabel } from 'components'
import { getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { assign } from 'lodash-es'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { Form } from '@QCFE/lego-ui'

import { useQueryClient } from 'react-query'
import { useRef } from 'react'
import { nameMatchRegexMin4Char } from 'utils/convert'
import { useImmer } from 'use-immer'
import { PbmodelAuthKeyEntity } from 'types/types'
import { FormWrapper } from '../styles'

interface AuthKeyModalProps {
  curOp: 'create' | 'update'
  curAuthRow?: PbmodelAuthKeyEntity | null
  onCancel?: () => void
}
const { TextField } = Form

const AuthKeyModal = (props: AuthKeyModalProps) => {
  const { curOp, curAuthRow, onCancel } = props
  const queryClient = useQueryClient()
  const [params, setParams] = useImmer({ name: curAuthRow?.name })

  const formRef = useRef<Form>(null)
  const mutation = useMutationAuthKey()

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListAuthKeys())
  }

  const handelCancel = () => {
    setParams((draft) => {
      draft.name = ''
    })
    onCancel?.()
  }
  const handleOk = () => {
    const form = formRef.current
    if (form?.validateFields()) {
      const paramsData = assign(
        {
          option: curOp as any,
          name: params.name
        },
        curOp === 'update' && { auth_key_id: curAuthRow?.id }
      )
      mutation.mutate(paramsData, {
        onSuccess: (res) => {
          if (res.ret_code === 0) {
            Notify.success({
              title: '操作提示',
              content: '操作成功',
              placement: 'bottomRight'
            })
            refetchData()
            handelCancel()
          }
        }
      })
    }
  }

  return (
    <Modal
      title={`${curOp === 'create' ? '创建' : '编辑'}密钥`}
      confirmLoading={mutation.isLoading}
      visible
      onOk={handleOk}
      onCancel={handelCancel}
      width={800}
      height={300}
      draggable
      okText={`${curOp === 'create' ? '创建' : '确认'}`}
      appendToBody
    >
      <FlexBox tw="h-full overflow-hidden">
        <FormWrapper>
          <Form ref={formRef}>
            <TextField
              autoComplete="off"
              label={<AffixLabel>名称</AffixLabel>}
              placeholder="请输入密钥名称"
              name="name"
              validateOnBlur
              value={params.name}
              validateOnChange
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.name = v
                })
              }}
              schemas={[
                {
                  rule: (value: string) => nameMatchRegexMin4Char.test(value),
                  status: 'error',
                  help: '请输入英文字母、数字、下划线(_)，不能以下划线(_)开头或结尾，4~50 个字符'
                }
              ]}
              help="支持英文字母、数字、下划线(_)，不能以下划线(_)开头或结尾，4~50 个字符"
            />
          </Form>
        </FormWrapper>
      </FlexBox>
    </Modal>
  )
}

export default AuthKeyModal
