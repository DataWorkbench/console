import { Button, Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { Center, Confirm, FlexBox, TextEllipsis } from 'components'
import { useMutationListApiServices, useMutationAuthKey } from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import useFilter from 'hooks/useHooks/useFilter'
import tw, { css } from 'twin.macro'
import { MappingKey } from 'utils/types'
import { useState } from 'react'
import { get } from 'lodash-es'
import { useMount } from 'react-use'
import { unbindApiTableFieldMapping, unbindApiTableColumns } from '../../constants'

interface UnBindApiModalProps {
  selectKey: string[]
  onCancel: () => void
}

const getName = (name: MappingKey<typeof unbindApiTableFieldMapping>) =>
  unbindApiTableFieldMapping.get(name)!.apiField

const columnSettingsKey = 'DATA_SERVICE_API_SERVICE'

const UnBindApiModal = (props: UnBindApiModalProps) => {
  const { selectKey, onCancel } = props

  const [dataSource, setSourceData] = useState()

  const { filter, pagination, sort } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, columnSettingsKey)

  const mutation = useMutationListApiServices()
  const authMutation = useMutationAuthKey()

  useMount(() => {
    if (selectKey.length > 1) {
      mutation.mutate(
        { auth_key_id: selectKey, ...filter },
        {
          onSuccess: (source) => {
            setSourceData(source)
          }
        }
      )
    }
  })

  const handleCancel = () => {
    onCancel()
  }

  const handleConfirmOK = () => {
    const paramsData = {
      option: 'unbind' as any,
      auth_key_id: '',
      api_service_ids: selectKey
    }
    authMutation.mutate(paramsData, {
      onSuccess: () => {
        handleCancel()
      }
    })
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

  const { columns } = useColumns(columnSettingsKey, unbindApiTableColumns, columnsRender)

  return (
    <Confirm
      title={`${
        selectKey.length === 1 ? `解绑 API 服务组:${selectKey[0]}(ID)` : '解绑 API 服务组注意事项'
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
            解绑
          </Button>
        </div>
      }
    >
      <div>
        <div tw=" mt-3 ml-9 mb-3">
          {selectKey.length === 1
            ? `与解绑 API 服务组后，密钥将不在限制访问，请谨慎操作。确认解绑API 服务组 ${selectKey[0]}`
            : `与以下 ${
                get(dataSource, 'entities', [])?.length
              } 个 API 服务组解绑后，密钥将不在限制访问，请谨慎操作。确认解绑以下 API 服务组?`}
        </div>
        {selectKey.length > 1 && (
          <Table
            dataSource={get(dataSource, 'entities', [])}
            loading={false}
            columns={columns}
            rowKey="id"
            pagination={{
              total: get(dataSource, 'total', 0),
              ...pagination
            }}
            onSort={sort}
          />
        )}
      </div>
    </Confirm>
  )
}

export default UnBindApiModal
