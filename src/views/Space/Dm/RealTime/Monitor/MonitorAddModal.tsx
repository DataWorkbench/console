import { Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { Center, HelpCenterLink, Modal, ModalContent } from 'components'
import { observer } from 'mobx-react-lite'
import { Table } from 'views/Space/styled'
import { useStore } from 'stores/index'

interface IMonitorAddProps {
  onCancel: () => void
}

const columns: Record<string, any>[] = []

const MonitorAddModal = observer((props: IMonitorAddProps) => {
  const { workFlowStore } = useStore()
  const { onCancel } = props
  return (
    <Modal
      visible
      width={1200}
      onOk={onCancel}
      onCancel={onCancel}
      title="选择告警策略"
      appendToBody
    >
      <ModalContent>
        <div>
          <Button
            type="primary"
            onClick={() => {
              workFlowStore.set({ showAddMonitorForm: true })
            }}
          >
            <Icon name="plus" />
            创建策略
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={[]}
          // pagination={false}
          rowKey="id"
        />
      </ModalContent>
    </Modal>
  )
})

export default MonitorAddModal
