import { useEffect, useState } from 'react'
import { Modal } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { noop } from 'lodash-es'
import DataSourceList from './DataSourceList'

interface DataSourceSelectModalProps {
  visible?: boolean | null
  onCancel?: () => void
  onOk?: (source: any) => void
}

const DataSourceSelectModal = (props: DataSourceSelectModalProps) => {
  const { onCancel, onOk = noop, visible: show } = props
  const [visible, setVisible] = useState(show)
  const [source, setSource] = useState(null)

  useEffect(() => {
    setVisible(show)
  }, [show])

  return (
    <Modal
      visible={visible !== null}
      draggable
      width={1200}
      appendToBody
      css={!visible && tw`hidden!`}
      onCancel={onCancel}
      title="选择数据源"
      onOk={() => {
        onOk(source)
      }}
    >
      <DataSourceList selectMode onCheck={setSource} />
    </Modal>
  )
}

export default DataSourceSelectModal
