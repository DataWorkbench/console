import { useStore } from 'stores'
import StreamCode from '../Stream/StreamCode'
import StreamJAR from '../Stream/StreamJAR'

const VersionDisplay = () => {
  const {
    workFlowStore: { curVersion },
  } = useStore()
  return (
    <div tw="flex-1 w-full text-neut-8 bg-neut-18 rounded">
      {(() => {
        if ([2, 4, 5].includes(curVersion?.type as any)) {
          return <StreamCode tw="flex-1 h-full" tp={curVersion?.type as any} />
        }
        if (curVersion?.type === 3) {
          return <StreamJAR tw="flex-1 h-full" />
        }
        return null
      })()}
    </div>
  )
}

export default VersionDisplay
