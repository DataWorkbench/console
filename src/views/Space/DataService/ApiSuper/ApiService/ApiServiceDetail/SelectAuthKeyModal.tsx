import { Modal } from 'components'
import { getQueryKeyListApiServices, useMutationAuthKey } from 'hooks'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'

import { assign } from 'lodash-es'

import { useQueryClient } from 'react-query'
import { useState } from 'react'
// eslint-disable-next-line import/no-cycle
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
    // queryClient.invalidateQueries(getQueryKeyListAuthKeys())
    queryClient.invalidateQueries(getQueryKeyListApiServices())
  }

  const handelCancel = () => {
    onCancel?.()
  }

  const handleOk = () => {
    if (!selectedRowKeys?.length) {
      Notify.warning({
        title: '操作提示',
        content: '未选择任何密钥',
        placement: 'bottomRight'
      })
      return
    }
    const paramsData = assign({
      option: 'bind' as any,
      auth_key_id: selectedRowKeys,
      api_service_ids: [apiServiceId]
    })
    mutation.mutate(paramsData, {
      onSuccess: (res) => {
        if (res.ret_code === 0) {
          Notify.success({
            title: '操作提示',
            content: '密钥绑定成功',
            placement: 'bottomRight'
          })
          refetchData()
          handelCancel()
        }
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
