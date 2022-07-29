import { useMemo } from 'react'
import { useMount, useUnmount, useLocalStorage, useUpdateEffect } from 'react-use'
import { observer } from 'mobx-react-lite'
import tw, { css, theme } from 'twin.macro'
import { useStore } from 'stores'
import { Center, FlexBox } from 'components'
import emitter from 'utils/emitter'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'qs'
import { useMutationDescribeDataServiceApiVersion } from 'hooks'
import { get } from 'lodash-es'
import ApiMenu from './ApiPanel/ApiMenu'
import ApiTabs from './ApiPanel/ApiTabs'
import StreamRightMenu from './Stream/StreamRightMenu'

const ServiceDev = observer(() => {
  const { spaceId, detail } = useParams<{ regionId: string; spaceId: string; detail?: string }>()
  const mutationApiVersion = useMutationDescribeDataServiceApiVersion()

  const {
    dtsDevStore,
    dtsDevStore: { curApi }
  } = useStore()
  const [sideCollapsed, setSideCollapsed] = useLocalStorage('NAV_SIDER_COLLAPSED', false)
  const { search } = useLocation()
  const { verId } = qs.parse(search.slice(1)) as { verId: string }

  useUpdateEffect(() => {
    dtsDevStore.set({ panels: [], curApi: null, curVersion: null })
  }, [spaceId, dtsDevStore])

  useUnmount(() => {
    dtsDevStore.set({
      panels: [],
      curApi: null,
      curViewJobId: null,
      curVersion: null
    })
  })
  useMount(() => {
    // 存在历史版本
    if (detail) {
      const params = {
        apiId: detail,
        verId
      }
      mutationApiVersion.mutate(params, {
        onSuccess: (res) => {
          const apiConfig = get(res, 'api_config')
          const VerApi = {
            key: `${apiConfig.api_id}_${verId}`, // key 和 api_id 是panel 的唯一标识， 区分当前版本和历史版本
            api_id: apiConfig.api_id,
            api_name: apiConfig.api_name,
            api_mode: apiConfig.api_mode,
            api_path: apiConfig.api_path,
            space_id: apiConfig.space_id,
            status: apiConfig.status,
            group_id: apiConfig.group_id,
            version_id: verId, // 历史版本号
            is_history: true
          }

          dtsDevStore.set({
            apiConfigData: res
          })
          dtsDevStore.addPanel({ ...VerApi })
        }
      })
    }

    if (!sideCollapsed) {
      setSideCollapsed(true)
      emitter.emit('cancelSaveJob')
    }
  })

  const steps = useMemo(() => ['创建 API', '编辑 API', '测试 API', '发布 API', '查看已发布API'], [])

  const renderStep = (step: string, i: number, hasArrow = true, reverse = false) => (
    <Center key={step} css={[reverse && tw`flex-row-reverse`]}>
      <Center>
        <div tw="inline-flex justify-center items-center bg-neut-16  rounded-full w-4 h-4 mr-2">
          {i + 1}
        </div>
        <div>{step}</div>
      </Center>
      {hasArrow && (
        <Center css={[tw`px-2`, reverse && tw`flex-row-reverse`]}>
          <div tw="border-t border-neut-13 w-12" />
          <div
            tw="w-0 h-0"
            css={[
              css`
                  border-top: 4px solid transparent;
                  border-bottom: 4px solid transparent;
                  border-${reverse ? 'right' : 'left'}: 4px solid ${theme('colors.line.dark')};`
            ]}
          />
        </Center>
      )}
    </Center>
  )

  return (
    <div tw="flex min-h-[600px] w-full h-full overflow-auto p-2 pr-0 ">
      <div tw="flex w-full">
        <ApiMenu tw="mr-2" />
        {curApi ? (
          <>
            <ApiTabs />
            <StreamRightMenu />
          </>
        ) : (
          <Center tw="flex-1 w-full text-neut-8 bg-neut-18 rounded">
            <div tw="space-y-2">
              <FlexBox tw="space-x-1">
                {steps.slice(0, 3).map((step, i) => renderStep(step, i, i !== 2))}
              </FlexBox>
              <FlexBox tw="justify-end">
                <div tw="flex flex-col items-center pr-5">
                  <div tw="border-l border-neut-13 h-16" />
                  <div
                    tw="w-0 h-0"
                    css={`
                      border-left: 4px solid transparent;
                      border-right: 4px solid transparent;
                      border-top: 4px solid ${theme('colors.line.dark')};
                    `}
                  />
                </div>
              </FlexBox>
              <FlexBox tw="space-x-1 flex-row-reverse">
                {steps.slice(3).map((step, i) => renderStep(step, i + 3, i + 3 !== 4, true))}
              </FlexBox>
            </div>
          </Center>
        )}
      </div>
    </div>
  )
})

export default ServiceDev
