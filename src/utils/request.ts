import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { get, isFunction } from 'lodash-es'
import emitter from 'utils/emitter'

const baseConfig: AxiosRequestConfig = {
  method: 'POST',
  timeout: 30000,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': Cookies.get('csrftoken'),
    'Content-Type': 'application/json;charset=UTF-8'
  }
}

function getMessage(ret: {}) {
  const lang = Cookies.get('lang') === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, `detail.${lang}`)
}

const client = axios.create(baseConfig)

let loginMdalVisible = false

const axiosList = new Map()

client.interceptors.response.use(
  (response) => {
    axiosList.delete(response.config)
    const { status, ret_code: retCode } = response.data
    if (retCode === 2000) {
      loginMdalVisible = true
      const message1 = getMessage(response.data)
      response.data.message = message1
      emitter.emit('error', {
        title: `请求错误: 登录会话已过期，请重新登录`,
        content: message1
      })
      axiosList.forEach((cancel) => {
        cancel()
      })

      axiosList.clear()
      setTimeout(() => {
        emitter.emit('logout')
        // window.location.href = `/login?redirect_uri=${window.location.pathname}`
      }, 1200)
      throw new Error(message1)
    }
    if (status >= 400 || retCode !== 0) {
      const message = getMessage(response.data)
      response.data.message = message
      emitter.emit('error', {
        title: `请求错误: [${status || retCode}]`,
        content: message
      })
      throw new Error(message)
    }
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      emitter.emit('error', {
        title: `已取消`
      })
    } else if (error.code === 'ECONNABORTED') {
      emitter.emit('error', {
        title: `网络超时: [timeout]`,
        content: error.message
      })
    } else if (error.response) {
      const {
        response: { status },
        message
      } = error
      emitter.emit('error', {
        title: `网络错误: [${status}]`,
        content: message
      })
    }
    return Promise.reject(error)
  }
)

const request = async (
  data: { method?: string; [params: string]: unknown },
  options: { cancel?: (_: any) => void; [params: string]: unknown } = {}
) => {
  if (loginMdalVisible) {
    return Promise.reject(new Error('登录会话已过期，请重新登录'))
  }
  const { method = 'GET', action = 'Forward', ...params } = data
  const { cancel, ...config } = options
  const userId = get(window, 'USER.user_id', '')
  const axiosConfig: AxiosRequestConfig = {
    url: '/data_api',
    data: {
      action,
      userId,
      method,
      ...params
    },
    ...config
  }
  let tempCancel

  axiosConfig.cancelToken = new axios.CancelToken((c: any) => {
    tempCancel = c
    if (isFunction(cancel)) {
      cancel(c)
    }
  })

  axiosList.set(axiosConfig, tempCancel)

  return client.request(axiosConfig).then((response) => response.data)
  // .catch((e) => {
  //   if (axios.isCancel(e)) {
  //     return null
  //   }
  //   return {
  //     ret_code: -1,
  //     message: e.message,
  //   }
  // })
}

export default request
