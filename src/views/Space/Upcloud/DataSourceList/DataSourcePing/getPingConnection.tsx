import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Center, Icons, TextEllipsis } from 'components'
import { ValueOf } from 'utils/types'
import { CONNECTION_STATUS } from '../constant'

export const getPingConnection = (
  connection?: -1 | 0 | 1 | 2,
  row?: Record<string, any>
) => {
  if (connection === undefined) {
    return null
  }
  const renderFn = (state: ValueOf<typeof CONNECTION_STATUS>) => {
    switch (state) {
      case CONNECTION_STATUS.UNDO:
        return (
          <Center tw="space-x-1">
            <Icon name="step" tw="mr-1" size={16} />
            <span className="ping-connection-status">未测试</span>
          </Center>
        )
      case CONNECTION_STATUS.LOADING:
        return (
          <Center tw="space-x-1">
            <Icon name="if-load" tw="mr-1" size={16} />
            <span className="ping-connection-status" tw="text-green-11">
              检测中
            </span>
          </Center>
        )
      case CONNECTION_STATUS.SUCCESS:
        return (
          <Center tw="space-x-1">
            <Icons name="circle_check" size={16} />
            <span className="ping-connection-status" tw="text-green-11">
              可用
            </span>
          </Center>
        )
      default:
        return (
          <Center tw="truncate text-error leading-4 ">
            <TextEllipsis>
              <span tw="leading-4">
                <Icons name="circle_close" size={16} />
                <span className="ping-connection-status" tw="ml-1 leading-4">
                  不可用
                </span>
                {row?.message && <span>，{row?.message}</span>}
              </span>
            </TextEllipsis>
          </Center>
        )
    }
  }
  return renderFn(connection)
}

export default getPingConnection
