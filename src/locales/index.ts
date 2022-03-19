import { merge } from 'lodash-es'
import LegoUILocales from '@QCFE/qingcloud-portal-ui/lib/locales'
import en from './en-US'
import zh from './zh-CN'

const locales = {
  'en-US': merge(en, LegoUILocales.en),
  'zh-CN': merge(zh, LegoUILocales['zh-cn']),
}

export default locales
