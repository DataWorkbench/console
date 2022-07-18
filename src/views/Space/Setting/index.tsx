import { useParams } from 'react-router-dom'
import Account from 'views/Space/Setting/Account'
import Notify from 'views/Space/Setting/Notify'

const Setting = () => {
  const { mod } = useParams<{ mod: string }>()

  return (
    <div tw="px-[130px] h-full w-full">
      <div tw="flex-1 w-full">{(mod === 'account' || !mod) && <Account />}</div>
      <div tw="flex-1 w-full">{mod === 'notify' && <Notify />}</div>
    </div>
  )
}

export default Setting
