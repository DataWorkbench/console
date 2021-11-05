import { useParams, useLocation, useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { flatten } from 'lodash-es'
import { getShortSpaceName } from 'utils/convert'
import { useStore } from 'stores'
import { Center } from 'components'
import { useImmer } from 'use-immer'
import { useQueryWorkSpace } from 'hooks'
import { Settings } from './Settings'
import { Navs } from './Navs'
import { BackMenu } from './BackMenu'
import { Root, SelectWrapper } from './styled'

export const Header = observer(() => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const { pathname } = useLocation()
  const history = useHistory()
  const {
    globalStore: { darkMode },
  } = useStore()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'
  const [filter] = useImmer({
    regionId,
    offset: 0,
    reverse: true,
    limit: 10,
    search: '',
  })

  const { status, data, fetchNextPage, hasNextPage } = useQueryWorkSpace(filter)
  const workspaces = flatten(data?.pages.map((page) => page.infos || []))
  const space = workspaces?.find(({ id }) => id === spaceId)

  const loadData = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  return (
    <Root tw="z-[100]">
      <Center tw="space-x-3">
        <BackMenu />
        <Center
          size={32}
          tw="text-sm rounded-sm bg-[#cfafe9] text-[#934bc5] font-semibold"
        >
          {getShortSpaceName(space?.name)}
        </Center>
        <SelectWrapper
          darkMode={darkMode}
          defaultValue={spaceId}
          isLoading={status === 'loading'}
          isLoadingAtBottom
          searchable={false}
          onMenuScrollToBottom={loadData}
          bottomTextVisible
          options={workspaces.map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          onChange={(v) =>
            history.push(pathname.replace(/(?<=workspace\/)[^/]*/, String(v)))
          }
        />
      </Center>
      <Navs mod={mod} />
      <Settings darkMode={darkMode} />
    </Root>
  )
})

export default Header
