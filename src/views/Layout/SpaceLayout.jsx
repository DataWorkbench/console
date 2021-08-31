import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx'
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
      htm.classList.add('tw-dark')
    } else {
      htm.classList.remove('tw-dark')
    }
  }, [darkMode])

  return (
    <div
      className={clsx(
        'tw-flex tw-flex-col tw-h-screen tw-bg-neut-2 dark:tw-bg-neut-17'
      )}
    >
      <Header darkMode={darkMode} />
      <div className="tw-flex-1 tw-flex tw-overflow-y-auto">{children}</div>
    </div>
  )
}
SpaceLayout.propTypes = {
  children: PropTypes.object,
}

export default SpaceLayout
