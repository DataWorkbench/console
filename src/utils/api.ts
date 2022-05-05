import { isNil } from 'lodash-es'
import compilePath from 'utils/compilePath'
import { request } from 'utils/index'

export const api = {
  get: (path: string) =>
    function <T extends Record<string, any>>(params: T) {
      if (!isNil(params.spaceId)) {
        Object.assign(params, { space_id: params.spaceId })
        delete params.spaceId
      }
      const [uri, { regionId }] = compilePath(path, params)
      return request({
        region: regionId,
        uri,
        method: 'GET',
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
        method: 'POST',
      })
    },
}

const firstLowerCase = (str: string) =>
  str.slice(0, 1).toLocaleLowerCase() + str.slice(1)

type FirstLowerCase<T> = T extends string
  ? T extends `${infer U}${infer V}`
    ? `${Lowercase<U>}${V}`
    : T
  : T

export type ApiWithKey<T> = T extends Record<string, string[]>
  ? Record<
      FirstLowerCase<keyof T>,
      (d: Record<string, any>) => PromiseLike<any>
    >
  : never

export function apiConfig<T extends Record<string, string[]>>(
  config: T
): ApiWithKey<T> {
  return Object.entries(config).reduce((acc, [key, [method, path]]) => {
    if (api[method as 'get']) {
      acc[firstLowerCase(key)] = api[method as 'get'](path)
    }
    return acc
  }, {} as any)
}
