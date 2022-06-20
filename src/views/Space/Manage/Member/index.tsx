import Member from './MemberList'
import { MemberContext, MemberStore } from './store'

export default () => (
  <MemberContext.Provider value={new MemberStore()}>
    <Member />
  </MemberContext.Provider>
)
