import { mapValues, isPlainObject, has, isArray, keys } from 'lodash'
import dayjs from 'dayjs'

function parseI18n(obj, lang) {
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

const formatDate = (timestamp, fmt) =>
  dayjs(timestamp * 1000).format(fmt || 'YYYY-MM-DD HH:mm:ss')

export { parseI18n, formatDate }