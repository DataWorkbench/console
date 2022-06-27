import { useState, Suspense, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { ReactQueryDevtools } from 'react-query/devtools'
import { PortalProvider, Notification as Notify, Loading } from '@QCFE/qingcloud-portal-ui'
import { RootStore, StoreContext } from 'stores'
import { get, set } from 'lodash-es'
import emitter from 'utils/emitter'
import { describeDataomnis } from 'stores/api'
// import { request } from 'utils/index'
import { apiRequest } from 'utils/api'
import locales from './locales'
import Routes from './Routes'
import { loadRegion } from './stores/api/region'

const langMapping: { [key: string]: string | undefined } = {
  'zh-cn': 'zh-CN',
  en: 'en-US'
}

emitter.off('error')
emitter.on('error', ({ title, content }: any) =>
  Notify.open({
    title,
    content,
    placement: 'bottomRight',
    type: 'error'
  })
)

const store = new RootStore()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const App = () => {
  const [loading, setLoading] = useState(true)

  const [doc, setDoc] = useState('')

  useEffect(() => {
    loadRegion()
      .then((res) => {
        if (!res.ret_code && res.infos) {
          return res.infos[0].id
        }
        throw new Error()
      })
      .then(
        (id) => apiRequest('platformManage', 'describePlatformConfig')({ regionId: id }),
        () => {}
      )
      .then((platform: Record<string, any>) => {
        let url = platform?.documents_address
        if (url) {
          if (!url.includes('//')) {
            url = `//${url}`
          }

          setDoc(url)
          set(window, 'GLOBAL_CONFIG.new_docs_url', url)
          set(window, 'GLOBAL_CONFIG.docs_center_url', url)
        }
      })
  }, [])

  const handleGlobalData = async () => {
    // const { hostname } = window.location
    // const isOnlineEnv = /^console\.qingcloud\.com$/.test(hostname)

    if (doc) {
      set(window, 'GLOBAL_CONFIG.new_docs_url', doc)
      set(window, 'GLOBAL_CONFIG.docs_center_url', doc)
    }

    const currentUser = get(window, 'USER.user_id', '')
    const registerUser = localStorage.getItem('DATA_OMNIS_OPENED')
    const isActivated = registerUser && registerUser === currentUser
    if (!isActivated) {
      const ret = await describeDataomnis()
      if (ret?.ret_code === 0 && ret.status === 'enable') {
        localStorage.setItem('DATA_OMNIS_OPENED', currentUser)
      } else {
        localStorage.removeItem('DATA_OMNIS_OPENED')
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
      <DndProvider backend={HTML5Backend}>
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
      </DndProvider>
    </PortalProvider>
  )
}

export default App
