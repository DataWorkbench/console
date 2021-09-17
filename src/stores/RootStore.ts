import OverViewStore from 'stores/OverViewStore'
import GlobalStore from 'stores/GlobalStore'
import WorkSpaceStore from 'stores/WorkSpaceStore'
import DataSourceStore from 'stores/DataSourceStore'
import WorkFlowStore from 'stores/WorkFlowStore'
import SpaceStore from 'stores/SpaceStore'

import api, { API } from './api'

class RootStore {
  overViewStore: OverViewStore

  globalStore: GlobalStore

  workSpaceStore: WorkSpaceStore

  dataSourceStore: DataSourceStore

  workFlowStore: WorkFlowStore

  spaceStore: SpaceStore

  api: API

  constructor() {
    this.overViewStore = new OverViewStore(this)
    this.globalStore = new GlobalStore(this)
    this.workSpaceStore = new WorkSpaceStore(this)
    this.dataSourceStore = new DataSourceStore(this)
    this.workFlowStore = new WorkFlowStore(this)
    this.spaceStore = new SpaceStore(this)
    this.api = api
  }
}

export default RootStore
