import { configure } from 'mobx'
import { createContext, useContext } from 'react'
import RootStore from './RootStore'

configure({
  enforceActions: 'always',
})

export const StoreContext = createContext({} as RootStore)
export const useStore = (): RootStore => useContext(StoreContext)
export { RootStore }
