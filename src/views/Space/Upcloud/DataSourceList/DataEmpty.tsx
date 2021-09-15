import { Button, Icon } from '@QCFE/qingcloud-portal-ui'
import { ContentBox } from 'components'

const DataEmpty = ({ onAddClick }: { onAddClick: () => void }) => (
  <ContentBox tw="py-20 rounded-sm bg-white">
    <div tw="text-center mx-auto w-9/12">
      <Icon name="blockchain" size={60} tw="mb-3" />
      <div tw="mb-3 font-medium text-xl">暂无数据源</div>
      <p tw="mx-auto mb-3 w-3/5 text-neut-8">
        数据源主要用于数据集成过程中 Reader 和 Writer
        的对象，您可以在数据源管理页面查看、新增及批量新增数据源。指定的整个数据库全部或者部分表一次性的全部同步至MySQL，并且支持后续的实时增量同步模式，将新增数据持续同步至
        MySQL。
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
    </div>
  </ContentBox>
)

export default DataEmpty
