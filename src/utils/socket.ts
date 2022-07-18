import dayjs from 'dayjs'

const defineKeys = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes']

class Socket {
  ws = null // websocket实例

  alive = false // 连接状态

  params = null // 把类的参数传入这里，方便调用

  /* 计时器 */
  reconnect_timer = null // 重连计时器

  heart_timer = null // 心跳计时器

  message_func = null // 信息onmessage缓存方法

  /* 参数 */
  heartBeat = 50000 // 心跳时间 50秒一次

  heartMsg = { msg: 'yd' } // 心跳信息

  reconnect = false // 是否自动重连

  reconnectTime = 5000 // 重连间隔时间

  reconnectTimes = 10 // 重连次数

  socketId = null

  constructor(params, config) {
    this.params = params
    if (config) {
      defineKeys.forEach((key) => {
        this[key] = config[key] ?? this[key]
      })
    }
    this.init()
  }

  /* 初始化 */
  init() {
    clearInterval(this.reconnect_timer)
    clearInterval(this.heart_timer)

    const { params } = this

    const { url, needHeartbeat } = params

    const globalParams = ['heartBeat', 'heartMsg', 'reconnect', 'reconnectTime', 'reconnectTimes']

    // 定义全局变量
    Object.keys(params).forEach((key) => {
      if (globalParams.indexOf(key) !== -1) {
        this[key] = params[key]
      }
    })

    delete this.ws
    // let protocol = protocols
    // try {
    //   protocol = JSON.stringify(protocol)
    // } catch {
    //   // error
    // }
    this.ws = new WebSocket(url)
    this.socketId = `url-${dayjs().format('YYYY-MM-DD HH:mm:ss.sss')}`
    if (this.message_func) this.onMessage(this.message_func)

    // 默认绑定事件
    this.ws.onopen = () => {
      this.alive = true // 设置状态为开启
      clearInterval(this.reconnect_timer)
      if (needHeartbeat) {
        // 连接后进入心跳状态
        this.onHeartbeat()
      }
    }

    this.ws.onclose = () => {
      this.alive = false // 设置状态为断开
      clearInterval(this.heart_timer)

      // 自动重连开启
      if (this.reconnect) {
        this.onReconnect() // 断开后立刻重连
      }
    }
  }

  /* 心跳事件 */
  onHeartbeat(func) {
    // 在连接状态下
    if (this.alive) {
      /* 心跳计时器 */
      this.heart_timer = setInterval(() => {
        // 发送心跳信息
        this.send(this.heartMsg)
        if (func) {
          func(this)
        }
      }, this.heartBeat)
    }
  }

  /* 重连事件 */
  onReconnect(func) {
    /* 重连间隔计时器 */
    this.reconnect_timer = setInterval(() => {
      // 限制重连次数
      if (this.reconnectTimes <= 0) {
        clearInterval(this.reconnect_timer)
        return // 跳出函数之间的循环
      }
      this.reconnectTimes -= 1 // 重连一次-1

      this.init() // 进入初始状态
      if (func) {
        func(this)
      }
    }, this.reconnectTime)
  }

  // 发送消息
  send(text) {
    if (this.alive) {
      const sendText = typeof text === 'string' ? text : JSON.stringify(text)
      this.ws.send(sendText)
    }
  }

  // 断开连接
  close() {
    if (this.alive) {
      this.alive = false
      this.ws.close()
    }
  }

  // 接受消息
  onMessage(func) {
    this.ws.onmessage = (data) => {
      this.message_func = func
      let msg = data.data
      try {
        msg = JSON.parse(msg)
      } catch {
        // do something
      }
      func(msg, data)
    }
  }

  on(ev, handle) {
    // 接受消息
    // const eventType = `on${ev[0].toUpperCase()}${ev.slice(1)}`
    // const thisHandle = this[eventType].bind(this, handle)

    if (this.alive) {
      this.listening_timer = null
      clearTimeout(this.listening_timer)
      this.ws.addEventListener(ev, (data) => {
        let msg = data.data
        try {
          msg = JSON.parse(msg)
        } catch {
          // do something
        }
        return handle(msg, data)
      })
    } else {
      this.listening_timer = setTimeout(() => {
        this.on(ev, handle)
      }, 50)
    }
  }

  // websocket连接成功事件
  onOpen(func) {
    this.ws.onopen = () => {
      this.alive = true
      if (func) {
        func(this)
      }
    }
  }

  // 关闭事件
  onClose(func) {
    this.ws.onclose = () => {
      // 设置状态为断开
      this.alive = false
      clearInterval(this.heart_timer)
      // 自动重连开启
      if (this.reconnect) {
        this.onReconnect() // 断开后立刻重连
      }
      if (func) {
        func(this)
      }
    }
  }

  // 错误事件
  onError(func) {
    this.ws.onerror = () => {
      if (func) {
        func(this)
      }
    }
  }
}

export default Socket

function connectSocket() {
  let socket = null
  let memoUrl = null

  return async (url, protocols, immediately) => {
    if (memoUrl !== url || !socket || !socket.alive || immediately) {
      socket = new Socket({ url, protocols })
      memoUrl = url
    }

    return socket
  }
}

const connect = connectSocket()
export { connect }
