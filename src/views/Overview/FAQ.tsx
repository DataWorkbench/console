import { FC } from 'react'
import { Card, CardHeader, CardContent, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled, theme } from 'twin.macro'

const questions = [
  {
    title: '大数据工作台的基本概念',
    link: '/intro/concept/',
  },
  {
    title: '使用大数据工作台的准备工作',
    link: '/prepare/create_account/',
  },
  {
    title: '数据开发的基本流程',
    link: '/intro/development_process/',
  },
  { title: '大数据工作台的计费概述', link: '/billing/price/' },
  // { title: '大数据工作台监控与运维', link: '' },
  // { title: '大数据工作台的计费概述11', link: '' },
  { title: '使用限制', link: '/intro/restriction/' },
  { title: '其他常见问题', link: '/databench/faq/' },
]

const Question = styled('div')(() => [
  tw`flex items-center cursor-pointer`,
  css`
    &:hover {
      svg {
        ${tw`text-green-11`}
        fill: ${theme('colors.green.4')};
      }
    }
  `,
])

const FAQ: FC = ({ className }) => {
  return (
    <Card className={className} tw="leading-5" hasBoxShadow>
      <CardHeader title="常见问题" />
      <CardContent>
        <div tw="rounded-sm border border-neut-2">
          <div tw="text-neut-15 p-4 space-y-2">
            {questions.map((quest) => (
              <Question key={quest.title}>
                <Icon name="file" tw="mr-2" />
                <HelpCenterLink
                  tw="text-neut-15 no-underline font-normal hover:text-green-11 hover:font-medium"
                  href={quest.link}
                >
                  {quest.title}
                </HelpCenterLink>
              </Question>
            ))}
          </div>
          <div tw="text-center bg-neut-1 py-2 font-medium flex align-middle justify-center border-t border-[#DEE6ED]">
            <Question>
              <HelpCenterLink
                tw="mr-2 text-neut-15 no-underline font-medium hover:text-green-11"
                href="/intro/introduction/"
              >
                更多帮助指引
              </HelpCenterLink>
              <Icon name="next" />
            </Question>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FAQ
