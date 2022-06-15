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
  selected?: (string | undefined)[]
}

const DataSourceSelectModal = (props: DataSourceSelectModalProps) => {
  const {
    title,
    onCancel,
    onOk = noop,
    visible: show,
    sourceType,
    selected: selectedProp,
  } = props
  const [visible, setVisible] = useState(show)
  const [source, setSource] = useState<Record<string, any>>()
  const [selected, setSelected] = useState<string[]>([])
  useEffect(() => {
    setVisible(show)
    setSelected(((selectedProp || [])?.filter(Boolean) as any) || [])
    setSource(undefined)
  }, [selectedProp, show])
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
          okType={source ? 'primary' : 'hidden'}
        >
          <Alert
            type="info"
            message={
              <div>
                <span>
                  请选择运行当前作业的来源端数据源，请注意保证网络连通性，具体可参考：
                </span>
                <HelpCenterLink
                  isIframe={false}
                  href="/manual/data_up_cloud/connect/"
                >
                  网络连通文档
                </HelpCenterLink>
              </div>
            }
          />
          <DataSourceList
            selected={selected}
            selectMode
            sourceType={sourceType}
            onCheck={(s: Record<string, any>) => {
              setSource(s)
              setSelected([s.id])
            }}
          />
        </PortalModal>
      )}
    </>
  )
}

export default DataSourceSelectModal
