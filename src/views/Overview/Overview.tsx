import { observer } from 'mobx-react-lite'
import { PageTab } from '@QCFE/qingcloud-portal-ui'
import { get } from 'lodash-es'
import {
  FlexBox,
  Card,
  CardHeader,
  CardContent,
  IconCard,
  HelpCenterLink,
} from 'components'
import { useStore } from 'stores'
import { getHelpCenterLink } from 'utils'
import SpaceListModal from './SpaceListModal'
import Services from './Services'
import PlatformFeat from './PlatformFeat/PlatformFeat'
import FAQ from './FAQ'
import Practice from './Practice'

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
          {mtxt}好，{get(window, 'USER.user_name', '')}，欢迎您使用大数据工作台
        </span>
      ),
      description:
        '	大数据工作台提供一站式智能大数据开发平台，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力，并专注于解决业务计算问题，降低用户使用成本，将代码开发门槛降到最低',
      icon: 'dashboard',
      newsLink: getHelpCenterLink('/news/product_news/'),
      helpLink: getHelpCenterLink('/manual/overview/'),
    },
  ]
}

function Overview() {
  const {
    overViewStore: { showSpaceModal },
  } = useStore()

  return (
    <div tw="p-5 space-y-5">
      <PageTab tabs={getTabs()} />
      <Services />
      <FlexBox>
        <FlexBox flex="1" tw="mr-4">
          <PlatformFeat />
        </FlexBox>
        <FAQ tw="w-4/12 2xl:w-[360px]" />
      </FlexBox>
      <FlexBox>
        <Practice tw="flex-1 mr-4" />
        <Card tw="w-4/12 2xl:w-[360px]" hasBoxShadow>
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
        </Card>
      </FlexBox>
      {showSpaceModal && <SpaceListModal />}
    </div>
  )
}

export default observer(Overview)
