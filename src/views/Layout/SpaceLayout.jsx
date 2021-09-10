import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
// import Header from 'views/Space/Header'
import { useStore } from 'stores'

const Header = React.lazy(() =>
  import(/* webpackChunkName: "space" */ 'views/Space/Header')
)

const SpaceLayout = ({ children }) => {
  const { globalStore } = useStore()
  const darkMode = !!useRouteMatch([
    '/:zone/workspace/:space/dm',
    '/:zone/workspace/:space/ops',
  ])
  globalStore.set({ darkMode })

  useEffect(() => {
    const htm = document.documentElement
    if (darkMode) {
      htm.classList.add('dark')
    } else {
      htm.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div tw="flex flex-col h-screen bg-neut-2 dark:bg-neut-17">
      <Header darkMode={darkMode} />
      <div tw="flex-1 flex overflow-y-auto">{children}</div>
    </div>
  )
}
SpaceLayout.propTypes = {
  children: PropTypes.object,
}

export default SpaceLayout
