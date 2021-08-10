import React, { useEffect } from 'react'
import { renderRoutes } from 'react-router-config'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
import clsx from 'clsx'
import Header from 'views/Space/Header'
import { useStore } from 'stores'

const SpaceLayout = ({ route }) => {
  const store = useStore()
  const darkMode = !!useRouteMatch([
    '/:zone/workspace/:space/dm',
    '/:zone/workspace/:space/ops',
  ])
  store.globalStore.setDarkMode(darkMode)

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
      <div className="tw-flex-1 tw-flex tw-overflow-y-auto">
        {renderRoutes(route.routes)}
        {/* <div className="tw-flex-1 tw-justify-self-stretch">
        </div> */}
      </div>
    </div>
  )
}
SpaceLayout.propTypes = {
  route: PropTypes.object.isRequired,
}

export default SpaceLayout
