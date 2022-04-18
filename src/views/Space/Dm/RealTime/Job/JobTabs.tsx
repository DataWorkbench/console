import { useEffect, useRef } from 'react'
import { useUpdateEffect, useUnmount } from 'react-use'
import { Tabs, Icon } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { findIndex, get } from 'lodash-es'
import { useParams } from 'react-router-dom'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import tw, { theme, css, styled } from 'twin.macro'

import { useStore } from 'stores'
import { RouterLink, Icons } from 'components'

import StreamOperator from '../Stream/StreamOperator'
import StreamCode from '../Stream/StreamCode'
import StreamJAR from '../Stream/StreamJAR'
import SyncJob from '../Sync/SyncJob'
import { getDiJobType, JobMode, JobType, IconWrapper } from './JobUtils'

const { TabPanel } = Tabs

const TabWrapper = styled(Tabs)(() => [
  tw`bg-neut-18 h-full flex flex-col`,
  css`
    &.tabs-container .tabs.is-boxed {
      ${tw`bg-neut-17 h-8 flex-none`};
      ul {
        border: 0;
        > li {
          ${tw`border-l-0 border-r-0 border-t-0 border-b-2 border-b-transparent (rounded-b-none mx-0.5)!`}
          .tag {
            ${tw`border border-neut-13 text-neut-8  bg-transparent`}
          }
          &.is-active {
            ${tw`text-white border-b-green-11!`}
            .tag {
              ${tw`text-neut-13 bg-white border-0`}
            }
            > span.icon:hover svg {
              ${tw`text-white!`}
            }
          }
          ${tw`(bg-neut-18  pl-1 pr-3 py-1)! text-white rounded text-xs hover:((text-white bg-neut-16)!)`}
          > span.icon {
            ${tw`ml-2!`}
            svg {
              ${tw`text-white`}
            }
          }
        }
      }
      .tabs-handler {
        ${tw`h-9 bg-gradient-to-r from-neut-15 to-neut-16 bg-opacity-70 rounded-t-sm border-b-0`}
        > span.icon {
          ${tw`-mt-1!`}
          svg {
            ${tw`text-white`}
          }
        }
      }
    }
    .tab-content {
      ${tw`flex-1 py-0!`}
      .tab-panel {
        ${tw`flex h-full`}
      }
    }
  `,
])

const JobTabs = observer(() => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()
  const notifyTmRef = useRef<any>(null)
  const {
    workFlowStore,
    workFlowStore: { curJob, panels, addPanel, removePanel, showNotify },
  } = useStore()

  const added = curJob && findIndex(panels, (p) => p.id === curJob.id) > -1

  useEffect(() => {
    if (!added && curJob) {
      addPanel(curJob)
    }
  }, [curJob, added, addPanel])

  useEffect(() => {
    if (showNotify) {
      if (notifyTmRef.current) {
        clearTimeout(notifyTmRef.current)
      }
      notifyTmRef.current = setTimeout(() => {
        workFlowStore.set({
          showNotify: false,
        })
      }, 5000)
    }
  }, [showNotify, notifyTmRef, workFlowStore])

  useUpdateEffect(() => {
    workFlowStore.set({ panels: [], curJob: null })
  }, [spaceId, workFlowStore])

  useUnmount(() => {
    workFlowStore.set({ panels: [], curJob: null, curViewJobId: null })
  })

  const getTag = (job) => {
    const { jobMode } = job
    if (jobMode === JobMode.RT) {
      return get(
        {
          1: '算子',
          2: 'Sql',
          3: 'Jar',
          4: 'Python',
          5: 'Scala',
        },
        job.type
      )
    }
    if (jobMode === JobMode.DI) {
      const tp = getDiJobType(job.type)
      return (
        <IconWrapper theme="grey">
          <Icons
            name={tp === JobType.OFFLINE ? 'DownloadBoxFill' : 'LayerFill'}
            size={16}
          />
        </IconWrapper>
      )
    }
    return null
  }

  return (
    <div tw="flex-1 w-full overflow-x-hidden ">
      {showNotify && (
        <div tw="relative">
          <div tw="absolute left-0 top-9 w-full pointer-events-none z-10">
            <div tw="flex justify-center">
              <div tw="flex items-center bg-white text-neut-15 px-3 py-2 rounded-sm">
                <Icon
                  name="success"
                  type="light"
                  size={20}
                  tw="mr-2"
                  color={{
                    secondary: theme('colors.green.11'),
                  }}
                />
                <div tw="pointer-events-auto">
                  调度作业发布成功，您可前往
                  <RouterLink
                    color="blue"
                    to={`/${regionId}/workspace/${spaceId}/ops/release`}
                  >
                    运维中心-已发布作业
                  </RouterLink>{' '}
                  查看作业详情
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <TabWrapper
        type="card"
        activeName={curJob?.id}
        onChange={(name) => {
          if (workFlowStore.isDirty) {
            workFlowStore.showSaveConfirm(name, 'switch')
          } else {
            workFlowStore.set({
              curJob: panels.find((p) => p.id === name),
            })
          }
        }}
        onClose={(name: string) => {
          if (workFlowStore.isDirty) {
            workFlowStore.showSaveConfirm(name, 'close')
          } else {
            removePanel(name)
          }
        }}
      >
        {panels.map((job) => (
          <TabPanel
            key={job.id}
            name={job.id}
            closable
            label={
              <div tw="inline-flex items-center justify-center">
                <div
                  tw="scale-75"
                  className={job.jobMode === JobMode.RT ? 'tag' : ''}
                >
                  {getTag(job)}
                </div>
                <div>{job.name}</div>
              </div>
            }
          >
            {(() => {
              const jobMode = get(job, 'jobMode') as JobMode
              if (jobMode === JobMode.RT) {
                if (job.type === 1) {
                  return (
                    <DndProvider backend={HTML5Backend}>
                      <StreamOperator tw="flex-1 h-full" />
                    </DndProvider>
                  )
                }
                if ([2, 4, 5].includes(job.type)) {
                  return <StreamCode tw="flex-1 h-full" tp={job.type as any} />
                }
                if (job.type === 3) {
                  return <StreamJAR tw="flex-1 h-full" />
                }
              } else if (jobMode === JobMode.DI) {
                return <SyncJob />
              }

              return null
            })()}
          </TabPanel>
        ))}
      </TabWrapper>
    </div>
  )
})

export default JobTabs
