import { makeAutoObservable, set } from 'mobx'
import type RootStore from './RootStore'

class WorkFlowStore {
  rootStore

  flows = []

  curFlow: null | {
    id: string
    name: string
    type: number
  } = null

  showFlowModal = false

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      rootStore: false,
    })
    this.rootStore = rootStore
  }

  set(params: { [key: string]: any }) {
    set(this, { ...params })
  }
}

export default WorkFlowStore
