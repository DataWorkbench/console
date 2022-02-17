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
    const isOnlineEnv = /^console\.qingcloud\.com$/.test(hostname)

    if (!isOnlineEnv) {
      const docsUrl = 'https://deploy-preview-654--qingcloud-docs.netlify.app'
      set(window, 'GLOBAL_CONFIG.new_docs_url', docsUrl)
      set(window, 'GLOBAL_CONFIG.docs_center_url', docsUrl)
    }

    const currentUser = get(window, 'USER.user_id', '')
    const registerUser = localStorage.getItem('DATA_OMNIS_OPENED')
    const isActivated = registerUser && registerUser === currentUser
    if (!isActivated) {
      const ret = await describeDataomnis()
      if (ret.ret_code === 0 && ret.status === 'enable') {
        localStorage.setItem('DATA_OMNIS_OPENED', currentUser)
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
