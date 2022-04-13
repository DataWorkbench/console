import { Button, Icon, ToolBar } from '@QCFE/qingcloud-portal-ui'

import { FlexBox } from 'components/Box'
import { IColumn } from 'hooks/useHooks/useColumns'
import { Table } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import tw, { styled } from 'twin.macro'
import { useState } from 'react'
import { ISuggestionTag } from 'views/Space/Ops/DataIntegration/interfaces'
import { dataReleaseSuggestions } from '../constants'

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
    columns: IColumn[]
    storageKey: string
    onSave: (s: Record<string, any>[]) => void
  }
}

const TableHeader = observer((props: ITableHeaderProps) => {
  const {
    columnsSetting: { storageKey, onSave, columns },
  } = props
  const [tags, setTags] = useState<ISuggestionTag[]>([])

  // const suggestions = useMemo(
  //   () => {
  //     return columns.reduce(
  //       (acc, cur) => {
  //         if (cur) {
  //
  //         }
  //       }, []
  //     )
  //   }, [columns]
  // )

  const handleChange = (tag1: ISuggestionTag[]) => {
    const jobName = tag1.findIndex(
      (t: ISuggestionTag) => t && t?.filter === 'job_name'
    )
    const keyword = tag1.findIndex(
      (t: ISuggestionTag) => t && t?.filter === 'keyword'
    )
    if (keyword !== -1) {
      delete tag1[jobName]
      tag1.push({
        filter: 'job_name',
        value: tag1[keyword].value,
        valueLabel: tag1[keyword].value,
        filterLabel: '作业名称',
      })
      delete tag1[keyword]
    }
    setTags(tag1.filter(Boolean))
  }
  return (
    <FlexBox tw=" gap-2">
      <FilterInputWrapper>
        <FilterInput
          suggestions={dataReleaseSuggestions}
          tags={tags}
          onChange={handleChange}
          tw="border-line-dark!"
          placeholder="搜索关键字或输入过滤条件"
          // isMultiKeyword
          defaultKeywordLabel="作业名称或 ID"
        />
      </FilterInputWrapper>

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
