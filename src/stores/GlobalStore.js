import { makeObservable, observable, action } from 'mobx'

class GlobalStore {
  user = {}

  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      user: observable,
      updateUserInfo: action,
    })
  }

  updateUserInfo(user) {
    this.user = user
  }
}

export default GlobalStore
