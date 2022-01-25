import { InputSearch, Select } from '@QCFE/qingcloud-portal-ui'
import { FlexBox, Center } from 'components'
import { useImmer } from 'use-immer'
import { ReleaseTable } from './ReleaseTable'

const defaultQuery = {
  search: '',
  status: 0,
  job_id: '',
}

export const Release = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  const handleQueryChange = (key: string, value: string) => {
    setQuery({ ...query, [key]: value })
  }

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-13">
        <FlexBox tw="ml-6 pl-7">
          <Center>
            <div tw="text-white w-16">调度状态</div>
            <Select
              tw="w-[216px]"
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
          </Center>
        </FlexBox>
        <FlexBox tw="ml-6 pl-12">
          <Center>
            <div tw="text-white w-16">作业名称</div>
            <InputSearch
              tw="w-[216px]"
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
          </Center>
        </FlexBox>
        <FlexBox tw="ml-6 pl-12">
          <Center>
            <div tw="text-white w-16">作业 ID</div>
            <InputSearch
              tw="w-[216px]"
              placeholder="搜索作业 ID"
              onPressEnter={(e: React.SyntheticEvent) => {
                handleQueryChange(
                  'job_id',
                  (e.target as HTMLInputElement).value
                )
              }}
              onClear={() => {
                handleQueryChange('job_id', '')
              }}
            />
          </Center>
        </FlexBox>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <ReleaseTable tw="flex flex-1" query={query} />
      </div>
    </div>
  )
}

export default Release
