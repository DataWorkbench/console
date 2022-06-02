import { useEffect, useState } from 'react'
import { Alert } from '@QCFE/qingcloud-portal-ui'
import { noop } from 'lodash-es'
import { HelpCenterLink } from 'components/Link'
import { PortalModal } from 'components/Modal'
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
        <PortalModal
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
          <Alert
            type="info"
            message={
              <div>
                <span>请选择运行当前作业的来源端数据源，请注意保证网络连通性，具体可参考：</span>
                <HelpCenterLink isIframe={false} href="/manual/data_up_cloud/connect/">
                  网络连通文档
                </HelpCenterLink>
              </div>
            }
          />
          <DataSourceList selectMode sourceType={sourceType} onCheck={setSource} />
        </PortalModal>
      )}
    </>
  )
}

export default DataSourceSelectModal
