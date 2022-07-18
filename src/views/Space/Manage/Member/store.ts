import { createContext, useContext } from 'react'
import { makeAutoObservable, set } from 'mobx'

export class MemberStore {
  op: string = ''

  selectedKeys: string[] = []

  activeKeys: string[] = []

  spaceItem: { id: string; name: string; regionId: string } = {
    id: '',
    name: '',
    regionId: ''
  }

  set = (params: { [key: string]: any }) => {
    set(this, { ...params })
  }

  setOp = (op: string) => {
    this.op = op
  }

  setSelectedKeys = (selectedKeys: string[]) => {
    this.selectedKeys = selectedKeys
  }

  setActiveKeys = (activeKeys: string[]) => {
    this.activeKeys = activeKeys
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export const MemberContext = createContext<MemberStore>({} as MemberStore)
export const useMemberStore = () => useContext(MemberContext)

export default useMemberStore
