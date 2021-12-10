import { FC } from 'react'
import { TextLink } from '../Link'

export interface GuideItemProps {
  title: string
  index?: number
  desc?: string
  link?: string
  hideLine?: boolean
}

export const GuideItem: FC<GuideItemProps> = ({
  index,
  title,
  desc,
  link,
  hideLine,
}) => {
  return (
    <div tw="flex-1">
      <div tw="text-base font-medium flex">
        <div>
          <span tw="inline-block bg-green-11 text-white w-5 h-5 text-center leading-5 rounded-sm mr-1.5">
            {index}
          </span>
          {title}
        </div>
        {!hideLine && (
          <div tw="border h-0.5 border-neut-2 flex-1 mt-[11px] mx-3 " />
        )}
      </div>
      <div tw="text-neut-8 mt-4 w-10/12">{desc}</div>
      {/* <a href={link} className="link"> */}
      <TextLink hasIcon={false} href={link}>
        详情介绍
      </TextLink>
      {/* </a> */}
    </div>
  )
}
