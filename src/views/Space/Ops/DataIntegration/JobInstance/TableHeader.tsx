import { Icon, Button, ToolBar } from '@QCFE/qingcloud-portal-ui'

import { FlexBox } from 'components/Box'
import { IColumn } from 'hooks/utils'
import { Table } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled } from 'twin.macro'
import { dataJobInstanceColumns } from '../constants'

const { FilterInput } = Table as any
const FilterInputWrapper = styled.div`
  ${tw`flex-auto border-line-dark border`}
  & .table-filter-bar {
    ${tw`border-none! text-xs!`}
  }
  & .table-filter-bar .autosuggest .autosuggest-input > input {
    ${tw`bg-transparent! border-none! text-white! text-xs!`}
  }
`

const { ColumnsSetting } = ToolBar as any

interface ITableHeaderProps {
  columnsSetting: {
    defaultColumns: IColumn[]
    storageKey: string
    onSave: (s: Record<string, any>[]) => void
  }
}

const TableHeader = observer((props: ITableHeaderProps) => {
  const {
    columnsSetting: { storageKey, onSave },
  } = props
  return (
    <FlexBox tw=" gap-2">
      <FilterInputWrapper>
        <FilterInput
          tw="border-line-dark!"
          placeholder="搜索关键字或输入过滤条件"
        />
      </FilterInputWrapper>

      <Button type="black" loading={false} tw="px-[5px] border-line-dark!">
        <Icon name="if-refresh" tw="text-xl text-white" type="light" />
      </Button>
      <ColumnsSetting
        defaultColumns={dataJobInstanceColumns}
        storageKey={storageKey}
        onSave={onSave}
      />
    </FlexBox>
  )
})

export default TableHeader
