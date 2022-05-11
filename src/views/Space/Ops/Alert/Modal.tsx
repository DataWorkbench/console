import MonitorModal from 'views/Space/Ops/Alert/Monitor/MonitorModal'
import MonitorAddModal from 'views/Space/Ops/Alert/Monitor/MonitorAddModal'
import MonitorAddFormModal from 'views/Space/Ops/Alert/Monitor/MonitorAddFormModal'
import MonitorAddFormDetail from 'views/Space/Ops/Alert/Monitor/MonitorAddFormDetail'
import { useAlertStore } from 'views/Space/Ops/Alert/AlertStore'
import { observer } from 'mobx-react-lite'
import useIcon from 'hooks/useHooks/useIcon'
import icons from './common/icons'

const AlertModal = observer(() => {
  const {
    set,
    showAddMonitor,
    showAddMonitorDetail,
    showAddMonitorForm,
    showMonitor,
  } = useAlertStore()
  useIcon(icons)
  return (
    <>
      {showMonitor && (
        <MonitorModal
          onCancel={() => {
            set({ showMonitor: false })
          }}
        />
      )}
      {showAddMonitor && (
        <MonitorAddModal
          onCancel={() => {
            set({ showAddMonitor: false })
          }}
        />
      )}
      {showAddMonitorForm && (
        <MonitorAddFormModal
          onCancel={() => {
            set({ showAddMonitorForm: false })
          }}
        />
      )}
      {showAddMonitorDetail && (
        <MonitorAddFormDetail
          onCancel={() => {
            set({ showAddMonitorDetail: false })
          }}
          data={{}}
        />
      )}
    </>
  )
})
export default AlertModal
