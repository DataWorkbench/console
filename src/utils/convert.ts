import { mapValues, isPlainObject, has, isArray, keys } from 'lodash-es'
import dayjs from 'dayjs'

export function parseI18n(obj: any, lang?: string): any {
  if (isArray(obj)) {
    return obj.map((o) => parseI18n(o, lang))
  }
  if (isPlainObject(obj)) {
    return mapValues(obj, (o) => {
      if (isArray(o)) {
        return parseI18n(o, lang)
      }
      if (isPlainObject(o)) {
        if (keys(o).length === 2 && has(o, 'en_us') && has(o, 'zh_cn')) {
          return lang === 'en' ? o.en_us : o.zh_cn
        }
        return parseI18n(o, lang)
      }
      return o
    })
  }
  return obj
}

export const formatDate = (timestamp: number, fmt?: string) =>
  dayjs(timestamp * 1000).format(fmt || 'YYYY-MM-DD HH:mm:ss')

export const getShortSpaceName = (str: string) => {
  if (str) {
    const pattern = new RegExp('[\u4E00-\u9FA5]+')
    const profileName = str.substr(0, 2)
    if (pattern.test(profileName)) {
      return str.substr(0, 1)
    }
    return profileName
  }
  return str
}

export const strlen = (str: string) => {
  let len = 0
  const l = str.length
  for (let i = 0; i < l; i += 1) {
    const c = str.charCodeAt(i)
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len += 1
    } else {
      len += 2
    }
  }
  return len
}

// /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
export const nameMatchRegex = /^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/

export const formatBytes = (bytes: number, decimals: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const timeFormat = (_time: number) =>
  // if (_time < 1000) {
  //   return `${_time}毫秒`
  // }
  // const time = _time / 1000
  // const minute = Math.floor(time / 60)
  // const second = Math.floor(_time % 6000) / 1000
  // return minute ? `${minute} 分 ${second} 秒` : `${second} 秒`
  dayjs(_time).fromNow()
