import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { PortalProvider, Message } from '@QCFE/qingcloud-portal-ui'
import RootStore, { StoreContext } from 'stores'
import emitter from 'utils/emitter'
import locales from './locales'
import routes from './routes'

const langMapping = {
  'zh-cn': 'zh-CN',
  en: 'en-US',
}

emitter.off('error')
emitter.on('error', (msg) =>
  Message.open({
    content: msg,
    placement: 'bottomRight',
    type: 'error',
  })
)

const store = new RootStore()

const handleGlobalData = (data) => {
  const { user } = data
  const { globalStore } = store
  if (user) {
    globalStore.updateUserInfo(user)
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
        <Router basename="/bigdata">{renderRoutes(routes)}</Router>
      </StoreContext.Provider>
    </PortalProvider>
  )
}

export default App
