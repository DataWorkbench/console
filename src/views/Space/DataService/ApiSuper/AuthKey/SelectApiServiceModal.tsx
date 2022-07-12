import { Modal } from 'components'
import { getQueryKeyListAuthKeys, useMutationAuthKey } from 'hooks'
import { assign } from 'lodash-es'

import { useQueryClient } from 'react-query'
import { useMemo, useState } from 'react'
import { PbmodelAuthKeyEntity } from 'types/types'
import { Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import ApiGroupTable from '../ApiService/ApiGroupTable'

interface AuthKeyModalProps {
  onCancel?: () => void
  infos?: any[] // 当前选中已经绑定的api_service
  curAuthRow?: PbmodelAuthKeyEntity | null
}

const AuthKeyModal = (props: AuthKeyModalProps) => {
  const { onCancel, curAuthRow, infos } = props
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
    if (selectedRowKeys?.length === 0) {
      Notify.warning({
        title: '操作提示',
        content: '请选择至少一个API服务组',
        placement: 'bottomRight'
      })
      return
    }
    const paramsData = assign({
      option: 'bind' as any,
      auth_key_id: curAuthRow?.id,
      api_service_ids: selectedRowKeys
    })
    mutation.mutate(paramsData, {
      onSuccess: (res) => {
        if (res.ret_code === 0) {
          Notify.success({
            title: '操作提示',
            content: '绑定成功',
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

  const rowKeys = useMemo(() => {
    if (infos) {
      return infos.map((item) => item.id)
    }
    return []
  }, [infos])

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
      <ApiGroupTable onSelect={onSelect} selectRowKeys={rowKeys} />
    </Modal>
  )
}

export default AuthKeyModal
