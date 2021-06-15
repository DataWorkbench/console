import { createContext, useContext } from 'react'
import SideMenuStore from 'stores/SideMenuStore'
import OverViewStore from 'stores/OverViewStore'
import GlobalStore from 'stores/GlobalStore'

class RootStore {
  constructor() {
    this.sideMenuStore = new SideMenuStore(this)
    this.overViewStore = new OverViewStore(this)
    this.globalStore = new GlobalStore(this)
  }
}

export const StoreContext = createContext(null)

export const useStore = () => useContext(StoreContext)

export default new RootStore()
