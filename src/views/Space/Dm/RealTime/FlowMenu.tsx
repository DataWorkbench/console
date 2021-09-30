import { useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { Icon, Input, Loading } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import { useStore } from 'stores'
import { useQueryFlow } from 'hooks'

const FlowMenu = observer(() => {
  const { regionId, spaceId } = useParams<IUseParms>()
  const { isLoading, data } = useQueryFlow({ regionId, spaceId })
  const {
    workFlowStore,
    workFlowStore: { curFlow },
  } = useStore()
  const flows = data?.infos || []

  const handleItemClick = useCallback(
    (flow) => {
      workFlowStore.set({ curFlow: flow })
    },
    [workFlowStore]
  )

  const handleCreateClick = useCallback(() => {
    workFlowStore.set({ showFlowModal: true })
  }, [workFlowStore])

  return (
    <div tw="w-56 bg-neut-16 rounded dark:text-white">
      <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
        <span tw="text-xs font-semibold">业务流程</span>
        <div tw="flex items-center">
          <Icon name="add" type="light" />
          <Icon name="refresh" type="light" />
        </div>
      </div>
      <div tw="border-b dark:border-neut-15">
        <div tw="mt-3 px-2 flex items-center">
          <Input
            tw="dark:bg-neut-17 dark:text-white dark:border-neut-13 dark:hover:border-neut-13"
            type="text"
            placeholder="搜索任务关键词/创建人"
          />
          <Icon
            tw="ml-2 cursor-pointer"
            name="filter"
            changeable
            type="light"
          />
        </div>
        <div tw="mx-2 mt-3 bg-neut-17 p-2">
          <div tw="flex items-center justify-between border-b border-neut-13 pb-1">
            <span>👋️ 快速上手文档</span>
            <Icon name="close" type="light" />
          </div>
          <ul tw="pt-2">
            <li>
              <Icon name="file" tw="align-middle" />
              <span tw="align-middle text-neut-8">业务流程是什么？</span>
            </li>
            <li>
              <Icon name="file" tw="align-middle" />
              <span tw="align-middle text-neut-8">业务流程的操作指南</span>
            </li>
          </ul>
        </div>
        <div tw="text-center my-3">
          <button
            type="button"
            onClick={handleCreateClick}
            tw="py-1 rounded-sm w-48 bg-neut-13 focus:outline-none hover:bg-neut-10 ring-opacity-50"
          >
            <Icon name="add" type="light" tw="align-middle" />
            <span tw="align-middle">创建业务流程</span>
          </button>
        </div>
      </div>
      <div tw="pt-4">
        {(() => {
          if (isLoading) {
            return (
              <div tw="h-48">
                <Loading />
              </div>
            )
          }
          if (flows.length) {
            return flows.map((flow) => (
              <div
                key={flow.id}
                css={[
                  tw`leading-8 pl-3 cursor-pointer`,
                  curFlow && curFlow.id === flow.id
                    ? tw`bg-green-11`
                    : tw`hover:bg-neut-13`,
                ]}
                onClick={() => handleItemClick(flow)}
              >
                <Icon name="caret-right" type="light" tw="align-middle" />
                <span tw="ml-1">{flow.name}</span>
              </div>
            ))
          }
          return null
        })()}
      </div>
    </div>
  )
})

export default FlowMenu
