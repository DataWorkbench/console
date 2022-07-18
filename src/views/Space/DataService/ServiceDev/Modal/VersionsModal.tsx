import { DarkModal, FlexBox, ModalContent, TextLink, StatusBar } from 'components'
import tw, { css, styled } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import {
  ListDataServiceApiVersions,
  getListDataServiceApiVersions,
  useStore,
  useMutationRepublishDataServiceApi,
  useMutationListRoutes
} from 'hooks'
import { Table } from 'views/Space/styled'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import { MappingKey } from 'utils/types'

import {
  serviceDevVersionFieldMapping,
  serviceDevVersionColumns,
  publishStatus
} from 'views/Space//DataService/ServiceDev/constants'
import { useParams } from 'react-router-dom'
import { get, omitBy } from 'lodash-es'
import { formatDate } from 'utils'
import { useQueryClient } from 'react-query'
import { useState } from 'react'
import { TestModal } from '../../ApiSuper/ApiRouters/TestModal'

const dataServiceVersionSettingKey = `DATA_SERVICE_VERSION_SETTING`

const FormWrapper = styled('div')(() => [
  css`
    ${tw`w-full`}
  `
])

const VersionsModal = observer(() => {
  const { spaceId } = useParams<{ spaceId: string }>()
  const [showTestModal, setShowTestModal] = useState(false)
  const [currentRow, setCurrentRow] = useState()
  const {
    dtsDevStore,
    dtsDevStore: { curApi }
  } = useStore()
  const queryClient = useQueryClient()
  const routesMutation = useMutationListRoutes()
  const mutation = useMutationRepublishDataServiceApi()

  const getName = (name: MappingKey<typeof serviceDevVersionFieldMapping>) =>
    serviceDevVersionFieldMapping.get(name)!.apiField

  const {
    filter,
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
  // 刷新
  const refetchData = () => {
    queryClient.invalidateQueries(getListDataServiceApiVersions())
  }
  // 关闭
  const onClose = () => {
    dtsDevStore.set({ showVersions: false })
  }

  const { data } = ListDataServiceApiVersions(
    {
      uri: { space_id: spaceId, api_id: curApi!.api_id },
      params: omitBy(filter, (v) => v === '')
    },
    { enabled: !!curApi!.api_id }
  )

  const republish = (row: any) => {
    const params = {
      apiId: row.api_id,
      verId: row.version_id
    }
    mutation.mutate(params, {
      onSuccess: () => {
        refetchData()
      }
    })
  }

  const toDetail = (row: any | undefined) => {
    const key =
      row?.publish_status === publishStatus.ABOLISHED
        ? `${row?.api_id}_${row?.version_id}`
        : row.api_id
    const VerApi = {
      key, // key 和 api_id 是panel 的唯一标识， 区分当前版本和历史版本
      api_id: row?.api_id,
      api_name: row?.api_name,
      api_mode: row?.api_mode,
      api_path: row?.api_path,
      space_id: row?.space_id,
      status: row?.status,
      group_id: row?.group_id,
      version_id: row?.version_id, // 历史版本号
      is_history: row?.publish_status === publishStatus.ABOLISHED
    }

    dtsDevStore.set({
      curApi: VerApi
    })
    dtsDevStore.addPanel({ ...VerApi })
    onClose()
  }

  const handelTestModal = (row: any | undefined) => {
    const rowData = {
      apiVersionId: row?.group_id,
      apiServiceId: row?.version_id
    }
    routesMutation.mutate(rowData, {
      onSuccess: (res) => {
        const testRow = get(res, 'entities[0]')
        setCurrentRow(testRow)
        setShowTestModal(true)
      }
    })
  }

  const renderColumns = {
    [getName('status')]: {
      render: (v: string) => (
        <StatusBar
          type={publishStatus.getEnum(publishStatus.getLabel(v) as string)?.style}
          label={publishStatus.getEnum(publishStatus.getLabel(v) as string)?.label}
          isWrapper={false}
        />
      )
    },
    [getName('createTime')]: {
      ...getSort(getName('createTime')),
      render: (text: number) => <FlexBox tw="items-center gap-2">{formatDate(text)}</FlexBox>
    }
  }

  const operations = {
    title: '操作',
    key: 'operation',
    render: (_: any, row: any) => (
      <FlexBox tw="gap-4">
        <TextLink
          tw="hover:text-green-11! text-white!"
          hasIcon={false}
          onClick={() => toDetail(row)}
        >
          查看详情
        </TextLink>
        {row.publish_status === publishStatus.PUBLISHED ? (
          <TextLink
            tw="hover:text-green-11! text-white!"
            hasIcon={false}
            onClick={() => handelTestModal(row)}
          >
            测试
          </TextLink>
        ) : (
          <TextLink
            tw="hover:text-green-11! text-white!"
            hasIcon={false}
            onClick={() => {
              republish(row)
            }}
          >
            重新发布
          </TextLink>
        )}
      </FlexBox>
    )
  }

  const infos = get(data, 'infos', []) || []

  const { columns } = useColumns(
    dataServiceVersionSettingKey,
    serviceDevVersionColumns,
    renderColumns,
    operations
  )

  return (
    <>
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
              dataSource={infos}
              onSort={sort}
              rowKey="version_id"
              pagination={{
                total: get(data, 'total', 0),
                ...pagination
              }}
            />
          </FormWrapper>
        </ModalContent>
      </DarkModal>
      {showTestModal && (
        <TestModal currentRow={currentRow} onCancel={() => setShowTestModal(false)} />
      )}
    </>
  )
})

export default VersionsModal
