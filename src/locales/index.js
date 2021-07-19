import { merge } from 'lodash'
// import LegoUILocales from '@QCFE/lego-ui/lib/locales'
import en from './en-US'
import zh from './zh-CN'

const locales = merge(
  {
    'en-US': en,
    'zh-CN': zh,
  }
  // LegoUILocales
)

export default locales
