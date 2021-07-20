import axios from 'axios'
import Cookies from 'js-cookie'
import { get, omit } from 'lodash'
import emitter from 'utils/emitter'

const baseConfig = {
  method: 'POST',
  timeout: 10000,
  headers: {
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    maxRedirects: 0,
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

function getMessage(ret) {
  const cookieLang = Cookies.get('lang')
  const lang = cookieLang === 'en' ? 'en_us' : 'zh_cn'
  return get(ret, lang)
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
    return null
  }
}

const client = axios.create(baseConfig)

client.interceptors.response.use(
  (response) => {
    const { status } = response.data
    if (status >= 400) {
      response.data.message = getMessage(response.data)
      omit(response.data, ['en_us', 'zh_cn'])
    }
    return response
  },
  (error) => {
    const {
      response: { status },
      message,
    } = error
    emitter.emit('error:http_status', `${status}: ${message}`)
    return Promise.reject(error)
  }
)

const request = async (params, method = 'GET', url = '/portal_api') => {
  // 间隔200ms 循环300次获取user
  const owner = await getOwnerLoop(300)

  return client.request({
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
}

export { getMessage }

export default request
