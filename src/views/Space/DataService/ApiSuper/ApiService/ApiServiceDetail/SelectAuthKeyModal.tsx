import { Modal } from 'components'
import { getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { assign } from 'lodash-es'

import { useQueryClient } from 'react-query'
import { useState } from 'react'
import AuthKeyTable from '../../AuthKey/AuthKeyTable'

interface AuthKeyModalProps {
  onCancel?: () => void
  apiServiceId?: string
}

const AuthKeyModal = (props: AuthKeyModalProps) => {
  const { onCancel, apiServiceId } = props
  const queryClient = useQueryClient()

  const mutation = useMutationAuthKey()
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>()

  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getQueryKeyListAuthKeys())
  }

  const handelCancel = () => {
    onCancel?.()
  }

  const handleOk = () => {
    const paramsData = assign({
      option: 'bind' as any,
      auth_key_id: selectedRowKeys,
      api_service_ids: [apiServiceId]
    })
    mutation.mutate(paramsData, {
      onSuccess: () => {
        refetchData()
        handelCancel()
      }
    })
  }

  const onSelect = (rowKeys: string[]) => {
    setSelectedRowKeys(rowKeys)
  }

  return (
    <Modal
      title="选择密钥"
      confirmLoading={mutation.isLoading}
      visible
      onOk={handleOk}
      onCancel={handelCancel}
      width={1200}
      height={800}
      draggable
      okText="确认"
      appendToBody
    >
      <AuthKeyTable onSelect={onSelect} />
    </Modal>
  )
}

export default AuthKeyModal
