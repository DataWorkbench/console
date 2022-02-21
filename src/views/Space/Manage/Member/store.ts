import { createContext, useContext } from 'react'
import { makeAutoObservable } from 'mobx'

export class MemberStore {
  op: string = ''

  setOp = (op: string) => {
    console.log('setOp', op)
    this.op = op
  }

  constructor() {
    makeAutoObservable(this)
  }
}

export const MemberContext = createContext<MemberStore>({} as MemberStore)
export const useMemberStore = () => useContext(MemberContext)

export default useMemberStore
