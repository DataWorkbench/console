// import { get } from 'lodash-es'
import request from './request'
import customRequest from './customRequest'
import emitter from './emitter'

export * from './convert'

export const getHelpCenterLink = (path: string) => {
  const prefix = ''
  return `${prefix}/bigdata/dataomnis${path}`
}

export const getHelpCenterLinkWithNullHost = (path: string) =>
  `/bigdata/dataomnis${path}`

export const getIsFormalEnv = () => false
// /console\d*\.qingcloud\.com$/.test(window.location.hostname)

export const getApiJobMode = (jobId: string) => {
  if (/^syj-/.test(jobId)) {
    return 'sync'
  }
  if (/^wks-/.test(jobId)) {
    return 'stream'
  }
  return null
}

const autoIncrementKey = new Proxy({} as Record<string, any>, {
  get: (target, p: string) => {
    if (p in target) {
      target[p] += 1
    } else {
      target[p] = 0
    }
    return target[p]
  },
})

export function check(num: number) {
  // eslint-disable-next-line no-bitwise
  return num > 0 && (num & (num - 1)) === 0
}

export { request, customRequest, emitter, autoIncrementKey }
