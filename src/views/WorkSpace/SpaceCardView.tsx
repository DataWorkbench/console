import { useCallback, useEffect } from 'react'
import { throttle, flatten } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { Loading } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import { useEvent } from 'react-use'
import { useImmer } from 'use-immer'
import { useWorkSpaceContext } from 'contexts'
import { useQueryWorkSpace } from 'hooks'
import SpaceItem from './SpaceItem'
import SpaceListsEmpty from './SpaceListsEmpty'

const colorVars = {
  backColors: ['#D9F4F1', '#FDEFD8', '#F1E4FE', '#E0EBFE', '#FEE9DA'],
  fontColors: ['#14B8A6', '#F59E0B', '#A855F7', '#3B82F6', '#F97316'],
}

const Content = styled('div')(() => [
  tw`grid grid-cols-2 flex-wrap 2xl:grid-cols-workspace gap-x-4`,
  css`
    & > div {
      ${tw`mb-4`}
    }
    //grid-template-columns: repeat(3, minmax(530px, 1fr));
  `,
])

const SpaceItemWrapper = styled(SpaceItem)<{ idx: number }>(({ idx }) => [
  css`
    border-top-color: ${colorVars.backColors[idx]};
    .profile {
      background-color: ${colorVars.backColors[idx]};
      color: ${colorVars.fontColors[idx]};
    }
  `,
])

const SpaceCardView = observer(() => {
  const stateStore = useWorkSpaceContext()
  const {
    queryRefetch,
    curRegionId: regionId,
    queryKeyWord,
    scrollElem,
    isModal,
  } = stateStore
  const [filter, setFilter] = useImmer({
    regionId,
    offset: 0,
    reverse: true,
    limit: 10,
    search: '',
  })

  const {
    status,
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQueryWorkSpace(filter)

  const workspaces = flatten(data?.pages.map((page) => page.infos || []))

  const ifNoData =
    status === 'success' &&
    filter.offset === 0 &&
    filter.search === '' &&
    workspaces.length === 0

  const onScroll = useCallback(() => {
    if (scrollElem) {
      const dist =
        scrollElem.scrollHeight - scrollElem.clientHeight - scrollElem.scrollTop
      if (scrollElem.scrollTop > 0 && dist < 250) {
        if (hasNextPage) {
          fetchNextPage()
        }
      }
    }
  }, [scrollElem, fetchNextPage, hasNextPage])

  useEvent('scroll', throttle(onScroll, 500), scrollElem)

  useEffect(() => {
    setFilter((draft) => {
      draft.search = queryKeyWord
    })
  }, [queryKeyWord, setFilter])

  useEffect(() => {
    if (queryRefetch) {
      refetch({ refetchPage: () => true }).then(() => {
        stateStore.set({ queryRefetch: false })
      })
    }
  }, [queryRefetch, refetch, stateStore])

  useEffect(() => {
    stateStore.set({ ifNoData })
  }, [ifNoData, stateStore])

  if (status === 'loading') {
    return (
      <div tw="h-72">
        <Loading />
      </div>
    )
  }

  if (ifNoData) {
    return <SpaceListsEmpty />
  }
  return (
    <>
      <Content css={isModal && tw`2xl:grid-cols-2`}>
        {workspaces.map((space, i: number) => (
          <SpaceItemWrapper
            key={space.id}
            regionId={regionId}
            space={space}
            idx={i % 5}
          />
        ))}
      </Content>
      <div css={[tw`h-40`, !isFetchingNextPage && tw`hidden`]}>
        <Loading size="medium" />
      </div>
    </>
  )
})
export default SpaceCardView
