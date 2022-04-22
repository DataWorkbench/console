import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FC, MouseEventHandler, ReactElement } from 'react'
import tw, { styled } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Center } from '../Center'
import { TextEllipsis } from '../TextEllipsis'

export interface IInstanceNameProps {
  theme: 'dark' | 'light'
  name: string
  desc?: string
  icon?: string | ReactElement
  className?: string
  iconClassName?: string
  iconHasBorder?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

const Circle = styled(Center)(
  ({ theme = 'dark' }: { theme: 'dark' | 'light' }) => {
    return [
      tw`border-2 box-content rounded-full w-6 h-6`,
      theme === 'dark' && tw`bg-neut-13  border-neut-16 `,
      theme === 'light' && tw`bg-neut-2 border-white`,
    ]
  }
)

export const InstanceName: FC<IInstanceNameProps> = (props) => {
  const { theme, name, desc, icon, className, iconClassName, onClick } = props
  return (
    <FlexBox
      tw="items-center truncate flex-auto gap-2"
      css={[onClick ? tw`cursor-pointer` : '']}
      className={className}
      onClick={onClick}
    >
      {typeof icon === 'string' ? (
        <Circle tw="flex-none" theme={theme} className="instance-name-icon">
          <Icon
            name={icon}
            type={theme === 'dark' ? 'light' : 'dark'}
            className={iconClassName}
          />
        </Circle>
      ) : (
        icon
      )}
      <div tw="truncate dark:text-white light:text-neut-15">
        <TextEllipsis theme={theme === 'dark' ? 'light' : 'darker'}>
          <span className="instance-name-title">{name}</span>
        </TextEllipsis>
        {desc && (
          <TextEllipsis theme={theme === 'dark' ? 'light' : 'darker'}>
            <span tw="text-neut-8">{desc}</span>
          </TextEllipsis>
        )}
      </div>
    </FlexBox>
  )
}
