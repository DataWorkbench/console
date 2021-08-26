import { get, isEmpty } from 'lodash'
import { makeObservable, action, observable, flow } from 'mobx'
import { parseI18n } from 'utils/convert'

class GlobalStore {
  darkMode = false

  user = null

  regionInfos = []

  constructor(rootStore) {
    this.rootStore = rootStore
    makeObservable(this, {
      user: observable,
      regionInfos: observable,
      updateUserInfo: action,
      setDarkMode: action,
      loadRegions: flow,
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

  *loadRegions() {
    const { api } = this.rootStore
    const regionPromise = api.region.load()
    const ret = yield regionPromise
    if (ret) {
      this.regionInfos = parseI18n(ret.infos)
    }
    return this.regionInfos
  }
}

export default GlobalStore
