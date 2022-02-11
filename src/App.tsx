import { useState, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import {
  PortalProvider,
  Notification as Notify,
  Loading,
} from '@QCFE/qingcloud-portal-ui'
import { RootStore, StoreContext } from 'stores'
import { get, set } from 'lodash-es'
import emitter from 'utils/emitter'
import { describeDataomnis } from 'stores/api'
import locales from './locales'
import Routes from './Routes'

const langMapping: { [key: string]: string | undefined } = {
  'zh-cn': 'zh-CN',
  en: 'en-US',
}

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
    if (!/^console\.qingcloud\.com$/.test(hostname)) {
      set(
        window,
        'GLOBAL_CONFIG.new_docs_url',
        'https://deploy-preview-654--qingcloud-docs.netlify.app'
      )

      // TODO remove location condition after PEK2
      const registerUser = localStorage.getItem('DATA_OMNIS_USER')
      const currentUser = get(window, 'USER.user_id', '')
      if (!registerUser || registerUser !== currentUser) {
        const ret = await describeDataomnis()
        if (ret.ret_code === 0 && ret.status === 'enable') {
          localStorage.setItem('DATA_OMNIS_USER', currentUser)
        }
      }
    }

    setLoading(false)
  }

  return (
    <PortalProvider
      service="dataomnis"
      isPush={false}
      locales={locales}
      currentLocale={langMapping[window.USER?.lang] || 'zh-CN'}
      handleGlobalData={handleGlobalData}
    >
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
    </PortalProvider>
  )
}

export default App
