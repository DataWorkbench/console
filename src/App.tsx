import { useState, Suspense } from 'react'
import { useMount } from 'react-use'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Notification as Notify, Loading } from '@QCFE/qingcloud-portal-ui'
import { RootStore, StoreContext } from 'stores'
import { set } from 'lodash-es'
import emitter from 'utils/emitter'
import { LocaleProvider } from '@QCFE/lego-ui'
import locales from './locales'
import Routes from './Routes'

emitter.off('error')
emitter.on('error', ({ title, content }: any) =>
  Notify.open({
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
  const handleGlobalData = async () => {
    const { hostname } = window.location
    const isOnlineEnv = /^console\.qingcloud\.com$/.test(hostname)

    if (!isOnlineEnv) {
      const docsUrl = 'https://deploy-preview-654--qingcloud-docs.netlify.app'
      set(window, 'GLOBAL_CONFIG.new_docs_url', docsUrl)
      set(window, 'GLOBAL_CONFIG.docs_center_url', docsUrl)
    }

    setLoading(false)
  }

  useMount(() => {
    handleGlobalData()
  })

  return (
    <LocaleProvider locales={locales} currentLocale="zh-CN" ignoreWarnings>
      <StoreContext.Provider value={store}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            initialIsOpen={false}
            toggleButtonProps={{ style: { bottom: '36px' } }}
          />
          {loading ? (
            <div tw="flex justify-center h-screen items-center">
              <Loading size="large" />
            </div>
          ) : (
            <Router basename="/dataomnis">
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
    </LocaleProvider>
  )
}

export default App
