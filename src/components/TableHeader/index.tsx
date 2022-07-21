import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { IColumn } from 'hooks/useHooks/useColumns'
import { observer } from 'mobx-react-lite'
import { useIsFetching, useQueryClient } from 'react-query'
import { FilterInput } from '../FilterInput'
import { FlexBox } from '../Box'

const { ColumnsSetting } = ToolBar as any

export interface ITableHeaderProps {
  columnsSetting: {
    columns: IColumn[]
    storageKey: string
    onSave: (s: Record<string, any>[]) => void
  }
  filterLinkKey?: string
  queryKey: () => string
  suggestions: Record<string, any>[]
  filterInputConfig?: Record<string, any>
}

export const TableHeader = observer((props: ITableHeaderProps) => {
  const {
    columnsSetting: { storageKey, onSave, columns },
    filterLinkKey,
    queryKey,
    suggestions
  } = props

  const isFetching = useIsFetching()
  const queryClient = useQueryClient()

  const refetchData = () => {
    queryClient.invalidateQueries(queryKey())
  }

  return (
    <FlexBox tw="gap-2">
      <FilterInput
        filterLinkKey={filterLinkKey ?? storageKey}
        suggestions={suggestions}
        tw="border-line-dark!"
        searchKey="search"
        placeholder="搜索关键字或输入过滤条件"
        // isMultiKeyword
        {...props.filterInputConfig}
      />

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
      <ColumnsSetting defaultColumns={columns} storageKey={storageKey} onSave={onSave} />
    </FlexBox>
  )
})
