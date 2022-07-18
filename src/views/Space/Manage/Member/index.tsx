import { useParams } from 'react-router-dom'
import Member from './MemberList'
import { MemberContext, MemberStore } from './store'

export default () => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  return (
    <MemberContext.Provider value={new MemberStore()}>
      <Member spaceId={spaceId} regionId={regionId} />
    </MemberContext.Provider>
  )
}
