import React from 'react'
import DataSourceForm from 'views/Space/Upcloud/DataSourceList/DataSourceForm'
import { Modal, ModalContent } from 'components'

interface IProps {
  onCancel: () => void
}

// todo 数据源 dark 模式
const DataSourceModal = (props: IProps) => {
  const { onCancel } = props
  const op = 'view'
  const opSourceList = [{}]
  const curkind = {
    name: 'Mysql',
  }

  return (
    <Modal
      width={800}
      onCancel={onCancel}
      appendToBody
      footer={null}
      orient="fullright"
      visible
      title="历史版本"
    >
      <ModalContent>
        <DataSourceForm op={op} opSourceList={opSourceList} resInfo={curkind} />
      </ModalContent>
    </Modal>
  )
}

export default DataSourceModal
