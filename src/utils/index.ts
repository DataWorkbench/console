import { get } from 'lodash-es'
import request from './request'
import customRequest from './customRequest'
import emitter from './emitter'

export * from './convert'

export const getHelpCenterLink = (path: string) => {
  const prefix = get(window, 'GLOBAL_CONFIG.new_docs_url', '')
  return `${prefix}/bigdata/dataomnis${path}`
}

export const getHelpCenterLinkWithHost = (path: string) =>
  getHelpCenterLink(path)

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

export { request, customRequest, emitter, autoIncrementKey }
