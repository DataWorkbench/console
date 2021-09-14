import { useState, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  PortalProvider,
  Notification as notification,
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
  notification.open({
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
      currentLocale={langMapping[window.USER?.lang] || 'zh-CN'}
      handleGlobalData={handleGlobalData}
    >
      <StoreContext.Provider value={store}>
        {loading ? (
          <div tw="flex justify-center h-screen items-center">
            <Loading size="large" />
          </div>
        ) : (
          <Router basename="/bigdata">
            <Suspense
              fallback={
                <div tw="flex justify-center h-screen items-center">
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
