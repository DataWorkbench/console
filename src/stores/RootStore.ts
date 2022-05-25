import OverViewStore from 'stores/OverViewStore'
import GlobalStore from 'stores/GlobalStore'
import WorkSpaceStore from 'stores/WorkSpaceStore'
import DataSourceStore from 'stores/DataSourceStore'
import WorkFlowStore from 'stores/WorkFlowStore'
import DmStore from 'stores/DmStore'
import DtsStore from 'stores/DtsStore'

class RootStore {
  overViewStore: OverViewStore

  globalStore: GlobalStore

  workSpaceStore: WorkSpaceStore

  dataSourceStore: DataSourceStore

  workFlowStore: WorkFlowStore

  dmStore: DmStore

  dtsStore: DtsStore

  constructor() {
    this.overViewStore = new OverViewStore(this)
    this.globalStore = new GlobalStore(this)
    this.workSpaceStore = new WorkSpaceStore(this)
    this.dataSourceStore = new DataSourceStore(this)
    this.workFlowStore = new WorkFlowStore(this)
    this.dmStore = new DmStore(this)
    this.dtsStore = new DtsStore(this)
  }
}

export default RootStore
