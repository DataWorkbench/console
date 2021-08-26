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
    const res = yield regionPromise
    const ret = res.data
    if (ret.ret_code !== 0) {
      throw new Error(`message: ${ret.message} reqId: ${ret.request_id}`)
    }
    this.regionInfos = parseI18n(ret.infos)
    return this.regionInfos
  }
}

export default GlobalStore
