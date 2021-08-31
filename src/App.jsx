import React, { useState, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  PortalProvider,
  Notification,
  Loading,
} from '@QCFE/qingcloud-portal-ui'
import RootStore, { StoreContext } from 'stores'
import emitter from 'utils/emitter'
import locales from './locales'
import Routes from './routes'

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

const App = () => {
  const [loading, setLoading] = useState(true)
  const handleGlobalData = () => {
    setLoading(false)
  }
  return (
    <PortalProvider
      service="bigdata"
      isPush={false}
      locales={locales}
      currentLocale={langMapping[USER.lang] || 'zh-CN'}
      handleGlobalData={handleGlobalData}
    >
      <StoreContext.Provider value={store}>
        {loading ? (
          <div className="tw-flex tw-justify-center tw-h-screen tw-items-center">
            <Loading size="large" />
          </div>
        ) : (
          <Router basename="/bigdata">
            <Suspense
              fallback={
                <div className="tw-flex tw-justify-center tw-h-screen tw-items-center">
                  <Loading />
                </div>
              }
            >
              <Routes />
            </Suspense>
          </Router>
        )}
      </StoreContext.Provider>
    </PortalProvider>
  )
}

export default App
