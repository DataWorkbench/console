import { useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { Tooltip, Modal, Menu } from '@QCFE/lego-ui'
import { Icon, InputSearch, Loading, Button } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import { useStore } from 'stores'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { useQueryFlow, useMutationStreamJob, getFlowKey } from 'hooks'
import { FlexBox, Center } from 'components'
import JobModal from './JobModal'

const { MenuItem } = Menu

const Tag = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`border border-neut-13 rounded-sm leading-6 px-1 text-neut-8 scale-75`,
  tw`group-hover:(bg-white text-neut-13 border-white)`,
  selected && tw`bg-white text-neut-13 border-white`,
])

const TooltipWrapper = styled(Tooltip)(() => [
  tw`bg-neut-17 border! border-solid border-neut-13 p-0`,
  css`
    & > .tooltip-arrow {
      ${tw`hidden`}
    }
    .menu {
      ${tw`bg-neut-17 rounded-none py-1`}
      .menu-item {
        ${tw`text-white text-xs`}
        &:hover {
          ${tw`bg-neut-13`}
        }
      }
    }
  `,
])

const JobMenu = observer(() => {
  const [alterFlowId, setAlterFlowId] = useState(null)
  const [editJob, setEditJob] = useState(null)
  const [visible, setVisible] = useState(false)
  const [delVisible, setDelVisible] = useState(false)
  const [filter, setFilter] = useImmer({
    search: '',
    offset: 0,
    limit: 100,
    reverse: false,
  })
  const { isLoading, isRefetching, data } = useQueryFlow(filter)
  const queryClient = useQueryClient()
  const mutation = useMutationStreamJob()
  const {
    workFlowStore,
    workFlowStore: { curJob, removePanel },
  } = useStore()
  const flows = data?.infos || []

  const handleItemClick = useCallback(
    (flow) => {
      workFlowStore.set({ curJob: flow })
    },
    [workFlowStore]
  )

  const showEditModal = (job) => {
    setVisible(true)
    setEditJob(job)
  }
  const hideEditModal = () => {
    setVisible(false)
    setEditJob(null)
  }

  const showDelModal = (job) => {
    setDelVisible(true)
    setEditJob(job)
  }

  const hideDelModal = () => {
    setDelVisible(false)
    setEditJob(null)
  }

  const refreshJobs = () => {
    queryClient.invalidateQueries(getFlowKey())
  }

  const handleDel = () => {
    if (editJob) {
      mutation.mutate(
        {
          op: 'delete',
          job_ids: [editJob.id],
        },
        {
          onSuccess: () => {
            hideDelModal()
            refreshJobs()
            removePanel(editJob.id)
          },
        }
      )
    }
  }

  return (
    <div tw="w-56 bg-neut-16 rounded dark:text-white">
      <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
        <span tw="text-xs font-semibold">作业</span>
        <div tw="flex items-center">
          <Icon
            name="add"
            type="light"
            clickable
            onClick={() => setVisible(true)}
          />
          <Button onClick={refreshJobs} type="text" loading={isRefetching}>
            <Icon name="refresh" type="light" />
          </Button>
        </div>
      </div>
      <div tw="border-b dark:border-neut-15">
        <div tw="mt-3 px-2 flex items-center">
          <InputSearch
            tw="dark:bg-neut-17 dark:text-white dark:border-neut-13 dark:hover:border-neut-13"
            placeholder="搜索任务关键词/创建人"
            onPressEnter={(evt) => {
              setFilter((draft) => {
                draft.search = String((evt.target as HTMLInputElement).value)
              })
            }}
            onClear={() => {
              setFilter((draft) => {
                draft.search = ''
              })
            }}
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
              <span tw="align-middle text-neut-8">作业是什么？</span>
            </li>
            <li>
              <Icon name="file" tw="align-middle" />
              <span tw="align-middle text-neut-8">作业的操作指南</span>
            </li>
          </ul>
        </div>
        <div tw="text-center my-3">
          <button
            type="button"
            onClick={() => {
              setVisible(true)
            }}
            tw="py-1 rounded-sm w-48 bg-neut-13 focus:outline-none hover:bg-neut-10 ring-opacity-50"
          >
            <Icon name="add" type="light" tw="align-middle" />
            <span tw="align-middle">创建作业</span>
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
          return flows?.map((flow: any) => (
            <FlexBox
              key={flow.id}
              className="group"
              css={[
                tw`leading-8 px-2 cursor-pointer items-center justify-between`,
                curJob?.id === flow.id ? tw`bg-green-11` : tw`hover:bg-neut-13`,
              ]}
              onClick={() => handleItemClick(flow)}
              onMouseEnter={() => setAlterFlowId(flow.id)}
              onMouseLeave={() => setAlterFlowId(null)}
            >
              <FlexBox tw="items-center">
                <Icon name="caret-right" type="light" />
                <Tag selected={curJob?.id === flow.id}>
                  {(() => {
                    switch (flow.type) {
                      case 1:
                        return '算子'
                      case 2:
                        return 'Sql'
                      case 3:
                        return 'Jar'
                      case 4:
                        return 'Python'
                      case 5:
                        return 'Scala'
                      default:
                        return ''
                    }
                  })()}
                </Tag>
                <span tw="ml-1">{flow.name}</span>
              </FlexBox>
              {alterFlowId === flow.id && (
                <TooltipWrapper
                  content={
                    <Menu
                      onClick={(e: any, key: string) => {
                        if (key === 'edit') {
                          showEditModal(flow)
                        } else {
                          showDelModal(flow)
                        }
                      }}
                    >
                      <MenuItem key="edit">
                        <Icon name="pen" tw="mr-2" />
                        编辑信息
                      </MenuItem>
                      <MenuItem key="delete">
                        <Icon name="trash" tw="mr-2" />
                        删除
                      </MenuItem>
                    </Menu>
                  }
                  placement="rightTop"
                  trigger="hover"
                >
                  <Center>
                    <Icon name="more" type="light" />
                  </Center>
                </TooltipWrapper>
              )}
            </FlexBox>
          ))
        })()}
      </div>
      {visible && <JobModal job={editJob} onCancel={hideEditModal} />}
      {delVisible && (
        <Modal
          visible
          title="删除"
          onCancel={hideDelModal}
          onOk={handleDel}
          confirmLoading={mutation.isLoading}
        >
          确定要删除Job: {editJob?.name}
        </Modal>
      )}
    </div>
  )
})
export default JobMenu
