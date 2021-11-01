import { Button, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center } from 'components'
import { useStore } from 'hooks'

const TableToolBar = () => {
  const {
    dmStore: { setOp, udfType },
  } = useStore()

  return (
    <div tw="mb-3">
      <FlexBox tw="justify-between">
        <Center tw="space-x-3">
          <Button type="primary" onClick={() => setOp('create')}>
            <Icon name="upload" />
            新建{udfType}函数节点
          </Button>
          <Button>
            <Icon name="trash" type="light" />
            <span>删除</span>
          </Button>
        </Center>
        <Center tw="space-x-3">
          <InputSearch tw="w-64" placeholder="请输入关键词进行搜索" />
          <Button>
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </Button>
        </Center>
      </FlexBox>
    </div>
  )
}

export default TableToolBar
