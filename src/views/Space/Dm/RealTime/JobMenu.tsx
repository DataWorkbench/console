import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Tooltip, Menu } from '@QCFE/lego-ui'
import { Icon, InputSearch, Loading, Modal } from '@QCFE/qingcloud-portal-ui'
import { motion } from 'framer-motion'
import tw, { css, styled, theme } from 'twin.macro'
import { flatten, get } from 'lodash-es'
import { useStore } from 'stores'
import { useQueryClient } from 'react-query'
import { useImmer } from 'use-immer'
import { useInfiniteQueryFlow, useMutationStreamJob, getFlowKey } from 'hooks'
import SimpleBar from 'simplebar-react'
import { FlexBox, Center, HelpCenterLink } from 'components'
import JobModal from './JobModal'

const { MenuItem } = Menu

const Tag = styled('div')(({ selected }: { selected?: boolean }) => [
  tw`border border-neut-13 rounded-sm leading-6 px-1 text-neut-8 scale-75 origin-left`,
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
  const [curCreateJobId, setCurCreateJobId] = useState(null)
  const [editJob, setEditJob] = useState(null)
  const [visible, setVisible] = useState(false)
  const [isOpenHelp, setIsOpenHelp] = useState(true)
  const [delVisible, setDelVisible] = useState(false)

  const [filter, setFilter] = useImmer({
    search: '',
    offset: 0,
    limit: 100,
    reverse: true,
  })

  const flowsRet = useInfiniteQueryFlow(filter)
  const queryClient = useQueryClient()
  const mutation = useMutationStreamJob()
  const {
    workFlowStore,
    workFlowStore: { curJob, curViewJobId, removePanel },
  } = useStore()
  const flows = flatten(flowsRet.data?.pages.map((page) => page.infos || []))

  if (flowsRet.isSuccess) {
    if (flowsRet.hasNextPage) {
      flowsRet.fetchNextPage()
    }
  }

  useEffect(() => {
    if (flows && curCreateJobId) {
      const curFlow = flows.find((flow) => flow.id === curCreateJobId)
      if (curFlow) {
        workFlowStore.set({ curJob: curFlow })
        setCurCreateJobId(null)
      }
    }
  }, [flows, curCreateJobId, workFlowStore])

  useEffect(() => {
    if (flows && curViewJobId) {
      const curFlow = flows.find((flow) => flow.id === curViewJobId)
      if (curFlow) {
        workFlowStore.set({ curJob: curFlow, curViewJobId: null })
      }
    }
  }, [flows, curViewJobId, workFlowStore])

  const handleItemClick = (job: any) => {
    if (workFlowStore.needSaveJob) {
      if (curJob) {
        workFlowStore.set({ nextJob: job })
        workFlowStore.needSave(job.id, 'switch')
      }
    } else {
      workFlowStore.set({ curJob: job })
    }
  }

  const showEditModal = (job) => {
    setVisible(true)
    setEditJob(job)
  }
  const hideCreateEditModal = (data: any) => {
    const jobId = get(data, 'id')
    if (jobId) {
      setCurCreateJobId(jobId)
    }
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
    <div tw="w-56 bg-neut-16 rounded dark:text-white flex flex-col">
      <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
        <span tw="text-xs font-semibold">作业</span>
        <div tw="flex items-center">
          <Icon
            name="add"
            type="light"
            clickable
            onClick={() => setVisible(true)}
          />
          {/* <Button
            onClick={refreshJobs}
            type="text"
            loading={flowsRet.isRefetching}
          >
          </Button> */}
          {/* <Icon
            name="refresh"
            type="light"
            color={{
              primary: theme('colors.white'),
              secondary: theme('colors.white'),
            }}
            clickable
            onClick={refreshJobs}
          /> */}
        </div>
      </div>
      <div tw="border-b dark:border-neut-15">
        <div tw="mt-3 px-2 flex items-center">
          <InputSearch
            tw="dark:bg-neut-17 dark:text-white dark:border-neut-13 dark:hover:border-neut-13"
            placeholder="搜索作业名称"
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
          {/* <Icon
            tw="ml-2 cursor-pointer"
            name="filter"
            changeable
            type="light"
          /> */}
        </div>
        <motion.div
          tw="mx-2 mt-3 bg-neut-17 p-2"
          animate={
            isOpenHelp
              ? {
                  opacity: 1,
                }
              : {
                  opacity: 0,
                  transitionEnd: {
                    display: 'none',
                  },
                }
          }
          exit={{ display: 'none' }}
        >
          <div tw="flex items-center justify-between border-b border-neut-13 pb-1">
            <span>👋️ 快速上手文档</span>
            <Icon
              name="close"
              type="light"
              onClick={() => setIsOpenHelp(false)}
              css={[
                tw`-mt-4 cursor-pointer`,
                css`
                  &:hover {
                    svg {
                      ${tw`text-white!`}
                    }
                  }
                `,
              ]}
              color={{
                primary: theme('colors.neut.8'),
              }}
            />
          </div>
          <ul tw="pt-2">
            <li>
              <HelpCenterLink href="/manual/data_development/job/summary/">
                作业是什么？
              </HelpCenterLink>
            </li>
            <li>
              <HelpCenterLink href="/manual/data_development/job/create_job_sql/">
                作业的操作指南
              </HelpCenterLink>
            </li>
          </ul>
        </motion.div>
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
      <div tw="pt-4 flex-1 h-full overflow-y-auto">
        <SimpleBar tw="h-full">
          {(() => {
            if (flowsRet.isLoading) {
              return (
                <div tw="h-48">
                  <Loading />
                </div>
              )
            }
            return (
              <>
                {flows?.map((flow: any) => (
                  <FlexBox
                    key={flow.id}
                    className="group"
                    css={[
                      tw`leading-8 px-2 cursor-pointer items-center justify-between`,
                      curJob?.id === flow.id
                        ? tw`bg-green-11`
                        : tw`hover:bg-neut-13`,
                    ]}
                    onClick={() => handleItemClick(flow)}
                    onMouseEnter={() => setAlterFlowId(flow.id)}
                    onMouseLeave={() => setAlterFlowId(null)}
                  >
                    <FlexBox tw="items-center">
                      {/* <Icon name="caret-right" type="light" /> */}
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
                      <span tw="-ml-0.5">{flow.name}</span>
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
                ))}
              </>
            )
          })()}
        </SimpleBar>
      </div>
      {visible && <JobModal job={editJob} onCancel={hideCreateEditModal} />}
      {delVisible && (
        <Modal
          visible
          title="删除"
          onCancel={hideDelModal}
          onOk={handleDel}
          confirmLoading={mutation.isLoading}
        >
          <>删除作业操作无法撤回，确认删除吗？</>
        </Modal>
      )}
    </div>
  )
})
export default JobMenu
