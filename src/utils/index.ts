import { get } from 'lodash-es'
import request from './request'
import customRequest from './customRequest'
import emitter from './emitter'

export * from './convert'

export const getHelpCenterLink = (path: string) =>
  `${get(window, 'GLOBAL_CONFIG.new_docs_url', '')}${path}`

export { request, customRequest, emitter }
