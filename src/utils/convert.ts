import { mapValues, isPlainObject, has, isArray, keys } from 'lodash-es'
import dayjs from 'dayjs'

function parseI18n(obj: any, lang?: string): any {
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

const formatDate = (timestamp: number, fmt?: string) =>
  dayjs(timestamp * 1000).format(fmt || 'YYYY-MM-DD HH:mm:ss')

const getShortSpaceName = (str: string) => {
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

export { parseI18n, formatDate, getShortSpaceName }
