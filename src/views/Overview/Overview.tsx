/* eslint-disable @typescript-eslint/no-unused-vars */
import { observer } from 'mobx-react-lite'
import { PageTab, Icon } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import { FlexBox, Card, CardHeader, CardContent, IconCard, HelpCenterLink } from 'components'
import { useStore } from 'stores'
import { getHelpCenterLink } from 'utils'
import topBg from 'assets/top-ad-bg.png'
import tw, { css, styled } from 'twin.macro'
import bg from 'assets/enfi/top-bg.svg'
import f1 from 'assets/enfi/fk-1.svg'
import f2 from 'assets/enfi/fk-2.svg'
import f3 from 'assets/enfi/fk-3.svg'
import SpaceListModal from './SpaceListModal'
import Services from './Services'
import PlatformFeat from './PlatformFeat/PlatformFeat'
import FAQ from './FAQ'
import Practice from './Practice'

const TopBg = styled.div(() => [
  tw`flex justify-center w-full h-16 items-center bg-no-repeat bg-center bg-cover text-[18px] font-medium text-[#33343C]`,
  css`
    background-image: url(${topBg});
  `
])

function getTabs() {
  const h = new Date().getHours()
  let mtxt = '上午'
  if (h > 12 && h < 18) {
    mtxt = '下午'
  } else if (h >= 18) {
    mtxt = '晚上'
  }
  return [
    {
      title: (
        <span tw="font-semibold">
          {mtxt}好，{get(window, 'USER.user_name', get(window, 'USER.name', ''))}
          ，欢迎您使用大数据工作台
        </span>
      ),
      description:
        '	大数据工作台提供一站式智能大数据开发平台，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力，并专注于解决业务计算问题，降低用户使用成本，将代码开发门槛降到最低',
      icon: 'dashboard',
      newsLink: get(window, 'CONFIG_ENV.IS_PRIVATE', false)
        ? null
        : getHelpCenterLink('/news/product_news/'),
      helpLink: getHelpCenterLink('/manual/overview/')
    }
  ]
}

const Top = () => {
  const h = new Date().getHours()
  let mtxt = '上午'
  if (h > 12 && h < 18) {
    mtxt = '下午'
  } else if (h >= 18) {
    mtxt = '晚上'
  }

  return (
    <div
      tw="relative rounded-[8px] bg-white overflow-hidden"
      css={[
        css`
          box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.04);
          background-image: url(${bg});
        `
      ]}
    >
      <div tw=" top-0 left-0 bottom-0 p-6 pr-[100px]" css={[css``]}>
        <div tw="flex gap-0.5">
          <img src={f1} alt="" />
          <img src={f2} alt="" />
          <img src={f3} alt="" />
        </div>
        <div tw="mt-2">
          <span
            css={css`
              font-weight: 700;
              font-size: 24px;
              line-height: 32px;
              letter-spacing: -0.03em;
              color: #333333;
            `}
          >
            {mtxt}好，{get(window, 'USER.user_name', get(window, 'USER.name', ''))}
            ，欢迎您使用大数据工作台
          </span>
        </div>
        <div>
          <span
            css={[
              css`
                font-weight: 400;
                font-size: 12px;
                line-height: 16px;
                letter-spacing: -0.03em;
                color: #666666;
              `
            ]}
          >
            大数据工作台提供一站式智能大数据开发平台，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力，并专注于解决业务计算问题，降低用户使用成本，将代码开发门槛降到最低
          </span>
        </div>
        <HelpCenterLink href="/manual/overview/" color="" tw="no-underline font-normal text-left">
          <div tw="flex gap-1 mt-4">
            <Icon name="enfi-book" />
            <span
              css={css`
                font-weight: 600;
                font-size: 12px;
                line-height: 16px;
                letter-spacing: -0.03em;
                text-decoration-line: underline;
                color: #333333;
              `}
            >
              使用指南
            </span>
          </div>
        </HelpCenterLink>
      </div>
      <div>{/* <img src={bg} alt="" /> */}</div>
    </div>
  )
}

function Overview() {
  const {
    overViewStore: { showSpaceModal }
  } = useStore()

  return (
    <div>
      {false && (
        <TopBg>
          <div>
            <span tw="inline-block leading-[25px]">大数据工作台火热公测中，免费提供</span>
            <span tw="inline-block text-green-11 leading-[25px]">12 CPU 48 G 内存</span>
          </div>
        </TopBg>
      )}
      <div tw="p-5 space-y-5">
        <Top />
        {/* <PageTab tabs={getTabs()} /> */}
        <Services />
        <FlexBox>
          <FlexBox flex="1" tw="mr-4">
            <PlatformFeat />
          </FlexBox>
          <FAQ tw="w-4/12 2xl:w-[360px]" />
        </FlexBox>
        <FlexBox>
          <Practice tw="flex-1" />
          {/* <Card tw="w-4/12 2xl:w-[360px]" hasBoxShadow>
            <CardHeader title="视频介绍" />
            <CardContent>
              <HelpCenterLink
                href="/video/video/"
                isIframe={false}
                hasIcon={false}
                color=""
                tw="flex-1 no-underline font-normal text-left"
              >
                <IconCard
                  icon="laptop"
                  title="大数据工作台数据开发实操视频"
                  subtitle={<div tw="h-10">大数据开发的全流程实操演示</div>}
                />
              </HelpCenterLink>
            </CardContent>
          </Card> */}
        </FlexBox>
        {showSpaceModal && <SpaceListModal />}
      </div>
    </div>
  )
}

export default observer(Overview)
