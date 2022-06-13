import { Button, HelpCenterModal, Icon, Modal } from '@QCFE/qingcloud-portal-ui'
import { ContentBox, FlexBox, Tooltip } from 'components'
import SexangleImg from 'assets/svgr/sexangle.svg'

import { getHelpCenterLink, getIsFormalEnv } from 'utils'
import { isDarkTheme } from 'utils/theme'

const DataEmpty = ({ onAddClick }: { onAddClick: () => void }) => {
  const button = (
    <Button
      type="primary"
      disabled={getIsFormalEnv()}
      onClick={getIsFormalEnv() ? undefined : onAddClick}
    >
      <Icon name="add" type="light" />
      新增数据源
    </Button>
  )

  const buttonWithDisabled = getIsFormalEnv() ? (
    <Tooltip theme="darker" hasPadding content="敬请期待">
      {button}
    </Tooltip>
  ) : (
    button
  )

  return (
    <ContentBox tw="py-20 rounded-sm bg-white dark:bg-neut-16">
      <FlexBox tw="flex-col items-center">
        <div tw="mb-5 relative w-[72px] ">
          <SexangleImg color={isDarkTheme() ? '#4C5E70' : '#F5F7FA'} />
          <div tw="absolute w-16 left-1.5 top-3">
            <Icon
              name="blockchain"
              type="dark"
              color={
                isDarkTheme()
                  ? {
                      primary: '#fff',
                      secondary: '#949ea9',
                    }
                  : {}
              }
              size={60}
              tw="mb-3 inline-block"
            />
          </div>
        </div>
        <div tw="mb-5 font-medium text-xl dark:text-[#19121A] dark:text-white leading-5">
          暂无数据源
        </div>
        <p tw="mx-auto mb-6 text-neut-8 text-center max-w-[700px]">
          数据源定义结构化数据库、非结构化数据库、半结构化数据库以及消息队列等多种数据类型，主要用于数据集成和数据加工。您可以在数据源列表进行编辑和停用/启用管理。
        </p>
        <div>
          <Button
            tw="mr-4"
            onClick={() => {
              const openModal = Modal.open(HelpCenterModal, {
                link: getHelpCenterLink('/manual/data_up_cloud/data_summary/'),
                onCancel: () => Modal.close(openModal),
              })
            }}
          >
            <Icon name="if-book" type="light" />
            使用指南
          </Button>
          {buttonWithDisabled}
        </div>
      </FlexBox>
    </ContentBox>
  )
}

export default DataEmpty
