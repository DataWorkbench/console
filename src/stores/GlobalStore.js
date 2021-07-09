import { makeObservable, observable, action } from 'mobx'

class GlobalStore {
  darkMode = false

  user = {}

  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      user: observable,
      updateUserInfo: action,
      setDarkMode: action,
    })
  }

  updateUserInfo(user) {
    this.user = user
  }

  setDarkMode(v) {
    this.darkMode = v
  }
}

export default GlobalStore
