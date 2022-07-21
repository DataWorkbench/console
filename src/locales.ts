import { merge } from 'lodash-es'
// @ts-ignore
import LegoUILocales from '@QCFE/lego-ui/lib/locales/index'
// @ts-ignore
import PortalUILocales from '@QCFE/qingcloud-portal-ui/lib/locales/index'

const legoLocales = {
  en: LegoUILocales['en-US'],
  'zh-cn': LegoUILocales['zh-CN']
}

const portalUILocales = {
  'en-US': PortalUILocales.en,
  'zh-CN': PortalUILocales['zh-cn']
}

export default merge(legoLocales, PortalUILocales, LegoUILocales, portalUILocales, {})
