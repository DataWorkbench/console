import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'

import { FilterInput, FlexBox } from 'components'
import { IColumn } from 'hooks/useHooks/useColumns'
import { observer } from 'mobx-react-lite'
import tw, { styled } from 'twin.macro'
import { useIsFetching, useQueryClient } from 'react-query'
import { getSyncJobInstanceKey } from 'hooks/useSyncJobInstance'
import {
  dataJobInstanceColumns,
  dataJobInstanceSuggestions,
} from '../constants'

// const { FilterInput } = Table as any
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
  columns: IColumn[]
  columnsSetting: {
    storageKey: string
    onSave: (s: Record<string, any>[]) => void
  }
}

const TableHeader = observer((props: ITableHeaderProps) => {
  const {
    columnsSetting: { storageKey, onSave },
  } = props

  const queryClient = useQueryClient()
  const isFetching = useIsFetching()

  const refetchData = () => {
    queryClient.invalidateQueries(getSyncJobInstanceKey())
  }

  return (
    <FlexBox tw=" gap-2">
      <FilterInputWrapper>
        <FilterInput
          suggestions={dataJobInstanceSuggestions}
          tw="border-line-dark!"
          placeholder="搜索关键字或输入过滤条件"
          // isMultiKeyword
          defaultKeywordLabel="作业 ID"
          searchKey="job_id"
          filterLinkKey={storageKey}
        />
      </FilterInputWrapper>

      <Button
        type="black"
        onClick={() => {
          refetchData()
        }}
        loading={!!isFetching}
        tw="px-[5px] border-line-dark!"
      >
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
