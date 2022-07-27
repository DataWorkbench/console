import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import { get, omit, set } from 'lodash-es'
import { LocaleProvider } from '@QCFE/lego-ui'
import { Loading, PortalProvider } from '@QCFE/qingcloud-portal-ui'
import { describeDataomnis } from 'stores/api'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useCookie } from 'react-use'
import Login from 'views/Space/Ops/Login'
import emitter from 'utils/emitter'
import locales from '../../locales'
import { useValidateSession } from '../../hooks/useGlobalAPI'

const langMapping: { [key: string]: string | undefined } = {
  'zh-cn': 'zh-CN',
  en: 'en-US'
}

const Auth = ({ children }: { children: ReactElement }) => {
  const isLogin = useRef(window.location.pathname === '/dataomnis/login')
  const isPrivate = useMemo(() => get(window, 'CONFIG_ENV.IS_PRIVATE', false), [])
  const [loading, setLoading] = useState(!isLogin.current)
  const [hasLogin, setHasLogin] = useState(false)

  const [sk, setSk] = useCookie('sk')

  const handleLogin = (userInfo: Record<string, any>) => {
    set(window, 'USER', userInfo)
    set(window, 'loginMdalVisible', false)
    setHasLogin(true)
    setLoading(false)
  }

  useValidateSession(sk!, {
    enabled: isPrivate && !!sk && !isLogin.current,
    onSuccess: (e: Record<'user_set' | 'key_set', any>) => {
      handleLogin(omit(e.user_set, 'password'))
    },
    onError: () => {
      setLoading(false)
    }
  })

  useEffect(() => {
    if (!sk) {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGlobalData = async () => {
    // const { hostname } = window.location
    // const isOnlineEnv = /^console\.qingcloud\.com$/.test(hostname)

    if (get(window, 'GLOBAL_CONFIG.new_docs_url1')) {
      set(window, 'GLOBAL_CONFIG.new_docs_url', get(window, 'GLOBAL_CONFIG.new_docs_url1'))
      set(window, 'GLOBAL_CONFIG.docs_center_url', get(window, 'GLOBAL_CONFIG.docs_center_url1'))
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
    setHasLogin(true)
    setLoading(false)
  }

  useEffect(() => {
    emitter.on('logout', () => {
      if (isPrivate) {
        setSk('')
        setHasLogin(false)
      } else {
        window.location.href = `/login?redirect_uri=${window.location.pathname}`
      }
    })
  }, [isPrivate, setSk])

  const renderChildren = () => {
    if (loading) {
      return (
        <div tw="flex justify-center h-screen items-center">
          <Loading size="large" />
        </div>
      )
    }
    return (
      <Router basename="/dataomnis">
        {!hasLogin && (
          <Switch>
            <Route path="/login" component={() => <Login onLogin={handleLogin} />} />
            <Route path="/" component={() => <Redirect to="/login" />} />
          </Switch>
        )}
        {hasLogin && children}
      </Router>
    )
  }

  if (!isPrivate) {
    return (
      <PortalProvider
        service="dataomnis"
        isPush={false}
        locales={locales}
        currentLocale={langMapping[window.USER?.lang] || 'zh-CN'}
        handleGlobalData={handleGlobalData}
      >
        {renderChildren()}
      </PortalProvider>
    )
  }

  return (
    <LocaleProvider locales={locales} currentLocale="zh-CN" ignoreWarnings>
      {renderChildren()}
    </LocaleProvider>
  )
}

export default Auth
