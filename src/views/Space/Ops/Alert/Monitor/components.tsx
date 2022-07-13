import { Tooltip } from 'components/Tooltip'
import { Tag } from './styles'

interface IUserInfo {
  name: string
  tel?: string
  wechat?: string
  webhook?: string
  email?: string
}

// eslint-disable-next-line import/prefer-default-export
export const UserItem = (props: IUserInfo) => {
  const { name, tel, wechat, webhook, email } = props
  return (
    <Tooltip
      hasPadding
      theme="light"
      content={
        <div tw="text-xs text-neut-13">
          {!!tel && (
            <div>
              <span>手机：</span>
              <span>{tel}</span>
            </div>
          )}
          {!!email && (
            <div>
              <span>邮箱：</span>
              <span>{email}</span>
            </div>
          )}
          {!!wechat && (
            <div>
              <span>微信：</span>
              <span>{wechat}</span>
            </div>
          )}
          {!!webhook && (
            <div>
              <span>webhook：</span>
              <span>{webhook}</span>
            </div>
          )}
        </div>
      }
    >
      <Tag>{name}</Tag>
    </Tooltip>
  )
}
