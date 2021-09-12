import React from 'react'
import tw from 'twin.macro'

interface CardHeaderProps {
  className?: string
  title: string
  subtitle?: string
  hasPrex?: boolean
  classes?: any
}

const Root = tw.div`pt-5 pb-3`
const TitleWrapper = tw.div`text-base font-semibold text-neut-16 flex items-center`
const HeaderPrex = tw.div`h-4 w-1 bg-neut-16`
const Title = tw.div`pl-5`
const SubTitle = tw.div`text-xs mt-1 text-neut-8 pl-5`

const CardHeader = ({
  className,
  title,
  subtitle,
  classes,
  hasPrex,
  ...restProps
}: CardHeaderProps) => {
  return (
    <Root {...restProps}>
      <TitleWrapper>
        {hasPrex && <HeaderPrex />}
        <Title>{title}</Title>
      </TitleWrapper>
      {subtitle && <SubTitle className={classes.subtitle}>{subtitle}</SubTitle>}
    </Root>
  )
}

CardHeader.defaultProps = {
  classes: {},
  hasPrex: true,
}

export default CardHeader
