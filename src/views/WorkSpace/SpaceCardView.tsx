import { useCallback, useEffect } from 'react'
import { throttle, flatten } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { Loading, Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import { useEvent } from 'react-use'
import { useImmer } from 'use-immer'
import { useWorkSpaceContext } from 'contexts'
import { Center } from 'components'
import { useQueryWorkSpace } from 'hooks'
import SpaceItem from './SpaceItem'

const colorVars = {
  backColors: ['#b3e7d6', '#f2c0c3', '#cfafe9', '#b8def9', '#fbdeb4'],
  fontColors: ['#2fb788', '#d44e4b', '#934bc5', '#229ce9', '#f59c2a'],
}

const Content = styled('div')(() => [
  tw`grid grid-cols-2 flex-wrap 2xl:gap-x-4 gap-x-2`,
  css`
    & > div {
      ${tw`mb-4`}
    }
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

  if (workspaces.length === 0) {
    return (
      <Center tw="h-80">
        <div tw="text-center text-neut-8">
          <Icon name="display" size={56} />
          <div>{window.getText('LEGO_UI_NO_AVAILABLE_DATA')}</div>
        </div>
      </Center>
    )
  }
  return (
    <>
      <Content>
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