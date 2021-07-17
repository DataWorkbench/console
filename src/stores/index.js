import { configure } from 'mobx'
import { createContext, useContext } from 'react'
import SideMenuStore from 'stores/SideMenuStore'
import OverViewStore from 'stores/OverViewStore'
import GlobalStore from 'stores/GlobalStore'
import WorkspaceStore from 'stores/WorkSpaceStore'
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
    this.api = api
  }
}

export const StoreContext = createContext(null)

export const useStore = () => useContext(StoreContext)

export default new RootStore()
