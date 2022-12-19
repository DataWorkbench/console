import { FC } from 'react'
import { Card, CardContent, CardHeader, Center, FlexBox, HelpCenterLink, Tooltip } from 'components'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled, theme } from 'twin.macro'
import useIcon from 'hooks/useHooks/useIcon'
import qrcode from 'assets/qrcode.png'
import { get } from 'lodash-es'
import icons from './icons'

const questions = [
  {
    title: '大数据工作台的基本概念',
    link: '/intro/concept/'
  },
  {
    title: '使用大数据工作台的准备工作',
    link: '/prepare/create_workspace/'
  },
  {
    title: '数据开发的基本流程',
    link: '/intro/development_process/'
  },
  !get(window, 'CONFIG_ENV.IS_PRIVATE', false)
    ? { title: '大数据工作台的计费概述', link: '/billing/price/' }
    : { title: '数据服务API开发流程', link: '/manual/data_service/summary/#api-开发流程' },
  // { title: '大数据工作台监控与运维', link: '' },
  // { title: '大数据工作台的计费概述11', link: '' },
  { title: '使用限制', link: '/intro/restriction/' },
  { title: '其他常见问题', link: '/faq/consult/' }
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
      <CardHeader
        hasPrex={false}
        title={
          <span
            css={css`
              font-weight: 700;
              font-size: 20px;
              line-height: 27px;
              letter-spacing: -0.03em;
              color: #333333;
            `}
          >
            常见问题
          </span>
        }
      />
      {!get(window, 'CONFIG_ENV.IS_PRIVATE', false) && <JoinUs />}
    </FlexBox>
    <CardContent>
      <div
        css={css`
          background: #ffffff;
          border: 1px solid #dfecff;
          border-radius: 8px;
        `}
      >
        <div tw="text-neut-15 p-4 space-y-4">
          {questions.map((quest) => (
            <Question key={quest.title}>
              <Icon name="enfi-faq" tw="mr-2" />
              <HelpCenterLink
                tw="text-neut-15 no-underline font-normal hover:text-green-11 hover:font-medium"
                href={quest.link}
                css={css`
                  font-style: normal;
                  font-weight: 400;
                  font-size: 10px;
                  line-height: 13px;
                  letter-spacing: -0.03em;
                  color: #333333;
                `}
              >
                {quest.title}
              </HelpCenterLink>
            </Question>
          ))}
        </div>
        <div tw="text-center bg-neut-1 py-2 font-medium flex align-middle justify-center border-t bg-[#f8fcff] border-[#dfecff] h-[46px]">
          <Question>
            <HelpCenterLink
              tw="mr-2 text-neut-15 no-underline font-medium hover:text-green-11"
              href="/intro/introduction/"
              css={css`
                font-weight: 600;
                font-size: 14px;
                line-height: 19px;
                letter-spacing: -0.03em;
                color: #333333;
              `}
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
