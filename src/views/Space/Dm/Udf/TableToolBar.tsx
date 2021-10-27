import { Button, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center } from 'components'
import tw, { css, styled } from 'twin.macro'

interface DarkButtonProps {
  variant: 'outlined' | 'default'
}

const DarkButton = styled('button')(({ variant }: DarkButtonProps) => [
  tw`text-white px-3 h-8 inline-flex items-center justify-center space-x-1.5 rounded-sm border`,
  variant === 'outlined' &&
    tw`border-green-12 text-green-13 border rounded-sm hover:text-green-12`,
  variant === 'outlined' &&
    css`
      &:hover {
        background-color: rgba(21, 166, 117, 0.1);
      }
      svg {
        fill: #34d399;
        color: #059669;
      }
    `,
  variant === 'default' && tw`bg-neut-13 border-neut-13 hover:bg-neut-15`,
])

const TableToolBar = () => {
  return (
    <div tw="mb-3">
      <FlexBox tw="justify-between">
        <Center tw="space-x-3">
          <Button type="primary">
            <Icon name="upload" />
            新建UDF函数节点
          </Button>
          <DarkButton variant="default">
            <Icon name="trash" type="light" />
            <span>删除</span>
          </DarkButton>
        </Center>
        <Center tw="space-x-3">
          <InputSearch tw="w-64" placeholder="请输入关键词进行搜索" />
          <DarkButton variant="outlined" tw="px-2">
            <Icon name="if-refresh" tw="text-xl text-white" type="light" />
          </DarkButton>
        </Center>
      </FlexBox>
    </div>
  )
}

export default TableToolBar
