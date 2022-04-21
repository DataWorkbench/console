import { Icon } from '@QCFE/qingcloud-portal-ui'
import { FC, ReactElement } from 'react'
import tw, { css, styled } from 'twin.macro'
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
}

const Circle = styled.div(({ theme = 'dark' }: { theme: 'dark' | 'light' }) => {
  return [
    tw`border-2 box-content rounded-full w-6 h-6 mr-1.5`,
    theme === 'dark' && tw`bg-neut-13  border-neut-16 `,
    theme === 'light' && tw`bg-[#E2E8F0] border-white`,
  ]
})

const InstanceNameWrapper = styled(Center)(
  ({ theme = 'dark' }: { theme: 'dark' | 'light' }) => {
    return [tw`truncate`, css``]
  }
)

export const darkInstanceNameStyle = css``

const InstanceName: FC<IInstanceNameProps> = (props) => {
  const { theme, name, desc, icon, className, iconClassName, iconHasBorder } = props
  return (
    <Center tw="truncate" className={className}>
      {typeof icon === 'string' ? (
        <Icon name={icon} type={theme} className={iconClassName} />
      ) : (
        icon
      )}
      <div tw="truncate">
        <TextEllipsis theme={theme === 'dark' ? 'light' : 'darker'}>
          {name}
        </TextEllipsis>
        {desc && (
          <TextEllipsis theme={theme === 'dark' ? 'light' : 'darker'}>
            <span>{desc}</span>
          </TextEllipsis>
        )}
      </div>
    </Center>
  )
}
