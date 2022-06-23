import { Modal } from 'components'
import { getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { assign } from 'lodash-es'

import { useQueryClient } from 'react-query'
import { useState } from 'react'
import { PbmodelAuthKeyEntity } from 'types/types'
import ApiGroupTable from '../ApiService/ApiGroupTable'

interface AuthKeyModalProps {
  onCancel?: () => void
  curAuthRow?: PbmodelAuthKeyEntity | null
}

const AuthKeyModal = (props: AuthKeyModalProps) => {
  const { onCancel, curAuthRow } = props
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
      auth_key_id: curAuthRow?.id,
      api_service_ids: selectedRowKeys
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
      title="选择 API 服务组"
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
      <ApiGroupTable onSelect={onSelect} />
    </Modal>
  )
}

export default AuthKeyModal
