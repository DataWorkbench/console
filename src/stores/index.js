import { configure } from 'mobx'
import { createContext, useContext } from 'react'
import SideMenuStore from 'stores/SideMenuStore'
import OverViewStore from 'stores/OverViewStore'
import GlobalStore from 'stores/GlobalStore'
import WorkspaceStore from 'stores/WorkSpaceStore'
import DataSourceStore from 'stores/DataSourceStore'
import WorkFlowStore from 'stores/WorkFlowStore'
import api from './api'

configure({
  enforceActions: 'always',
})

class RootStore {
  constructor() {
    this.sideMenuStore = new SideMenuStore(this)
    this.overViewStore = new OverViewStore(this)
    this.globalStore = new GlobalStore(this)
    this.workspaceStore = new WorkspaceStore(this)
    this.dataSourceStore = new DataSourceStore(this)
    this.workFlowStore = new WorkFlowStore(this)
    this.api = api
  }
}

export const StoreContext = createContext(null)

export const useStore = () => useContext(StoreContext)

export default new RootStore()
