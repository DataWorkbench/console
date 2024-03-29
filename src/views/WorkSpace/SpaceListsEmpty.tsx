import { Icon, Button } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { useWorkSpaceContext } from 'contexts'
import { Guide, GuideProps, HelpCenterLink } from 'components'
import SexangleImg from 'assets/svgr/sexangle.svg'
import { get } from 'lodash-es'

const guideData: GuideProps = {
  title: '使用指引',
  items: [
    {
      title: '资源规划',
      desc: '根据您的自身业务需求，选择引擎和工作空间所在的区域及可用区，进行资源的规划，方便后续平台内部的统一运维管理。',
      link: '##'
    },
    {
      title: '添加数据源',
      desc: '在数据源管理中，添加待处理的数据源，并测试可用性。后续的数据集成、数据加工会使用到此处定义的数据源信息。',
      link: '##'
    },
    {
      title: '数据加工',
      desc: '在数据加工中，插入 FlinkSQL 语句，验证语法并提交运行，大数据工作台将提交作业到您创建的计算集群中运行。计算集群采用全托管模式，只需配置运行资源。',
      link: '##'
    }
  ]
}

const SpaceListsEmpty = () => {
  const stateStore = useWorkSpaceContext()
  const { isModal, isAdmin } = stateStore
  return (
    <div>
      <div css={[tw`bg-white`, !isModal && tw`pb-2`]}>
        <div
          css={[tw`flex items-center justify-center`, isModal ? tw`h-80 border-b-0` : tw`h-auto`]}
        >
          <div tw="w-[700px] text-center">
            <div tw="relative inline-block">
              <SexangleImg />
              <Icon name="project" size={40} tw="absolute left-4 top-5" />
            </div>
            <div css={[tw`font-medium text-xl mt-5`, isModal && tw`mt-1`]}>
              {isModal && '当前没有相关「工作空间」的数据'}
              {isAdmin && '暂无已创建的工作空间'}
              {!isModal && !isAdmin && '暂无已加入的工作空间'}
            </div>
            {isModal && (
              <div tw="mt-1 text-neut-8">
                <>
                  工作空间是在大数据工作台管理任务的基本单元。
                  <HelpCenterLink href="/intro/concept/" isIframe={!isModal} hasIcon={false}>
                    了解更多
                  </HelpCenterLink>
                </>
              </div>
            )}
            <div css={[isModal ? tw`mt-2` : tw`mt-6`]}>
              <Button
                type="primary"
                onClick={() => {
                  stateStore.set({ curSpaceOpt: 'create' })
                }}
              >
                <Icon name="add" />
                创建工作空间
              </Button>
            </div>
            {!isModal && (
              <div css={[tw`space-x-3 mt-3`, !isModal && tw`mb-8`]}>
                <HelpCenterLink href="/manual/source_data/summary/" isIframe={!isModal}>
                  使用指南
                </HelpCenterLink>
                {!get(window, 'CONFIG_ENV.IS_PRIVATE', false) && (
                  <>
                    <span tw="text-deepblue-10">|</span>
                    <HelpCenterLink href="/manual/overview/" isIframe={!isModal}>
                      介绍视频
                    </HelpCenterLink>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {!isModal && <Guide tw="hidden" title={guideData.title} items={guideData.items} />}
      </div>
    </div>
  )
}

export default SpaceListsEmpty
