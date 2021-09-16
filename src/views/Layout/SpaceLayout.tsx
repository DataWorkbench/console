import React from 'react'
import { observer } from 'mobx-react-lite'
import { FlexBox } from 'components'

const Header = React.lazy(
  () => import(/* webpackChunkName: "space" */ 'views/Space/Header')
)

export const SpaceLayout = observer(({ children }) => {
  return (
    <FlexBox
      orient="column"
      tw="h-screen bg-neut-2 dark:bg-neut-17 transition-colors duration-500"
    >
      <Header />
      <FlexBox flex="1" tw="overflow-y-auto">
        {children}
      </FlexBox>
    </FlexBox>
  )
})

export default SpaceLayout
