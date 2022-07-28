import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { get, isFunction } from 'lodash-es'
import emitter from 'utils/emitter'

const baseConfig: AxiosRequestConfig = {
  method: 'POST'
  // timeout: 60000,
}

function getMessage(ret: {}) {
  const lang = Cookies.get('lang') === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, `detail.${lang}`)
}

const client = axios.create(baseConfig)

client.interceptors.response.use(
  (response) => {
    const { ret_code: retCode } = response.data
    if (retCode === 2000) {
      const message1 = getMessage(response.data)
      response.data.message = message1
      emitter.emit('error', {
        title: `请求错误: 登录会话已过期，请重新登录`,
        content: message1
      })

      setTimeout(() => {
        emitter.emit('logout')
        // window.location.href = `/login?redirect_uri=${window.location.pathname}`
      }, 1200)
      throw new Error(message1)
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
      if (error.response.config.url === '/global_api/v1/sessions') {
        let message1 = '登录失败，请重新登录'
        if (error.response.data.status === 404) {
          message1 = '账户不存在'
        } else if (error.response.data.status === 400) {
          message1 = '密码错误'
        }
        emitter.emit('error', {
          title: `登录失败`,
          content: message1
        })
      } else {
        const msg = getMessage(error.response.data)
        if (msg) {
          error.response.data.message = msg
        }
        const {
          response: { status },
          message
        } = error
        emitter.emit('error', {
          title: `网络错误: [${status}]`,
          content: message
        })
      }
    }
    return Promise.reject(error)
  }
)

const customRequest = async (
  data: { method?: any; url: string; [params: string]: unknown },
  options: { cancel?: () => {}; [params: string]: unknown } = {}
) => {
  const { method = 'POST', url, headers, params } = data
  const { cancel, ...config } = options
  const conf: AxiosRequestConfig = {}
  if (method === 'GET') {
    conf.params = params
  }
  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    data: params,
    headers,
    ...conf,
    ...config
  }
  if (isFunction(cancel)) {
    axiosConfig.cancelToken = new axios.CancelToken(cancel)
  }

  return client.request(axiosConfig).then((response) => response.data)
}

export default customRequest
