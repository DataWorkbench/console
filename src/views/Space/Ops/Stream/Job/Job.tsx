import React from 'react'
import { FlexBox, Center } from 'components'
import { InputSearch, Field, Label, Control, Select } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import { InstanceTable } from '../Release/InstanceTable'
import { InstanceState } from '../constants'

const defaultQuery: {
  state: number
  jobId: string
  version: string
} = {
  state: 0,
  jobId: '',
  version: '',
}

export const Job = () => {
  const [query, setQuery] = useImmer(defaultQuery)

  return (
    <div tw="p-5">
      <FlexBox tw="py-6 bg-neut-16 border-b border-neut-13" orient="row">
        <Center>
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
                value={query.state}
              />
            </Control>
          </Field>
        </Center>
        <Center>
          <Field className="is-horizontal">
            <Label>作业ID</Label>
            <Control>
              <InputSearch
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
            </Control>
          </Field>
        </Center>
        <Center>
          <Field className="is-horizontal">
            <Label>作业版本</Label>
            <Control>
              <InputSearch
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
            </Control>
          </Field>
        </Center>
      </FlexBox>
      <div tw="px-5 pb-5 bg-neut-16">
        <InstanceTable tw="flex flex-1" query={query} modalData={{}} />
      </div>
    </div>
  )
}

export default Job
