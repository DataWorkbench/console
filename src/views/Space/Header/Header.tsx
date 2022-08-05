import { useHistory, useLocation, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { flatten, pick } from 'lodash-es'
import { getShortSpaceName } from 'utils/convert'
import { useStore } from 'stores'
import { Center } from 'components'
import { useImmer } from 'use-immer'
import { useQueryWorkSpace } from 'hooks'
import { css } from 'twin.macro'
import { useEffect, useReducer } from 'react'
import emitter from 'utils/emitter'
import useIcon from 'hooks/useHooks/useIcon'
import { Settings } from './Settings'
import { Navs } from './Navs'
import { BackMenu } from './BackMenu'
import { Root, SelectWrapper } from './styled'
import icons from './icons'

const colorVars = {
  backColors: ['#D9F4F1', '#FDEFD8', '#F1E4FE', '#E0EBFE', '#FEE9DA'],
  fontColors: ['#14B8A6', '#F59E0B', '#A855F7', '#3B82F6', '#F97316']
}

export const Header = observer(() => {
  useIcon(icons)
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  const { pathname } = useLocation()
  const history = useHistory()
  const {
    globalStore: { darkMode },
    workSpaceStore: { set, showHeaderNav },
    workSpaceStore
  } = useStore()
  const matched = pathname.match(/workspace\/[^/]*\/([^/]*)/)
  const mod = matched ? matched[1] : 'upcloud'
  const [filter] = useImmer({
    regionId,
    offset: 0,
    reverse: true,
    limit: 100,
    status: 1,
    search: ''
  })

  const { status, data, fetchNextPage, hasNextPage } = useQueryWorkSpace(filter)
  const workspaces = flatten(data?.pages.map((page) => page.infos || []))
  const [key, setKey] = useReducer((v) => v + 1, 0)

  useEffect(() => {
    emitter.on('cancelSaveJob', setKey)
    return () => {
      emitter.off('cancelSaveJob', setKey)
    }
  }, [])

  const space = workspaces?.find(({ id }) => id === spaceId)
  const spaceIndex: number = workspaces?.findIndex(({ id }) => id === spaceId)

  if (status === 'success' && hasNextPage) {
    fetchNextPage()
  }

  useEffect(() => {
    if (space && space.id !== workSpaceStore?.space?.id) {
      set({
        space: { ...pick(space, ['id', 'name', 'owner']), regionId },
        spaceIndex
      })
    }
  }, [regionId, set, space, spaceIndex, workSpaceStore?.space?.id])

  return (
    <Root tw="z-[100] relative">
      <Center tw="space-x-3">
        <BackMenu />
        <Center
          size={32}
          tw="text-sm rounded-sm  font-semibold"
          css={css`
            background: ${colorVars.backColors[spaceIndex % colorVars.backColors.length]};
            color: ${colorVars.fontColors[spaceIndex % colorVars.fontColors.length]};
          `}
        >
          {getShortSpaceName(space?.name)}
        </Center>
        <SelectWrapper
          key={key}
          darkMode={darkMode}
          defaultValue={spaceId}
          isLoading={status === 'loading'}
          // isLoadingAtBottom
          searchable={false}
          // onMenuScrollToBottom={loadData}
          // bottomTextVisible
          options={workspaces.map(({ id, name }) => ({
            value: id,
            label: name
          }))}
          onChange={(v) => {
            const space1 = workspaces?.find(({ id }) => id === v)
            const spaceIndex1: number = workspaces?.findIndex(({ id }) => id === v)

            set({
              space: { ...pick(space1, ['id', 'name', 'owner']), regionId },
              spaceIndex: spaceIndex1
            })

            // history.push(pathname.replace(/(?<=workspace\/)[^/]*/, String(v)))
            history.push(pathname.replace(/\/workspace\/[^/]*/, `/workspace/${v}`))
          }}
        />
      </Center>
      {showHeaderNav && <Navs mod={mod} />}
      <Settings darkMode={darkMode} />
    </Root>
  )
})

export default Header
