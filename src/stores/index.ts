import { configure } from 'mobx'
import { createContext, useContext } from 'react'
import RootStore from './RootStore'

configure({
  enforceActions: 'always',
})

const rootStore = new RootStore()

export const StoreContext = createContext(rootStore)
export const useStore = (): RootStore => useContext(StoreContext)
export { RootStore }
