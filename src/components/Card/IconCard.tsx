import tw, { styled } from 'twin.macro'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import Box from 'components/Box'

interface IconCardProps {
  icon: string
  title: string
  subtitle?: string
  className?: string
  layout?: 'vertical' | 'horizon'
}

const Root = styled.div(({ layout }: { layout: string }) => [
  tw`bg-neut-1 cursor-pointer flex items-center  rounded-sm border border-neut-2`,
  tw`hover:(border-green-4 bg-green-0) transition-colors duration-300`,
  layout === 'vertical' ? tw`flex-col px-8 py-2` : tw`py-3 px-3`,
])
const IconWrapper = styled.div(({ layout }: { layout: string }) => [
  tw`w-10 h-10 flex items-center justify-center  bg-gradient-to-tr from-neut-15 to-neut-10 shadow-md`,
  tw`group-hover:from-green-11 group-hover:to-green-3`,
  layout !== 'vertical' && tw`mr-3`,
])

const Title = styled.div(({ layout }: { layout: string }) => [
  tw`text-neut-15`,
  layout === 'vertical' ? tw`pt-1` : tw`font-medium`,
])

const IconCard = (props: IconCardProps) => {
  const { icon, title, subtitle, layout, className } = props
  return (
    <Root className={`group ${className}`} layout={layout}>
      <IconWrapper layout={layout}>
        <Icon name={icon} type="light" size={28} />
      </IconWrapper>
      <Box tw="flex-1">
        <Title layout={layout}>{title}</Title>
        {subtitle && <Box>{subtitle}</Box>}
      </Box>
    </Root>
  )
}

IconCard.defaultProps = {
  layout: 'horizon',
}

export default IconCard
