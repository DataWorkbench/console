import { FC } from 'react'
import { get } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import PropTypes from 'prop-types'
import { Loading, Icon } from '@QCFE/qingcloud-portal-ui'
import { useStore } from 'stores'
import tw, { css, styled, theme } from 'twin.macro'
import SpaceItem from './SpaceItem'

const itemVars = {
  backColors: ['#b3e7d6', '#f2c0c3', '#cfafe9', '#b8def9', '#fbdeb4'],
  fontColors: ['#2fb788', '#d44e4b', '#934bc5', '#229ce9', '#f59c2a'],
}

const Content = styled('div')(() => [
  tw`grid grid-cols-2 flex-wrap 2xl:gap-x-4 gap-x-2`,
  css`
    & > div {
      margin-bottom: ${theme('margin.4')};
    }
  `,
])

const SpaceItemWrapper = styled(SpaceItem)<{ idx: number }>(({ idx }) => [
  css`
    border-top-color: ${itemVars.backColors[idx]};
    .profile {
      background-color: ${itemVars.backColors[idx]};
      color: ${itemVars.fontColors[idx]};
    }
  `,
])

interface IProps {
  regionId: string | number
}

const SpaceCardView: FC<IProps> = ({ regionId }) => {
  const {
    workSpaceStore: { regions },
  } = useStore()
  const curRegion = regions[regionId]
  const workspaces = get(curRegion, 'workspaces', [])
  const isFetch = get(curRegion, 'fetchPromise.state') === 'pending'

  return (
    <>
      <Content>
        {workspaces.map((space, i: number) => (
          <SpaceItemWrapper
            key={space.id}
            regionId={regionId}
            space={space}
            idx={i}
          />
        ))}
      </Content>
      <div css={[tw`h-40`, !isFetch && tw`hidden`]}>
        <Loading size="medium" />
      </div>
      {!isFetch && workspaces.length === 0 && (
        <div tw="flex justify-center w-full my-7">
          <div tw="text-center text-neut-8">
            <Icon name="display" size={56} tw="mb-2" />
            <div>{window.getText('LEGO_UI_NO_AVAILABLE_DATA')}</div>
          </div>
        </div>
      )}
    </>
  )
}

SpaceCardView.propTypes = {
  regionId: PropTypes.string,
}

export default observer(SpaceCardView)
