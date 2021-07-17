import { get, isEmpty } from 'lodash'
import { makeObservable, action, observable } from 'mobx'

class GlobalStore {
  darkMode = false

  user = null

  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      user: observable,
      updateUserInfo: action,
      setDarkMode: action,
    })
    const user = get(window, 'USER')
    if (!isEmpty(user)) {
      this.user = user
    }
  }

  updateUserInfo(user) {
    this.user = user
  }

  setDarkMode(v) {
    this.darkMode = v
  }
}

export default GlobalStore
