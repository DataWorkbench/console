import axios from 'axios'
import Cookies from 'js-cookie'
import { get, isFunction } from 'lodash-es'
import emitter from 'utils/emitter'

const baseConfig = {
  method: 'POST',
  timeout: 20000,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

function getMessage(ret) {
  const lang = Cookies.get('lang') === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, `detail.${lang}`)
}

const client = axios.create(baseConfig)

client.interceptors.response.use(
  (response) => {
    const { status, ret_code: retCode } = response.data
    if (status >= 400 || retCode !== 0) {
      const message = getMessage(response.data)
      response.data.message = message
      emitter.emit('error', {
        title: `请求错误: [${status || retCode}]`,
        content: message,
      })
    }
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      emitter.emit('error', {
        title: `网络超时: [timeout]`,
        content: error.message,
      })
    } else if (error.response) {
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

const request = async (data, options = {}) => {
  const { method = 'GET', ...params } = data
  const { cancel, ...config } = options
  const owner = get(window, 'USER.user_id', '')
  return client
    .request({
      url: '/portal_api',
      cancelToken: isFunction(cancel) ? new axios.CancelToken(cancel) : null,
      data: {
        params: {
          service: 'bigdata',
          owner,
          ...params,
        },
        method,
      },
      ...config,
    })
    .then((response) => response.data)
    .catch((e) => {
      if (axios.isCancel(e)) {
        return null
      }
      return {
        ret_code: -1,
        message: e.message,
      }
    })
}

export default request
