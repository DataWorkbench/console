import { Suspense, useEffect } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Loading, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { RootStore, StoreContext } from 'stores'
import { set } from 'lodash-es'
import emitter from 'utils/emitter'
import { apiRequest } from 'utils/api'
import Routes from './Routes'
import { loadRegion } from './stores/api/region'

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

const App = () => {
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
          set(window, 'GLOBAL_CONFIG.new_docs_url', url)
          set(window, 'GLOBAL_CONFIG.docs_center_url', url)
          set(window, 'GLOBAL_CONFIG.new_docs_url1', url)
          set(window, 'GLOBAL_CONFIG.docs_center_url1', url)
        }
      })
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <StoreContext.Provider value={store}>
        <ReactQueryDevtools
          initialIsOpen={false}
          toggleButtonProps={{ style: { bottom: '36px' } }}
        />
        <Suspense
          fallback={
            <div tw="flex justify-center h-screen items-center">
              <Loading />
            </div>
          }
        >
          <Routes />
        </Suspense>
      </StoreContext.Provider>
    </DndProvider>
  )
}

export default App
