import { makeAutoObservable, runInAction, set } from 'mobx'
import type RootStore from './RootStore'

interface IHeaders {
  Authorization: string
  'X-Date': string
}

export default class ResourceStore {
  rootStore

  endpoint: string = ''

  headers: IHeaders | {} = {}

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this, {
      rootStore: false,
    })
  }

  clear = () => {
    this.endpoint = ''
    this.headers = {}
  }

  set = (params: { endpoint: string; headers: IHeaders }) => {
    runInAction(() => {
      set(this, { ...params })
    })
  }
}
