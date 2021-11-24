import { FlexBox } from 'components/Box'
import { InputSearch, Field, Label, Control, Select } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import { InstanceTable } from '../Release/InstanceTable'

const defaultQuery: {
  id: string
  status: undefined | number
} = {
  id: '',
  status: undefined,
}

export const Job = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-3 ">
        <Field className="is-horizontal" tw="mb-0!">
          <Label>作业流程</Label>
          <Control>
            <InputSearch
              placeholder="搜素业务流名称、ID"
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
              options={[
                { value: 1, label: '等待资源' },
                { value: 2, label: '进行中' },
                { value: 3, label: '运行成功' },
                { value: 4, label: '已终止' },
                { value: 5, label: '运行失败' },
                { value: 6, label: '已暂停' },
              ]}
              onChange={(value: number) => {
                setQuery((draft) => {
                  draft.status = value
                })
              }}
            />
          </Control>
        </Field>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <InstanceTable tw="flex flex-1" query={query} />
      </div>
    </div>
  )
}

export default Job
