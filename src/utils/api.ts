import { isNil } from 'lodash-es'
import compilePath from 'utils/compilePath'
import { request } from 'utils/index'
import apiList from 'stores/api/apiList'

type RequestParams = {
  uri?: Record<string, any>
  params?: Record<string, any>
  data?: any
  regionId?: string
}

// mock-fetch
async function fetchData(url = '', data = {}) {
  // Default options are marked with *
  const baseUrl = 'https://yapi.yunify.com/mock/327'
  const response = await fetch(baseUrl + url, {
    // @ts-ignore
    method: data.method || 'GET', // *GET, c, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // @ts-ignore
    body: data.method === 'POST' ? JSON.stringify(data) : null, // body data type must match "Content-Type" header
    // @ts-ignore
    ...data?.body
  })
  return response.json() // parses JSON response into native JavaScript objects
}

const regExp = /(service|gateway)/g
const isMock = false // TODO: 是否使用mock
export const apiRequest =
  <T extends keyof typeof apiList>(manage: T, item: keyof typeof apiList[T]) =>
  <U extends RequestParams>(params: U) => {
    const [method, url] = apiList[manage][item] as unknown as ['GET' | 'POST' | 'PUT', string]
    const [uri] = compilePath(url, { ...params.uri })
    if (uri.match(regExp) && isMock) {
      return fetchData(uri, {
        method,
        query: params.params,
        body: params.data
      })
    }
    return request({
      region: params.regionId,
      uri,
      method,
      query: params.params,
      body: params.data
    })
  }

export const api = {
  get: (path: string) =>
    function <T extends Record<string, any>>(params: T) {
      if (!isNil(params.spaceId)) {
        Object.assign(params, { space_id: params.spaceId })
        delete params.spaceId
      }
      const [uri, { regionId, ...rest }] = compilePath(path, params)
      return request({
        region: regionId,
        uri,
        method: 'GET',
        query: rest
      })
    },
  post:
    (path: string) =>
    <T extends Record<string, any>>(params: T) => {
      if (!isNil(params.spaceId)) {
        Object.assign(params, { space_id: params.spaceId })
        delete params.spaceId
      }
      const [uri, { regionId, ...rest }] = compilePath(path, params)
      return request({
        region: regionId,
        uri,
        body: rest,
        method: 'POST'
      })
    }
}

const firstLowerCase = (str: string) => str.slice(0, 1).toLocaleLowerCase() + str.slice(1)

type FirstLowerCase<T> = T extends string
  ? T extends `${infer U}${infer V}`
    ? `${Lowercase<U>}${V}`
    : T
  : T

export type ApiWithKey<T> = T extends Record<string, string[]>
  ? Record<FirstLowerCase<keyof T>, (d: Record<string, any>) => PromiseLike<any>>
  : never

export function apiConfig<T extends Record<string, string[]>>(config: T): ApiWithKey<T> {
  return Object.entries(config).reduce((acc, [key, [method, path]]) => {
    if (api[method as 'get']) {
      acc[firstLowerCase(key)] = api[method as 'get'](path)
    }
    return acc
  }, {} as any)
}
