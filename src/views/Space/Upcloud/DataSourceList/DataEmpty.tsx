import { Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { ContentBox, FlexBox } from 'components'
import SexangleImg from 'assets/svgr/sexangle.svg'

const DataEmpty = ({ onAddClick }: { onAddClick: () => void }) => (
  <ContentBox tw="py-20 rounded-sm bg-white">
    <FlexBox tw="flex-col items-center">
      <div tw="mb-5 relative w-[72px] ">
        <SexangleImg />
        <div tw="absolute w-16 left-1.5 top-3">
          <Icon name="blockchain" size={60} tw="mb-3 inline-block" />
        </div>
      </div>
      <div tw="mb-3 font-medium text-xl">暂无数据源</div>
      <p tw="mx-auto mb-6 text-neut-8 text-center max-w-[700px]">
        数据源定义关系型数据库、NoSQL
        数据库、半结构化存储、消息队列等多样性数据连接的信息，用于数据同步、云上加工等开发步骤。您可以在数据源管理页面查看、新增及修改数据源。
      </p>
      <div>
        <Button tw="mr-4">
          <Icon name="if-book" type="light" />
          使用指南
        </Button>
        <Button type="primary" onClick={onAddClick}>
          <Icon name="add" type="light" />
          新增数据源
        </Button>
      </div>
    </FlexBox>
  </ContentBox>
)

export default DataEmpty
