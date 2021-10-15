import { useState, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import {
  PortalProvider,
  Notification as notification,
  Loading,
} from '@QCFE/qingcloud-portal-ui'
import { RootStore, StoreContext } from 'stores'
import emitter from 'utils/emitter'
import locales from './locales'
import Routes from './Routes'

const langMapping: { [key: string]: string | undefined } = {
  'zh-cn': 'zh-CN',
  en: 'en-US',
}

emitter.off('error')
emitter.on('error', ({ title, content }: any) =>
  notification.open({
    title,
    content,
    placement: 'bottomRight',
    type: 'error',
  })
)

const store = new RootStore()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

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
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { bottom: '32px' } }}
          />
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
        </QueryClientProvider>
      </StoreContext.Provider>
    </PortalProvider>
  )
}

export default App