import React, { FC } from 'react'
import tw from 'twin.macro'

export interface CardHeaderProps {
  className?: string
  title: React.ReactNode
  subtitle?: string
  hasPrex?: boolean
  classes?: {
    subtitle?: string
  }
}

const Root = tw.div`pt-5 pb-3`
const TitleWrapper = tw.div`text-base font-semibold text-neut-16 flex items-center`
const HeaderPrex = tw.div`h-4 w-1 bg-neut-16`
const Title = tw.div`pl-5`
const SubTitle = tw.div`text-xs mt-1 text-neut-8 pl-5`

export const CardHeader: FC<CardHeaderProps> = ({
  title,
  subtitle,
  classes = {},
  hasPrex = true,
  ...restProps
}) => {
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
