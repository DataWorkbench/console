import { Button, Icon, Loading, Table } from '@QCFE/qingcloud-portal-ui'
import { Center, Confirm, FlexBox, TextEllipsis } from 'components'
import {
  useMutationDataServiceCluster,
  useMutationAbolishDataServiceApis,
  useQueryListPublishedApiVersionsByClusterId
} from 'hooks'
import { useColumns } from 'hooks/useHooks/useColumns'
import tw, { css } from 'twin.macro'
import { MappingKey } from 'utils/types'
import { useState } from 'react'
import { get, omitBy } from 'lodash-es'
import { ClusterListInfo, getQueryKeyListDataServiceClusters } from 'hooks/useDataService'
import useFilter from 'hooks/useHooks/useFilter'
import { useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { StopClusterTableFieldMapping, StopClusterTableColumns } from './constants'

interface UnBindApiModalProps {
  cluster: ClusterListInfo
  onCancel: () => void
}

const getName = (name: MappingKey<typeof StopClusterTableFieldMapping>) =>
  StopClusterTableFieldMapping.get(name)!.apiField

const columnSettingsKey = 'DATA_SERVICE_STOP_CLUSTER_TAB'

const UnBindApiModal = (props: UnBindApiModalProps) => {
  const { cluster, onCancel } = props

  const { spaceId } = useParams<{ spaceId: string }>()
  const [showStopApiConfirm, setStopApiConfirm] = useState<boolean>(false)

  const { filter, pagination } = useFilter<
    Record<ReturnType<typeof getName>, number | string | boolean>,
    { pagination: true; sort: true }
  >({}, { pagination: true, sort: true }, columnSettingsKey)

  const clusterMutation = useMutationDataServiceCluster()
  const serviceApisMutation = useMutationAbolishDataServiceApis()
  const { data, isLoading } = useQueryListPublishedApiVersionsByClusterId({
    uri: { space_id: spaceId, cluster_id: cluster.id },
    params: omitBy(filter, (v) => v === '')
  })

  const publishApi = get(data, 'infos', []) || []

  const queryClient = useQueryClient()

  const handleCancel = () => {
    onCancel()
  }

  /**
   * 停用服务集群
   */
  const stopCluster = () => {
    const params = {
      op: 'stop' as OP,
      clusterId: cluster.id
    }
    clusterMutation.mutate(params, {
      onSuccess: () => {
        queryClient.invalidateQueries(getQueryKeyListDataServiceClusters())
        handleCancel()
      }
    })
  }

  /**
   * 停用服务集群下所以api
   */
  const shopApiServerConfirmOk = () => {
    const apiIds: string[] = publishApi?.map((item: { api_id: string }) => item.api_id) as string[]
    serviceApisMutation.mutate(apiIds, {
      onSuccess: () => {
        stopCluster()
        setStopApiConfirm(false)
      }
    })
  }

  const handleConfirmOK = () => {
    if (publishApi?.length) {
      setStopApiConfirm(true)
      return
    }
    stopCluster()
  }

  const columnsRender = {
    [getName('name')]: {
      render: (v: any, row: any) => (
        <FlexBox tw="items-center space-x-1 truncate">
          <Center
            className="clusterIcon"
            tw="bg-neut-13 border-2 box-content border-neut-16 rounded-full w-6 h-6 mr-1.5"
          >
            <Icon name="q-dockerHubDuotone2" type="light" />
          </Center>
          <div tw="truncate">
            <TextEllipsis twStyle={tw`font-semibold`}>{row.api_name}</TextEllipsis>
            <div tw="dark:text-neut-8">{row.api_id}</div>
          </div>
        </FlexBox>
      )
    }
  }

  const { columns } = useColumns(columnSettingsKey, StopClusterTableColumns, columnsRender)

  return (
    <>
      <Confirm
        title={`${
          cluster.id ? `停用服务集群${cluster.name}（${cluster.id}）` : '停用服务集群注意事项'
        }`}
        visible={!isLoading}
        css={css`
          .modal-card-head {
            ${tw`border-0`}
          }
          .css-1pd8ijf-Confirm {
            ${tw`m-0`}
          }
        `}
        type="warn"
        width={publishApi?.length === 0 ? 400 : 1000}
        maskClosable={false}
        appendToBody
        draggable
        onCancel={handleCancel}
        footer={
          <div tw="flex justify-end space-x-2">
            <Button onClick={() => handleCancel()}>取消</Button>
            <Button type="danger" onClick={handleConfirmOK} loading={clusterMutation.isLoading}>
              {publishApi?.length === 0 ? '停用' : '全部下线并停用集群'}
            </Button>
          </div>
        }
      >
        <div>
          <div tw="mb-3">
            {publishApi && publishApi?.length > 0
              ? `当前集群存在以下已发布 API ，如需停用服务集群，将以下已发布 API 下线，否则以下 API 将不能测试、访问，请谨慎操作。`
              : `确认停用服务集群${cluster.name}（${cluster.id}）?`}
          </div>
          {publishApi && publishApi?.length > 0 && (
            <Table
              tw="mt-6"
              dataSource={publishApi}
              columns={columns}
              pagination={{
                total: get(data, 'total', 0),
                ...pagination
              }}
              rowKey="api_id"
            />
          )}
        </div>
      </Confirm>
      {showStopApiConfirm && (
        <Confirm
          title="确认下线所有 API 并停用服务集群？"
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
          width={cluster.id ? 400 : 800}
          maskClosable={false}
          appendToBody
          draggable
          onCancel={() => setStopApiConfirm(false)}
          footer={
            <div tw="flex justify-end space-x-2">
              <Button
                onClick={() => setStopApiConfirm(false)}
                disabled={serviceApisMutation.isLoading}
              >
                取消
              </Button>
              <Button
                type="danger"
                onClick={shopApiServerConfirmOk}
                disabled={serviceApisMutation.isLoading}
              >
                {serviceApisMutation.isLoading ? (
                  <div tw="flex items-center">
                    <Loading size={16} tw="h-4 w-4 mr-1" />
                    停用中
                  </div>
                ) : (
                  '全部下线并停用集群'
                )}
              </Button>
            </div>
          }
        >
          <div tw=" mt-3">API 下线后不可访问，请谨慎操作。</div>
        </Confirm>
      )}
    </>
  )
}

export default UnBindApiModal
