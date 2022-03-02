import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Input, Button } from '@QCFE/lego-ui'
import { Icon, InputSearch, Modal } from '@QCFE/qingcloud-portal-ui'
import { motion } from 'framer-motion'
import tw, { css, styled, theme } from 'twin.macro'
import { get } from 'lodash-es'
import { useStore } from 'stores'
import { useQueryClient } from 'react-query'
// import { useImmer } from 'use-immer'
import { useMutationStreamJob, getFlowKey } from 'hooks'
import SimpleBar from 'simplebar-react'
import { Rnd } from 'react-rnd'
import { HelpCenterLink } from 'components'
import JobModal from './JobModal'
import { JobTree } from './JobTree'

const ModalWrapper = styled(Modal)(() => [
  css`
    .modal-card-head {
      border-bottom: 0;
    }
    .modal-card-body {
      ${tw`pt-0 pb-4`}
    }
    .modal-card-foot {
      border-top: 0;
      ${tw`pb-4`}
    }
  `,
])

// const Tag = styled('div')(({ selected }: { selected?: boolean }) => [
//   tw`border border-neut-13 rounded-sm leading-5 px-1.5 text-neut-8 scale-75 origin-left`,
//   tw`group-hover:(bg-white text-neut-13 border-white)`,
//   selected && tw`bg-white text-neut-13 border-white`,
// ])

// const TooltipWrapper = styled(Tooltip)(() => [
//   tw`bg-neut-17 border! border-solid border-neut-13 p-0`,
//   css`
//     & > .tooltip-arrow {
//       ${tw`hidden`}
//     }
//     .menu {
//       ${tw`bg-neut-17 rounded-none py-1`}
//       .menu-item {
//         ${tw`text-white text-xs`}
//         &:hover {
//           ${tw`bg-neut-13`}
//         }
//       }
//     }
//   `,
// ])

interface JobMenuProps {
  className?: string
}

const JobMenu = observer((props: JobMenuProps) => {
  // const [alterFlowId, setAlterFlowId] = useState(null)
  // const [curCreateJobId, setCurCreateJobId] = useState(null)
  const [editJob, setEditJob] = useState<Record<string, any> | null>(null)
  const [visible, setVisible] = useState(false)
  const [isOpenHelp, setIsOpenHelp] = useState(true)
  const [delVisible, setDelVisible] = useState(false)
  const [delBtnEnable, setDelBtnEnable] = useState(false)

  // const [filter, setFilter] = useImmer({
  //   search: '',
  //   offset: 0,
  //   limit: 100,
  //   reverse: true,
  // })

  // const flowsRet = useInfiniteQueryFlow(filter)
  const queryClient = useQueryClient()
  const mutation = useMutationStreamJob()
  const {
    // workFlowStore,curJob, curViewJobId,
    workFlowStore: { removePanel },
  } = useStore()
  // const flows = []
  // const flows = flatten(flowsRet.data?.pages.map((page) => page.infos || []))

  // if (flowsRet.isSuccess) {
  //   if (flowsRet.hasNextPage) {
  //     flowsRet.fetchNextPage()
  //   }
  // }

  // useEffect(() => {
  //   if (flows && curCreateJobId) {
  //     const curFlow = flows.find((flow) => flow.id === curCreateJobId)
  //     if (curFlow) {
  //       workFlowStore.set({ curJob: curFlow })
  //       setCurCreateJobId(null)
  //     }
  //   }
  // }, [flows, curCreateJobId, workFlowStore])

  // useEffect(() => {
  //   if (flows && curViewJobId) {
  //     const curFlow = flows.find((flow) => flow.id === curViewJobId)
  //     if (curFlow) {
  //       workFlowStore.set({ curJob: curFlow, curViewJobId: null })
  //     }
  //   }
  // }, [flows, curViewJobId, workFlowStore])

  // const handleItemClick = (job: any) => {
  //   if (workFlowStore.isDirty) {
  //     if (curJob) {
  //       workFlowStore.set({ nextJob: job })
  //       workFlowStore.showSaveConfirm(job.id, 'switch')
  //     }
  //   } else {
  //     workFlowStore.set({ curJob: job })
  //   }
  // }

  // const showEditModal = (job) => {
  //   setVisible(true)
  //   setEditJob(job)
  // }
  const hideCreateEditModal = (data: any) => {
    const jobId = get(data, 'id')
    if (jobId) {
      setCurCreateJobId(jobId)
    }
    setVisible(false)
    setEditJob(null)
  }

  // const showDelModal = (job) => {
  //   setDelVisible(true)
  //   setEditJob(job)
  // }

  const hideDelModal = () => {
    setDelVisible(false)
    setEditJob(null)
    setDelBtnEnable(false)
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
    <Rnd
      tw="w-56 bg-neut-16 rounded dark:text-white"
      disableDragging
      className={props.className}
      minWidth={224}
      maxWidth={480}
      enableResizing={{
        right: true,
      }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div tw="flex justify-between items-center h-11 px-2 border-b dark:border-neut-15">
        <span tw="text-xs font-semibold">作业</span>
        <div tw="flex items-center">
          <Icon
            name="add"
            type="light"
            clickable
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <div tw="border-b dark:border-neut-15">
        <div tw="mt-3 px-2 flex items-center">
          <InputSearch
            placeholder="搜索作业名称"
            // onPressEnter={(evt) => {
            //   setFilter((draft) => {
            //     draft.search = String((evt.target as HTMLInputElement).value)
            //   })
            // }}
            // onClear={() => {
            //   setFilter((draft) => {
            //     draft.search = ''
            //   })
            // }}
          />
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
          <JobTree />
        </SimpleBar>
      </div>
      {visible && <JobModal job={editJob} onCancel={hideCreateEditModal} />}
      {delVisible && (
        <ModalWrapper
          visible
          width={400}
          onCancel={hideDelModal}
          footer={
            <>
              <Button onClick={hideDelModal}>
                {window.getText('LEGO_UI_CANCEL')}
              </Button>
              <Button
                type="danger"
                disabled={!delBtnEnable}
                loading={mutation.isLoading}
                onClick={handleDel}
              >
                删除
              </Button>
            </>
          }
        >
          <div tw="flex items-start">
            <Icon
              name="if-error-info"
              size="medium"
              css={[tw`mr-3 text-2xl leading-6 text-red-10 fill-[#fff]`]}
            />
            <div tw="flex-1 overflow-hidden">
              <div tw="font-semibold text-base text-white break-all">
                {`删除作业：${editJob?.name}`}
              </div>
              <div tw="text-neut-8 mt-2">
                <div>{` 删除作业 ${editJob?.name}
              会同时删除其所有的历史版本及所有的作业实例信息,
              同时将其从调度系统下线并强制停止正在运行中的作业实例`}</div>
                <div tw="pt-6 space-y-1 ">
                  <div>
                    <span tw="label-required">
                      请在下方输入框中输入&quot;delete&quot;以确认操作
                    </span>
                  </div>
                  <div>
                    <Input
                      autoComplete="off"
                      type="text"
                      tw="w-40 border-line-dark"
                      placeholder="请输入"
                      onChange={(e, value) =>
                        setDelBtnEnable(value === 'delete')
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}
    </Rnd>
  )
})
export default JobMenu
