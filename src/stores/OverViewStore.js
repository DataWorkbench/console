import { makeObservable } from 'mobx'

class OverViewStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {})
  }
}

export default OverViewStore
