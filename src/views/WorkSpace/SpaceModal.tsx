import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css } from 'twin.macro'
import { Button, Input } from '@QCFE/lego-ui'
import { Icon, Table } from '@QCFE/qingcloud-portal-ui'
import { Modal, RouterLink } from 'components'
import { useQueryClient } from 'react-query'
import { useWorkSpaceContext } from 'contexts'
import { formatDate } from 'utils/convert'
import {
  getWorkSpaceKey,
  MutationWorkSpaceParams,
  useMutationWorkSpace,
} from 'hooks'
import SpaceEditModal from 'views/WorkSpace/SapceEditModal'

const columns = [
  {
    title: '空间名称/ID',
    width: 220,
    dataIndex: 'id',
    render: (field: string, row: any) => (
      <div tw="flex items-center w-full">
        <div tw="bg-neut-3 rounded-full p-1 flex items-center justify-center">
          <Icon name="project" size="small" />
        </div>
        <div tw="ml-2 overflow-hidden">
          <div tw="font-semibold truncate">{row.name}</div>
          <div tw="text-neut-8">{field}</div>
        </div>
      </div>
    ),
  },
  {
    title: '空间状态',
    width: 100,
    dataIndex: 'status',
    render: (field: number) => (
      <div
        css={[
          field === 1
            ? tw`bg-green-0 text-green-13`
            : tw`bg-[#FFFDED] text-[#A16207]`,
          tw`px-2 py-0.5 rounded-[20px] flex items-center`,
        ]}
      >
        <div
          css={[
            field === 1 ? tw`bg-green-1` : tw`bg-[#FFD127]`,
            tw`w-3 h-3 rounded-full flex items-center justify-center mr-1`,
          ]}
        >
          <div
            css={[
              field === 1 ? tw`bg-green-13` : tw`bg-[#A48A19]`,
              tw`w-1.5 h-1.5 rounded-full`,
            ]}
          />
        </div>
        {field === 1 ? '活跃' : '已禁用'}
      </div>
    ),
  },
  { title: '空间所有者', dataIndex: 'owner' },
  {
    title: '创建时间',
    dataIndex: 'created',
    render: (field: number) => formatDate(field),
  },
]

interface SpaceModalProps {
  onHide?: () => void

  [propName: string]: unknown
}

const SpaceModal = observer(({ region, onHide }: SpaceModalProps) => {
  const stateStore = useWorkSpaceContext()
  const [delBtnEnable, setDelBtnEnable] = useState(true)
  const { curSpaceOpt, optSpaces, cardView } = stateStore
  const curSpace = optSpaces.length ? optSpaces[0] : null
  const mutation = useMutationWorkSpace()
  const queryClient = useQueryClient()
  const regionId = (region as { id: string }).id
  const filterOptSpaces = optSpaces.filter((o: Record<string, any>) => {
    if (curSpaceOpt === 'enable' && o.status !== 2) {
      return false
    }
    if (curSpaceOpt === 'disable' && o.status !== 1) {
      return false
    }
    return true
  })
  const filterOptSpaceIds = filterOptSpaces.map(
    (o: Record<string, any>) => o.id
  )

  useEffect(() => {
    setDelBtnEnable(stateStore.curSpaceOpt !== 'delete')
  }, [stateStore.curSpaceOpt])

  const handleModalClose = () => {
    setDelBtnEnable(true)
    stateStore.set({ curSpaceOpt: '' })
    if (onHide) {
      onHide()
    }
  }

  const handleOk = (params?: MutationWorkSpaceParams) => {
    if (params) {
      mutation.mutate(params, {
        onSuccess: async () => {
          handleModalClose()
          // stateStore.set({ curSpaceOpt: '' })
          const queryKey = getWorkSpaceKey(cardView ? 'infinite' : 'page')
          await queryClient.invalidateQueries(queryKey)
          stateStore.set({ optSpaces: [] })
        },
      })
    }
  }

  const handleSubmit = () => {
    if (filterOptSpaceIds.length > 0) {
      const params = {
        regionId,
        op: curSpaceOpt,
        spaceIds: filterOptSpaceIds,
      }
      handleOk(params)
    } else {
      handleModalClose()
      // stateStore.set({ curSpaceOpt: '' })
    }
  }

  if (['enable', 'disable', 'delete'].includes(curSpaceOpt)) {
    const operateObj: any = {
      enable: {
        opName: '启动',
        desc: '是否确认启用工作空间？',
      },
      disable: {
        opName: '禁用',
        desc: (
          <>
            <div>
              <b>作业实例: </b>工作空间内正在运行的作业实例不会强制停止。
            </div>
            <div tw="mb-3">
              <b>计算集群: </b>
              不会自动停用计算集群（集群继续计费），若需要停用集群，需手动操作。前往
              <RouterLink
                to={`/${regionId}/workspace/${filterOptSpaceIds[0]}/dm/cluster`}
                color="blue"
              >
                计算集群
              </RouterLink>
            </div>
            <div>是否确认禁用工作空间？</div>
          </>
        ),
      },
      delete: {
        opName: '删除',
        desc: '该工作空间删除后无法恢复，请谨慎操作。',
      },
    }
    const { opName, desc } = operateObj[curSpaceOpt]
    return (
      <Modal
        visible
        noBorder
        width={filterOptSpaceIds.length > 1 ? 720 : 400}
        onCancel={handleModalClose}
        footer={
          <>
            <Button onClick={handleModalClose}>
              {window.getText('LEGO_UI_CANCEL')}
            </Button>
            <Button
              type={curSpaceOpt === 'enable' ? 'primary' : 'danger'}
              disabled={!delBtnEnable}
              loading={mutation.isLoading}
              onClick={handleSubmit}
            >
              {opName}
            </Button>
          </>
        }
      >
        <div tw="flex items-start">
          <Icon
            name={curSpaceOpt === 'enable' ? 'information' : 'if-error-info'}
            size={curSpaceOpt === 'enable' ? 24 : 'medium'}
            css={[
              tw`mr-3 text-2xl leading-6`,
              curSpaceOpt === 'enable'
                ? css`
                    svg {
                      ${tw`text-white fill-[#2193D3]`}
                    }
                  `
                : tw`text-red-10`,
            ]}
          />
          <div tw="flex-1 overflow-hidden">
            <div tw="font-semibold text-base text-neut-15 break-all">
              {filterOptSpaces.length === 1
                ? `${opName}工作空间 ${filterOptSpaces[0].name} `
                : `${opName}以下 ${filterOptSpaces.length} 个工作空间`}
            </div>
            <div tw="text-neut-13 mt-2">
              <div tw="mb-2">{desc}</div>
              {filterOptSpaces.length > 1 && (
                <div tw="space-y-3">
                  <Table
                    dataSource={filterOptSpaces}
                    columns={columns}
                    rowKey="id"
                  />
                </div>
              )}
              {curSpaceOpt === 'delete' && (
                <div tw="pt-6 space-y-1">
                  <div>
                    <span tw="text-red-10">*</span>
                    请在下方输入框中输入&quot;{filterOptSpaces[0].name}
                    &quot;以确认操作
                  </div>
                  <div>
                    <Input
                      autoComplete="off"
                      type="text"
                      tw="w-40"
                      placeholder={filterOptSpaces[0].name}
                      onChange={(e, value) =>
                        setDelBtnEnable(value === filterOptSpaces[0].name)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  if (['create', 'update'].includes(curSpaceOpt)) {
    return (
      <SpaceEditModal
        curSpaceOpt={curSpaceOpt as 'create'}
        curSpace={curSpace}
        region={region as Record<string, any>}
        onClose={handleModalClose}
        onOk={handleOk}
        confirmLoading={mutation.isLoading}
      />
    )
  }
  return null
})

export default SpaceModal
