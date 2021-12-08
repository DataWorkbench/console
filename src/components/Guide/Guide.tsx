import { FC } from 'react'
import { GuideItem, GuideItemProps } from './GuideItem'

export interface GuideProps {
  title: string
  items: GuideItemProps[]
  className?: string
}

export const Guide: FC<GuideProps> = ({ title, items, ...rest }) => {
  return (
    <div tw="mt-6 mx-8 2xl:mx-10" {...rest}>
      <div tw="text-xl text-neut-15">{title}</div>
      <div tw="flex justify-center mt-5 space-x-6">
        {items.map(({ ...item }, i) => (
          <GuideItem
            {...item}
            key={item.title}
            index={i + 1}
            hideLine={i + 1 === items.length}
          />
        ))}
      </div>
    </div>
  )
}
