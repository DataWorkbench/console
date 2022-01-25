import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Center, Icons, TextEllipsis } from 'components'
import { CONNECTION_STATUS } from './constant'

export const getPingConnection = (
  connection?: -1 | 1 | 3,
  row?: Record<string, any>
) => {
  if (connection === undefined) {
    return null
  }
  const renderFn = (state: 'loading' | 'success' | 'fail') => {
    switch (state) {
      case 'loading':
        return (
          <Center tw="space-x-1">
            <Icon name="if-load" tw="mr-1" size={16} />
            <span tw="text-green-11">检测中</span>
          </Center>
        )
      case 'success':
        return (
          <Center tw="space-x-1">
            <Icons name="circle_check" size={16} />
            <span tw="text-green-11">可用</span>
          </Center>
        )
      default:
        return (
          <Center tw="truncate text-error">
            <TextEllipsis>
              <span tw="leading-4 ">
                <Icons name="circle_close" size={16} />
                <span tw="ml-1">不可用，</span>
                <span>{row?.message}</span>
              </span>
            </TextEllipsis>
          </Center>
        )
    }
  }
  return renderFn(CONNECTION_STATUS[connection])
}

export default getPingConnection
