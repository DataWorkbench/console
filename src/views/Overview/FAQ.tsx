import { FC } from 'react'
import { Card, CardContent, CardHeader, Center, FlexBox, HelpCenterLink, Tooltip } from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled, theme } from 'twin.macro'
import useIcon from 'hooks/useHooks/useIcon'
import qrcode from 'assets/qrcode.png'
import icons from './icons'

const questions = [
  {
    title: '大数据工作台的基本概念',
    link: '/intro/concept/'
  },
  {
    title: '使用大数据工作台的准备工作',
    link: '/prepare/create_account/'
  },
  {
    title: '数据开发的基本流程',
    link: '/intro/development_process/'
  },
  { title: '大数据工作台的计费概述', link: '/billing/price/' },
  // { title: '大数据工作台监控与运维', link: '' },
  // { title: '大数据工作台的计费概述11', link: '' },
  { title: '使用限制', link: '/intro/restriction/' },
  { title: '其他常见问题', link: '/databench/faq/' }
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
  `
])

const JoinUs = () => {
  useIcon(icons)
  return (
    <div
      tw="m-5"
      css={css`
        .tippy-box {
          .tippy-arrow::before {
            ${tw`border-t-white!`}
          }
          box-shadow: 0px 8px 16px rgba(11, 18, 25, 0.1);
        }
      `}
    >
      <Tooltip
        placement="top"
        appendTo="parent"
        theme="light"
        content={
          <div tw="w-[184px] h-[212px] p-3">
            <img src={qrcode} tw="w-full" alt="" />
            <div tw="mt-2 text-center text-neut-19 leading-4">微信扫一扫，立即加入</div>
          </div>
        }
        twChild={
          css`
            &[aria-expanded='true'] {
              .join-us {
                ${tw`cursor-pointer text-green-11`}
              }

              .icon svg.qicon {
                ${tw`text-green-11`}
                fill: ${theme('colors.green.4')};
              }
            }
          ` as any
        }
      >
        <Center
          className="join-us"
          css={css`
            ${tw`gap-1`}
            .join-us:hover {
              ${tw`cursor-pointer`}
              .icon svg.qicon {
                ${tw`text-green-11`}
                fill: ${theme('colors.green.4')};
              }
            }
          `}
        >
          <Icon size={14} name="q-messageCircleDuotone" />
          <span>加入产品交流群</span>
        </Center>
      </Tooltip>
    </div>
  )
}

const FAQ: FC = ({ className }: { className?: string }) => (
  <Card className={className} tw="leading-5" hasBoxShadow>
    <FlexBox tw="justify-between">
      <CardHeader title="常见问题" />
      <JoinUs />
    </FlexBox>
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

export default FAQ
