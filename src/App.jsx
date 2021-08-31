import React, { Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { PortalProvider, Notification } from '@QCFE/qingcloud-portal-ui'
import RootStore, { StoreContext } from 'stores'
import emitter from 'utils/emitter'
import locales from './locales'
import routes from './routes'

const langMapping = {
  'zh-cn': 'zh-CN',
  en: 'en-US',
}

emitter.off('error')
emitter.on('error', ({ title, content }) =>
  Notification.open({
    title,
    content,
    placement: 'bottomRight',
    type: 'error',
  })
)

const store = new RootStore()

const handleGlobalData = (data) => {
  const { user } = data
  const { globalStore } = store
  if (user) {
    globalStore.set({ user })
  }
}

const App = () => {
  return (
    <PortalProvider
      service="bigdata"
      isPush={false}
      locales={locales}
      currentLocale={langMapping[USER.lang] || 'zh-CN'}
      handleGlobalData={handleGlobalData}
    >
      <StoreContext.Provider value={store}>
        <Router basename="/bigdata">
          <Suspense fallback={<div>loading...</div>}>
            {renderRoutes(routes)}
          </Suspense>
        </Router>
      </StoreContext.Provider>
    </PortalProvider>
  )
}

export default App
