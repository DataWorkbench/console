import { InputSearch, Field, Label, Control, Select } from '@QCFE/lego-ui'
import { FlexBox, Center } from 'components'
import { useImmer } from 'use-immer'
import { ReleaseTable } from './ReleaseTable'

const defaultQuery = {
  search: '',
  status: 0,
}

export const Release = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  const handleQueryChange = (key: string, value: string) => {
    setQuery({ ...query, [key]: value })
  }

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-13 ">
        <Center>
          <Field className="is-horizontal">
            <Label>调度状态</Label>
            <Control>
              <Select
                placeholder="请选择"
                options={[
                  { value: 0, label: '全部' },
                  { value: 1, label: '调度中' },
                  { value: 2, label: '已暂停' },
                ]}
                onChange={(value) => {
                  handleQueryChange('status', value)
                }}
                value={query.status}
              />
            </Control>
          </Field>
        </Center>
        <Center>
          <Field className="is-horizontal" tw="mb-0!">
            <Label>作业名称</Label>
            <Control>
              <InputSearch
                placeholder="搜索作业名称"
                onPressEnter={(e: React.SyntheticEvent) => {
                  handleQueryChange(
                    'search',
                    (e.target as HTMLInputElement).value
                  )
                }}
                onClear={() => {
                  handleQueryChange('search', '')
                }}
              />
            </Control>
          </Field>
        </Center>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <ReleaseTable tw="flex flex-1" query={query} />
      </div>
    </div>
  )
}

export default Release
