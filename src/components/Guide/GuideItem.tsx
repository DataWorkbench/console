import { FC } from 'react'

export interface GuideItemProps {
  title: string
  index?: number
  desc?: string
  link?: string
}

export const GuideItem: FC<GuideItemProps> = ({ index, title, desc, link }) => {
  return (
    <div tw="flex-1">
      <div tw="text-base font-medium flex">
        <div>
          <span tw="inline-block bg-green-11 text-white w-5 h-5 text-center leading-5 rounded-sm mr-1.5">
            {index}
          </span>
          {title}
        </div>
        <div tw="border-t border-neut-3 flex-1 mt-3 mx-3" />
      </div>
      <div tw="text-neut-8 mt-4 w-10/12">
        {desc}
        <a href={link} tw="text-link">
          查看
        </a>
      </div>
    </div>
  )
}
