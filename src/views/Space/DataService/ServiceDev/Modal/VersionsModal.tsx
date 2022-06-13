import { DarkModal, FlexBox, ModalContent, TextLink } from 'components'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { useStore } from 'hooks'
import { Table } from 'views/Space/styled'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { useImmer } from 'use-immer'
import { MappingKey } from 'utils/types'
import {
  serviceDevVersionFieldMapping,
  serviceDevVersionColumns
} from 'views/Space//DataService/ServiceDev/constants'

const dataServiceVersionSettingKey = `DATA_SERVICE_VERSION_SETTING`

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-full`}
  `
])
export interface JobModalData {
  id: string
  pid: string
  type: number
  isEdit: boolean
  pNode?: Record<string, any>
}

export const JobModal = observer(() => {
  const [dataSource] = useImmer([
    {
      key: '1',
      apiName: 'work1_item',
      status: '222',
      versionId: 'yrl0o4601938kr9y',
      apiPath: '/v1.work1_item0129',
      createTime: '2020-03-11 22:22:20'
    },
    {
      key: '2',
      apiName: 'work1_item',
      status: '222',
      versionId: 'yrl0o4601938kr9y',
      apiPath: '/v1.work1_item0129',
      createTime: '2020-03-11 22:22:20'
    }
  ])
  const { dtsDevStore } = useStore()

  const getName = (name: MappingKey<typeof serviceDevVersionFieldMapping>) =>
    serviceDevVersionFieldMapping.get(name)!.apiField

  const {
    pagination,
    sort,
    getColumnSort: getSort
  } = useFilter<
    Record<ReturnType<typeof getName>, string | number | boolean>,
    { pagination: true; sort: true }
  >(
    {
      reverse: true,
      sort_by: getName('createTime')
    },
    { pagination: true, sort: true },
    dataServiceVersionSettingKey
  )

  const onClose = () => {
    dtsDevStore.set({ showVersions: false })
  }

  const renderColumns = {
    [getName('apiName')]: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    [getName('createTime')]: {
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    },
    [getName('createTime')]: {
      ...getSort(getName('createTime')),
      render: (text: string) => <FlexBox tw="items-center gap-2">{text}</FlexBox>
    }
  }

  const operations = {
    title: '操作',
    key: 'operation',
    render: () => (
      <FlexBox tw="gap-4">
        <TextLink tw="hover:text-green-11! text-white!" hasIcon={false}>
          查看详情
        </TextLink>
      </FlexBox>
    )
  }

  const { columns } = useColumns(
    dataServiceVersionSettingKey,
    serviceDevVersionColumns,
    renderColumns,
    operations
  )

  return (
    <DarkModal
      orient="fullright"
      visible
      title="历史版本"
      width={1024}
      onCancel={onClose}
      footer={null}
    >
      <ModalContent>
        <FormWrapper>
          <Table
            columns={columns}
            dataSource={dataSource || []}
            onSort={sort}
            rowKey="key"
            pagination={{
              total: 100,
              pageSize: 10,
              ...pagination
            }}
          />
        </FormWrapper>
      </ModalContent>
    </DarkModal>
  )
})

export default JobModal
