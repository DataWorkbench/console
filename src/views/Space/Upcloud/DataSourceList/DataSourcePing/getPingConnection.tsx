import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
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
          <Center tw="space-x-1 truncate">
            <Center>
              <Icon name="step" size={16} />
            </Center>
            <span className="ping-connection-status" tw="truncate">
              未测试
            </span>
          </Center>
        )
      case CONNECTION_STATUS.LOADING:
        return (
          <Center tw="space-x-1 truncate">
            <Center>
              <Icon name="if-load" size={16} />
            </Center>
            <span
              className="ping-connection-status"
              tw="text-green-11 truncate"
            >
              检测中
            </span>
          </Center>
        )
      case CONNECTION_STATUS.SUCCESS:
        return (
          <Center tw="space-x-1 truncate">
            <Center>
              <Icons name="circle_check" size={16} />
            </Center>
            <span
              className="ping-connection-status"
              tw="text-green-11 truncate"
            >
              可用
            </span>
          </Center>
        )
      default:
        return (
          <Center tw="truncate text-error leading-4 ">
            <TextEllipsis>
              <span
                tw="leading-4"
                css={css`
                  svg {
                    ${tw`fill-[#CA2621] text-white`}
                  }
                `}
              >
                <div tw="inline-block align-middle">
                  <Icon name="error" size={16} />
                </div>
                <span className="ping-connection-status" tw="ml-1 leading-4 ">
                  不可用
                </span>
                <span>{row?.message && `，${row?.message}`}</span>
              </span>
            </TextEllipsis>
          </Center>
        )
    }
  }
  return renderFn(connection)
}

export default getPingConnection
