import { FlexBox } from 'components/Box'
import { InputSearch, Field, Label, Control, Select } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import { InstanceTable } from '../Release/InstanceTable'
import { InstanceState } from '../constants'

const defaultQuery: {
  id: string
  state: number
} = {
  id: '',
  state: 0,
}

export const Job = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-3 ">
        <Field className="is-horizontal" tw="mb-0!">
          <Label>作业</Label>
          <Control>
            <InputSearch
              placeholder="搜索作业名称、ID"
              onPressEnter={(e: React.SyntheticEvent) => {
                setQuery((draft) => {
                  draft.id = (e.target as HTMLInputElement).value
                })
              }}
              onClear={() => {
                setQuery((draft) => {
                  draft.id = ''
                })
              }}
            />
          </Control>
        </Field>
        <Field className="is-horizontal">
          <Label>实例状态</Label>
          <Control>
            <Select
              placeholder="请选择"
              options={Object.keys(InstanceState).map((el) => ({
                value: Number(el),
                label: InstanceState[el].name,
              }))}
              onChange={(value: number) => {
                setQuery((draft) => {
                  draft.state = value
                })
              }}
            />
          </Control>
        </Field>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <InstanceTable tw="flex flex-1" query={query} modalData={{}} />
      </div>
    </div>
  )
}

export default Job
