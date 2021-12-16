import { get } from 'lodash-es'
import request from './request'
import customRequest from './customRequest'
import emitter from './emitter'

export * from './convert'

export const getHelpCenterLink = (path: string, ifHostPrefix = false) => {
  const prefix = ifHostPrefix
    ? get(window, 'GLOBAL_CONFIG.new_docs_url', '')
    : ''
  return `${prefix}/bigdata/databench${path}`
}

export const getHelpCenterLinkWithHost = (path: string) =>
  getHelpCenterLink(path, true)

export { request, customRequest, emitter }
