import { Button, Icon, Table, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { Center, Confirm, FlexBox, TextEllipsis } from 'components'
import { useQueryListRoutes, useMutationAbolishDataServiceApis } from 'hooks'

import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import tw, { css } from 'twin.macro'
import { MappingKey } from 'utils/types'
import { get } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { apiRoutersTableFieldMapping, apiRouterTableColumns } from '../constants'

interface AbolishApiModalProps {
  selectKey: string[]
  onCancel: () => void
}

const getName = (name: MappingKey<typeof apiRoutersTableFieldMapping>) =>
  apiRoutersTableFieldMapping.get(name)!.apiField

const columnSettingsKey = 'DATA_SERVICE_API_SERVICE_ABOLISH_API_TABLE'

const AbolishApiModal = (props: AbolishApiModalProps) => {
  const { selectKey, onCancel } = props

  const { spaceId } = useParams<{ spaceId: string }>()

  const { filter, pagination, sort } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, columnSettingsKey)

  const abolishMutation = useMutationAbolishDataServiceApis()
  const { isRefetching, data } = useQueryListRoutes({
    uri: { space_id: spaceId },
    params: { ids: selectKey, ...filter } as any
  })

  const handleCancel = () => {
    onCancel()
  }

  const abolishApi = (apiIds: string[]) => {
    abolishMutation.mutate(apiIds, {
      onSuccess: (res) => {
        if (res.ret_code === 0) {
          Notify.success({
            title: '操作提示',
            content: 'API 下线成功',
            placement: 'bottomRight'
          })
          handleCancel()
        }
      }
    })
  }

  const handleConfirmOK = () => {
    abolishApi(selectKey)
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <FlexBox tw="items-center space-x-1 truncate">
          <Center
            className="clusterIcon"
            tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
          >
            <Icon name="q-dockerHubDuotone" type="light" />
          </Center>
          <div tw="truncate">
            <TextEllipsis twStyle={tw`font-semibold`}>{row.name}</TextEllipsis>
            <div tw="dark:text-neut-8">{row.id}</div>
          </div>
        </FlexBox>
      )
    }
  }

  const tableColumns = apiRouterTableColumns.filter(
    (item) => !['proxy_uri', 'create_time'].includes(item.dataIndex as string)
  )
  const { columns } = useColumns(columnSettingsKey, tableColumns, columnsRender)

  const dataSource = get(data, 'entities') || []

  return (
    <Confirm
      title={`${
        selectKey.length === 1
          ? `下线 API:${selectKey[0]}(ID)`
          : `下线以下${selectKey.length}个 API 注意事项`
      }`}
      visible
      css={css`
        .modal-card-head {
          ${tw`border-0`}
        }
        .css-1pd8ijf-Confirm {
          ${tw`m-0`}
        }
      `}
      type="warn"
      width={selectKey.length === 1 ? 400 : 800}
      maskClosable={false}
      appendToBody
      draggable
      onCancel={handleCancel}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={() => handleCancel()}>取消</Button>
          <Button type="danger" onClick={handleConfirmOK}>
            下线
          </Button>
        </div>
      }
    >
      <div>
        <div tw="mb-3">
          {selectKey.length === 1
            ? `下线后， API将不可调用， 确认下线API ${selectKey[0]}`
            : `下线后，与以下 ${
                get(dataSource, 'entities', [])?.length
              } 个 API 将不可调用。确认下线？`}
        </div>
        {selectKey.length > 1 && (
          <Table
            dataSource={dataSource}
            loading={isRefetching}
            columns={columns}
            rowKey="id"
            pagination={{
              total: get(data, 'total', 0),
              ...pagination
            }}
            onSort={sort}
          />
        )}
      </div>
    </Confirm>
  )
}

export default AbolishApiModal
