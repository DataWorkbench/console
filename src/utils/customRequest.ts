import axios, { AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { get, isFunction } from 'lodash-es'
import emitter from 'utils/emitter'

const baseConfig: AxiosRequestConfig = {
  method: 'POST',
  // timeout: 60000,
}

function getMessage(ret: {}) {
  const lang = Cookies.get('lang') === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, `detail.${lang}`)
}

const client = axios.create(baseConfig)

client.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      emitter.emit('error', {
        title: `已取消`,
      })
    } else if (error.code === 'ECONNABORTED') {
      emitter.emit('error', {
        title: `网络超时: [timeout]`,
        content: error.message,
      })
    } else if (error.response) {
      const msg = getMessage(error.response.data)
      if (msg) {
        error.response.data.message = msg
      }
      const {
        response: { status },
        message,
      } = error
      emitter.emit('error', {
        title: `网络错误: [${status}]`,
        content: message,
      })
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
  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    data: params,
    headers,
    ...config,
  }
  if (isFunction(cancel)) {
    axiosConfig.cancelToken = new axios.CancelToken(cancel)
  }

  return client.request(axiosConfig).then((response) => response.data)
}

export default customRequest
