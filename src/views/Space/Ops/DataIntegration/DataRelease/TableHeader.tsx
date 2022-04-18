import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'
import { FilterInput, FlexBox } from 'components'
import { IColumn } from 'hooks/useHooks/useColumns'
import { observer } from 'mobx-react-lite'
import { dataReleaseSuggestions } from '../constants'

// const { FilterInput } = Table as any

const { ColumnsSetting } = ToolBar as any

interface ITableHeaderProps {
  columnsSetting: {
    columns: IColumn[]
    storageKey: string
    onSave: (s: Record<string, any>[]) => void
  }
}

const TableHeader = observer((props: ITableHeaderProps) => {
  const {
    columnsSetting: { storageKey, onSave, columns },
  } = props

  return (
    <FlexBox tw=" gap-2">
      <FilterInput
        filterLinkKey={storageKey}
        suggestions={dataReleaseSuggestions}
        tw="border-line-dark!"
        searchKey="job_name"
        placeholder="通过指定属性的关键词进行搜索"
        // isMultiKeyword
        defaultKeywordLabel="作业名称"
      />

      <Button type="black" loading={false} tw="px-[5px] border-line-dark!">
        <Icon name="if-refresh" tw="text-xl text-white" type="light" />
      </Button>
      <ColumnsSetting
        defaultColumns={columns}
        storageKey={storageKey}
        onSave={onSave}
      />
    </FlexBox>
  )
})

export default TableHeader
