import { useEffect, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import { noop } from 'lodash-es'
import DataSourceList from './DataSourceList'

interface DataSourceSelectModalProps {
  visible?: boolean | null
  title: string
  sourceType: number
  onCancel?: () => void
  onOk?: (source: any) => void
}

const DataSourceSelectModal = (props: DataSourceSelectModalProps) => {
  const { title, onCancel, onOk = noop, visible: show, sourceType } = props
  const [visible, setVisible] = useState(show)
  const [source, setSource] = useState(null)

  useEffect(() => {
    setVisible(show)
  }, [show])
  return (
    <>
      {visible && (
        <Modal
          title={title}
          visible
          draggable
          width={1200}
          appendToBody
          onCancel={onCancel}
          onOk={() => {
            onOk(source)
          }}
        >
          <DataSourceList
            selectMode
            sourceType={sourceType}
            onCheck={setSource}
          />
        </Modal>
      )}
    </>
  )
}

export default DataSourceSelectModal
