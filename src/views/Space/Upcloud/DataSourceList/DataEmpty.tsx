import { Button, Icon, Modal, HelpCenterModal } from '@QCFE/qingcloud-portal-ui'
import { ContentBox, FlexBox } from 'components'
import SexangleImg from 'assets/svgr/sexangle.svg'
import { getHelpCenterLink, getIsFormalEnv } from 'utils'

const DataEmpty = ({ onAddClick }: { onAddClick: () => void }) => (
  <ContentBox tw="py-20 rounded-sm bg-white">
    <FlexBox tw="flex-col items-center">
      <div tw="mb-5 relative w-[72px] ">
        <SexangleImg />
        <div tw="absolute w-16 left-1.5 top-3">
          <Icon name="blockchain" size={60} tw="mb-3 inline-block" />
        </div>
      </div>
      <div tw="mb-5 font-medium text-xl text-[#19121A] leading-5">
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
              link: getHelpCenterLink(
                '/manual/data_up_cloud/source_data/data_summary/'
              ),
              onCancel: () => Modal.close(openModal),
            })
          }}
        >
          <Icon name="if-book" type="light" />
          使用指南
        </Button>
        <Button
          type="primary"
          onClick={getIsFormalEnv() ? undefined : onAddClick}
        >
          <Icon name="add" type="light" />
          {getIsFormalEnv() ? '敬请期待' : '新增数据源'}
        </Button>
      </div>
    </FlexBox>
  </ContentBox>
)

export default DataEmpty
