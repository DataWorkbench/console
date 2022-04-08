import { useEffect, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { noop } from 'lodash-es'
import DataSourceList from './DataSourceList'

interface DataSourceSelectModalProps {
  visible?: boolean | null
  title: string
  onCancel?: () => void
  onOk?: (source: any) => void
}

const DataSourceSelectModal = (props: DataSourceSelectModalProps) => {
  const { title, onCancel, onOk = noop, visible: show } = props
  const [visible, setVisible] = useState(show)
  const [source, setSource] = useState(null)

  useEffect(() => {
    setVisible(show)
  }, [show])

  return (
    <Modal
      title={title}
      visible={visible !== null}
      draggable
      width={1200}
      appendToBody
      css={!visible && tw`hidden!`}
      onCancel={onCancel}
      onOk={() => {
        onOk(source)
      }}
    >
      <DataSourceList selectMode onCheck={setSource} />
    </Modal>
  )
}

export default DataSourceSelectModal
