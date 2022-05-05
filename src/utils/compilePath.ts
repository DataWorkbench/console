import { get, isNil, omit } from 'lodash-es'

/**
 * compilePath('abc/{x}/1', {x: '123', y: true }) // ['abc/123/1', { y: true }]
 *
 * @param path
 * @param params
 */
function compilePath(
  path: string,
  params: Record<string, any>
): [string, Record<string, any>] {
  const keys = []
  let start = 0
  let end = 0
  let re = path
  for (let i = 0; i < path.length; i += 1) {
    if (path[i] === '\\') {
      // eslint-disable-next-line no-continue
      continue
    }
    if (path[i] === '{') {
      start = i
      end = i
    } else if (path[i] === '}') {
      end = i
      const item = path.slice(start, end)

      if (!isNil(get(params, item))) {
        re = re.replace(`{${item}}`, get(params, item))
        keys.push(item)
      }
    }
  }
  return [re, omit(params, keys)]
}

export default compilePath
