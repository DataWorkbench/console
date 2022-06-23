import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FC, MouseEventHandler, ReactElement, ReactNode } from 'react'
import tw, { styled } from 'twin.macro'
import { FlexBox } from 'components/Box'
import { Center } from '../Center'
import { TextEllipsis } from '../TextEllipsis'

export interface IInstanceNameProps {
  theme: 'dark' | 'light'
  name: ReactNode
  desc?: string
  icon?: string | ReactElement
  className?: string
  iconClassName?: string
  iconHasBorder?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  iconSize?: 'small' | 'medium' | 'large'
}

const Circle = styled(Center)(
  ({
    theme = 'dark',
    iconHasBorder = true,
  }: {
    theme: 'dark' | 'light'
    iconHasBorder: boolean
  }) => {
    return [
      tw`box-content rounded-full w-6 h-6`,
      theme === 'dark' && tw`bg-neut-13  border-neut-16 `,
      theme === 'light' && tw`bg-neut-2 border-white`,
      iconHasBorder && tw`border`,
    ]
  }
)

const getIconSize = ({ size }: { size: 'small' | 'medium' | 'large' }) =>
  ({
    small: {
      container: tw`w-4 h-4`,
      icon: 12,
    },
    medium: {
      container: tw`w-6 h-6`,
      icon: 16,
    },
    large: {
      container: tw`w-10 h-10`,
      icon: 22,
    },
  }[size])

export const InstanceName: FC<IInstanceNameProps> = (props) => {
  const {
    theme,
    name,
    desc,
    icon,
    className,
    iconClassName,
    onClick,
    iconSize = 'medium',
    iconHasBorder = true,
  } = props
  return (
    <FlexBox
      tw="items-center truncate flex-auto gap-2"
      css={[onClick ? tw`cursor-pointer` : '']}
      className={className}
      onClick={onClick}
    >
      {typeof icon === 'string' ? (
        <Circle
          tw="flex-none"
          css={getIconSize({ size: iconSize! })?.container}
          theme={theme}
          className="instance-name-icon"
          iconHasBorder={iconHasBorder}
        >
          <Icon
            name={icon}
            type={theme === 'dark' ? 'light' : 'dark'}
            className={iconClassName}
            size={getIconSize({ size: iconSize! })?.icon}
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
