import { useEffect, useRef } from 'react'
import { useUpdateEffect, useUnmount } from 'react-use'
import { Tabs, Icon } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { findIndex } from 'lodash-es'
import { useParams } from 'react-router-dom'
import tw, { theme, css, styled } from 'twin.macro'

import { useStore } from 'stores'
import { RouterLink } from 'components'

import SyncJob from '../Sync/SyncJob'
import { IconWrapper } from './ApiUtils'

const { TabPanel } = Tabs as any

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
      ${tw`flex-1 py-0! overflow-hidden`}
      .tab-panel {
        ${tw`flex h-full`}
      }
    }
  `
])

const ApiTabs = observer(() => {
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  const notifyTmRef = useRef<any>(null)
  const {
    dtsDevStore,
    dtsDevStore: { curApi, panels, addPanel, removePanel, showNotify }
  } = useStore()

  const added = curApi && findIndex(panels, (p) => p.api_id === curApi.api_id) > -1

  useEffect(() => {
    if (!added && curApi) {
      addPanel(curApi)
    }
  }, [curApi, added, addPanel])

  useEffect(() => {
    if (showNotify) {
      if (notifyTmRef.current) {
        clearTimeout(notifyTmRef.current)
      }
      notifyTmRef.current = setTimeout(() => {
        dtsDevStore.set({
          showNotify: false
        })
      }, 5000)
    }
  }, [showNotify, notifyTmRef, dtsDevStore])

  useUpdateEffect(() => {
    dtsDevStore.set({ panels: [], curJob: null })
  }, [spaceId, dtsDevStore])

  useUnmount(() => {
    dtsDevStore.set({ panels: [], curJob: null, curViewJobId: null })
  })

  return (
    <div tw="flex-1 w-full overflow-x-hidden">
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
                    secondary: theme('colors.green.11')
                  }}
                />
                <div tw="pointer-events-auto">
                  调度作业发布成功，您可前往
                  <RouterLink
                    color="blue"
                    to={`/${regionId}/workspace/${spaceId}/ops/${
                      curApi?.jobMode === 'DI' ? 'data-' : ''
                    }release`}
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
        activeName={curApi?.api_id}
        onChange={(name) => {
          if (dtsDevStore.isDirty) {
            dtsDevStore.showSaveConfirm(name, 'switch')
          } else {
            dtsDevStore.set({
              curApi: panels.find((p) => p.api_id === name)
            })
          }
        }}
        onClose={(name: string) => {
          if (dtsDevStore.isDirty) {
            dtsDevStore.showSaveConfirm(name, 'close')
          } else {
            removePanel(name)
          }
        }}
      >
        {panels.map((api) => (
          <TabPanel
            key={api.api_id}
            name={api.api_id}
            closable
            label={
              <div tw="inline-flex items-center justify-center">
                <IconWrapper tw="mr-2">
                  <Icon name="q-apiFill" color={{ secondary: '#ffd0275d', primary: '#fff' }} />
                </IconWrapper>
                <div>{api.api_name}</div>
              </div>
            }
          >
            {(() => (
              <SyncJob />
            ))()}
          </TabPanel>
        ))}
      </TabWrapper>
    </div>
  )
})

export default ApiTabs
