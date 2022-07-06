import { Confirm } from 'components'
import tw, { css } from 'twin.macro'
import { observer } from 'mobx-react-lite'
import { Button } from '@QCFE/lego-ui'
import { useFetchApi, useMutationDeleteApiConfigs } from 'hooks'
import { get } from 'lodash-es'
import { ApiProps } from 'stores/DtsDevStore'
import { useStore } from 'stores'

export interface JobModalData {
  id: string
  pid: string
  type: number
  isApiGroup: boolean
  pNode?: Record<string, any>
}

interface CurrentGroupApiProps {
  name: string
  id: string
}

interface JobModalProps {
  isApiGroup?: boolean
  currentGroup?: CurrentGroupApiProps | undefined
  currentApi?: ApiProps | undefined
  onClose?: (data?: JobModalData) => void
}

export const JobModal = observer((props: JobModalProps) => {
  const { isApiGroup = false, currentGroup, currentApi, onClose } = props

  const fetchApi = useFetchApi()
  const mutation = useMutationDeleteApiConfigs()
  const {
    dtsDevStore: { treeData, setTreeData, removePanel }
  } = useStore()

  const removePanelList = (apiIds: string[]) => {
    apiIds.forEach((apiId) => {
      removePanel(apiId)
    })
  }

  const deleteApiConfig = (apiIds: string[]) =>
    new Promise((resolve, reject) => {
      mutation.mutate(
        {
          op: 'deleteApi',
          apiIds
        },
        {
          onSuccess: () => {
            const mapTree = treeData.map((api) => {
              const { children } = api
              if (children) {
                return {
                  ...api,
                  children: children.filter((child: { id: string }) => !apiIds.includes(child.id))
                }
              }
              return api
            })
            setTreeData(mapTree)
            onClose?.()
            removePanelList(apiIds)
            resolve(true)
          },
          onError: (err) => {
            reject(err)
          }
        }
      )
    })

  const deleteApiGroup = (groupIds: string[]) => {
    mutation.mutate(
      {
        op: 'deleteApiGroups',
        groupIds
      },
      {
        onSuccess: () => {
          setTreeData(treeData.filter((item) => !groupIds.includes(item.id)))
          onClose?.()
        }
      }
    )
  }

  const handleOK = () => {
    if (isApiGroup) {
      fetchApi({
        groupId: currentGroup?.id
      }).then(async (data) => {
        const apiList = get(data, 'infos', [])
        if (apiList?.length > 0) {
          // 存在api， 先删除api。 再删除组
          const res = await deleteApiConfig(apiList.map((item: { api_id: string }) => item.api_id))
          if (res === true && currentGroup?.id) {
            deleteApiGroup([currentGroup?.id])
          }
        } else if (currentGroup?.id) deleteApiGroup([currentGroup?.id])
      })
    } else if (currentApi) deleteApiConfig([currentApi.api_id])
  }

  return (
    <Confirm
      title={`删除API ${isApiGroup ? '服务组' : ':'} ${
        isApiGroup ? currentGroup?.name : currentApi?.api_name
      }(${isApiGroup ? currentGroup?.id : currentApi?.api_id})`}
      visible
      css={css`
        .modal-card-head {
          ${tw`border-0`}
        }
      `}
      type="warn"
      width={400}
      maskClosable={false}
      appendToBody
      draggable
      onCancel={onClose}
      footer={
        <div tw="flex justify-end space-x-2">
          <Button onClick={() => onClose?.()}>取消</Button>
          <Button type="danger" onClick={handleOK}>
            删除
          </Button>
        </div>
      }
    >
      <div>
        {isApiGroup
          ? `删除 API 服务组 ${currentGroup?.name} 以及组内包含的 API，同时下线组内所有已发布 API，请谨慎操作，删除后不可恢复。`
          : '如 API 已发布，删除的同时会下线 API，不可访问、测试，请谨慎操作，删除后不可恢复。'}
      </div>
    </Confirm>
  )
})

export default JobModal
