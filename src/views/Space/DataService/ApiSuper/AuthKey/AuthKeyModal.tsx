import { FlexBox, Modal, AffixLabel } from 'components'
import { getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { assign } from 'lodash-es'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { Form } from '@QCFE/lego-ui'

import { useQueryClient } from 'react-query'
import { useRef } from 'react'
import { nameMatchRegex } from 'utils/convert'
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
              onChange={(v: string) => {
                setParams((draft) => {
                  draft.name = v
                })
              }}
              schemas={[
                {
                  rule: {
                    required: true,
                    matchRegex: nameMatchRegex,
                    maxLength: 50,
                    minLength: 2
                  },
                  status: 'error',
                  help: '不能为空，长度为 2～50 位。字母、数字或下划线（_）,不能以（_）开始结尾'
                }
              ]}
              help="最长 50 个字符，支持字母、数字、下划线、中划线。"
            />
          </Form>
        </FormWrapper>
      </FlexBox>
    </Modal>
  )
}

export default AuthKeyModal
