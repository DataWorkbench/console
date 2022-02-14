import React from 'react'
import { FlexBox, Center } from 'components'
import { Select } from '@QCFE/lego-ui'
import { InputSearch } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { InstanceTable } from '../Release/InstanceTable'
import { InstanceState } from '../constants'

const defaultQuery: {
  state: number
  instanceId: string
  jobId: string
  version: string
} = {
  state: 0,
  instanceId: '',
  jobId: '',
  version: '',
}

export const Job = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-13" orient="row">
        <FlexBox tw="ml-5">
          <Center>
            <div tw="text-white w-14">实例状态</div>
            <Select
              tw="w-[200px]"
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
              value={query.state}
            />
          </Center>
        </FlexBox>
        <FlexBox tw="ml-5">
          <Center>
            <div tw="text-white w-14">实例ID</div>
            <InputSearch
              tw="w-[200px]"
              placeholder="搜索实例ID"
              onPressEnter={(e: React.SyntheticEvent) => {
                setQuery((draft) => {
                  draft.instanceId = (e.target as HTMLInputElement).value
                })
              }}
              onClear={() => {
                setQuery((draft) => {
                  draft.instanceId = ''
                })
              }}
            />
          </Center>
        </FlexBox>
        <FlexBox tw="ml-5">
          <Center>
            <div tw="text-white w-14">作业ID</div>
            <InputSearch
              tw="w-[200px]"
              placeholder="搜索作业ID"
              onPressEnter={(e: React.SyntheticEvent) => {
                setQuery((draft) => {
                  draft.jobId = (e.target as HTMLInputElement).value
                })
              }}
              onClear={() => {
                setQuery((draft) => {
                  draft.jobId = ''
                })
              }}
            />
          </Center>
        </FlexBox>
        <FlexBox tw="ml-5">
          <Center>
            <div tw="text-white w-14">作业版本</div>
            <InputSearch
              tw="w-[200px]"
              placeholder="搜索作业版本"
              onPressEnter={(e: React.SyntheticEvent) => {
                setQuery((draft) => {
                  draft.version = (e.target as HTMLInputElement).value
                })
              }}
              onClear={() => {
                setQuery((draft) => {
                  draft.version = ''
                })
              }}
            />
          </Center>
        </FlexBox>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <InstanceTable tw="flex flex-1" query={query} modalData={{}} />
      </div>
    </div>
  )
}

export default Job
