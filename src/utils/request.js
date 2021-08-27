import axios from 'axios'
import Cookies from 'js-cookie'
import { get } from 'lodash'
import emitter from 'utils/emitter'

const baseConfig = {
  method: 'POST',
  timeout: 15000,
  headers: {
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    maxRedirects: 0,
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

function getMessage(ret) {
  const lang = Cookies.get('lang') === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, `detail.${lang}`)
}

function getOwner() {
  return new Promise((resolve, reject) => {
    const owner = get(window, 'USER.user_id', '')
    if (owner) {
      resolve(owner)
    } else {
      setTimeout(() => reject(), 250)
    }
  })
}

async function getOwnerLoop(n) {
  try {
    const owner = await getOwner()
    return owner
  } catch (e) {
    if (n > -1) {
      const m = n - 1
      return getOwnerLoop(m)
    }
    throw new Error('获取用户ID出错')
  }
}

const client = axios.create(baseConfig)

client.interceptors.response.use(
  (response) => {
    const { status, ret_code: retCode } = response.data
    if (status >= 400 || retCode !== 0) {
      const message = getMessage(response.data)
      response.data.message = message
      emitter.emit('error', {
        title: `请求错误: [${status}]`,
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

const request = async (params, method = 'GET', url = '/portal_api') => {
  // 间隔200ms 循环300次获取user
  const owner = await getOwnerLoop(300).catch((err) => {
    emitter.emit('error', {
      title: '请求错误',
      content: err,
    })
    return null
  })
  if (owner) {
    return client
      .request({
        url,
        data: {
          params: {
            service: 'bigdata',
            owner,
            ...params,
          },
          method,
        },
      })
      .then((response) => response.data)
  }
  return null
}

export { getMessage }

export default request
