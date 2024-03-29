import { Collapse } from '@QCFE/lego-ui'
import { observer } from 'mobx-react-lite'
import { Button, Icon, Notification as Notify } from '@QCFE/qingcloud-portal-ui'
import { Confirm, RouterLink } from 'components'
import tw, { css, styled } from 'twin.macro'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cloneDeep, get } from 'lodash-es'
import {
  useMutationUpdateApiConfig,
  useStore,
  useFetchApiConfig,
  useMutationPublishDataServiceApi,
  useMutationDescribeDataServiceApiVersion
} from 'hooks'
import SimpleBar from 'simplebar-react'
import { useLocation, useParams } from 'react-router-dom'
import qs from 'qs'
import { JobToolBar } from '../styled'
import SyncDataSource, { ISourceData } from './SyncDataSource'

import FieldOrder from './FieldOrder'

import FieldSetting from './FieldSetting'
import { orderMapRequestData } from './SyncUtil'

const { CollapseItem } = Collapse
const CollapseWrapper = styled('div')(() => [
  tw`flex-1 px-2 py-2 bg-neut-18`,
  css`
    li.collapse-item {
      ${tw`mb-2 rounded-[3px] overflow-hidden`}
      .collapse-item-label {
        ${tw`h-11 border-none hover:bg-neut-16 pl-[10px]`}
      }
      .collapse-item-content {
        ${tw`bg-neut-17 pt-2 pb-3`}
      }
    }
    li:last-child {
      ${tw`mb-1`}
    }
  `
])

const SyncJobWrapper = styled('div')(() => [
  tw`flex flex-col flex-1 relative`,
  css`
    button {
      ${tw`h-7!`}
    }
    .refresh-button {
      ${tw`h-7! w-7!`}
    }
    .select-control {
      ${tw`h-7! flex relative`}
      .select-multi-value-wrapper {
        ${tw`flex-1`}
      }
    }
    input {
      ${tw`h-7!`}
    }
    .radio-wrapper {
      ${tw`h-7! flex items-center`}
      &::before {
        ${tw` top-[6px]`}
      }
    }
    label.radio.checked::after {
      ${tw` top-[10px]`}
    }
    .radio-button {
      ${tw`h-7!`}
    }
    .clear-button {
      ${tw`h-7! w-7!`}
    }
  `
])

const VerWarp = styled('div')(() => [
  tw`text-neut-8`,
  css`
    .apiName {
      ${tw`text-white mr-2`}
    }
    .verIcon {
      ${tw`text-[#FACC15] border-[1px] border-solid border-[#FACC15] ml-2 px-2 py-1  rounded-xl`}
    }
  `
])

const styles = {
  stepTag: tw`flex items-center text-left border border-green-11 rounded-r-2xl pr-4 mr-3 h-7 leading-5`,
  stepNum: tw`inline-block text-white bg-green-11 w-5 h-5 text-center rounded-full -ml-2.5`,
  stepText: tw`ml-2 inline-block border-green-11 text-green-11!`
}

const getStepsData = (regionId: string, spaceId: string) => [
  {
    key: 'p0',
    title: '选择数据源',
    desc: (
      <>
        仅支持在
        <RouterLink
          to={`/${regionId}/workspace/${spaceId}/upcloud/dsl`}
          target="_blank"
          color="blue"
        >
          数据源管理
        </RouterLink>
        创建的数据源。
      </>
    )
  },
  {
    key: 'p1',
    title: '字段设置',
    desc: null
  },
  {
    key: 'p2',
    title: '字段排序',
    desc: null
  }
]

const SyncJob = observer(() => {
  const mutation = useMutationUpdateApiConfig()
  const fetchApi = useFetchApiConfig()
  const publishMutation = useMutationPublishDataServiceApi()
  const mutationApiVersion = useMutationDescribeDataServiceApiVersion()

  const {
    dtsDevStore: { curApi, apiConfigData, apiRequestData, apiResponseData },
    dtsDevStore
  } = useStore()
  const requestConfig = cloneDeep(apiRequestData) as any[]
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const isHistory = get(curApi, 'is_history', false) || false
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()

  const { search } = useLocation()
  const { verId } = qs.parse(search.slice(1))

  useEffect(() => {
    // 如果存在版本id，则获取版本信息接口
    if (verId) return

    if (curApi) {
      // 更改完api， 请求api配置, curApi 中判断是历史版本还是在线版本
      if (isHistory) {
        const aId = get(curApi, 'api_id')
        const vId = get(curApi, 'version_id')
        const params = {
          apiId: aId,
          verId: vId
        }
        mutationApiVersion.mutate(params, {
          onSuccess: (res) => {
            if (res.ret_code === 0) {
              dtsDevStore.set({
                apiConfigData: res,
                oldApiTableNam: get(res, 'api_config.table_name') // 旧表名
              })
            }
          }
        })
      } else {
        const apiId = get(curApi, 'api_id')
        fetchApi({ apiId }).then((res) => {
          if (res) {
            dtsDevStore.set({
              apiConfigData: res,
              oldApiTableNam: get(res, 'api_config.table_name') // 旧表名
            })
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curApi, dtsDevStore, fetchApi, verId, isHistory])

  const orderRef = useRef<{
    getDataSource: () => { column_name: string; order_mode: number }[]
  }>(null)
  const dataSourceRef = useRef<{
    getDataSource: () => ISourceData
  }>(null)

  const showConfWarn = (content: string) => {
    Notify.warning({
      title: '操作提示',
      content,
      placement: 'bottomRight'
    })
  }

  const handleSyncStore = (response: any[]) => {
    const config = {
      ...cloneDeep(apiConfigData),
      api_config: {
        ...cloneDeep(apiConfigData?.api_config),
        request_params: {
          request_params: requestConfig
        },
        response_params: {
          response_params: response
        }
      }
    }
    dtsDevStore.set({
      apiConfigData: config,
      oldApiTableNam: get(config, 'api_config.table_name') // 旧表名
    })
  }

  const save = (showTip: boolean) =>
    new Promise((resolve) => {
      if (!orderRef.current || !dataSourceRef.current) {
        return
      }

      const dataSourceData = dataSourceRef.current.getDataSource()
      const orderSourceData = orderRef.current.getDataSource()

      if (!dataSourceData.tableName) {
        showConfWarn('未配置数据源表信息')
        return
      }

      if (orderSourceData) {
        if (orderSourceData?.some((item) => item.column_name === '')) {
          showConfWarn('字段排序名称不能为空')
          return
        }
      }

      // 映射字段排序字段到返回参数中
      const responseConfig = cloneDeep(apiResponseData) as any[]

      const response = orderMapRequestData(orderSourceData, responseConfig)

      const apiConfig: any = cloneDeep(get(apiConfigData, 'api_config', {}))
      const apiId = get(curApi, 'api_id')

      if (!dataSourceData?.source?.id) {
        Notify.warning({
          title: '操作提示',
          content: '请先选择数据源',
          placement: 'bottomRight'
        })
        return
      }

      mutation.mutate(
        {
          ...apiConfig,
          apiId,
          datasource_id: dataSourceData?.source?.id,
          table_name: dataSourceData?.tableName,
          request_params: {
            request_params: requestConfig
          },
          response_params: {
            response_params: response
          }
        },
        {
          onSuccess: (res) => {
            if (res.ret_code === 0) {
              if (showTip) {
                Notify.success({
                  title: '操作提示',
                  content: '配置保存成功',
                  placement: 'bottomRight'
                })
              }
              handleSyncStore(response)
            }
            resolve(res)
          }
        }
      )
    })
  const release = async () => {
    const apiId = get(curApi, 'api_id')
    fetchApi({ apiId }).then(async (res) => {
      if (res.ret_code === 0) {
        const status = get(res, 'api_config.status')
        if (status !== 3) {
          setShowConfirm(true)
        } else {
          const saveRes: any = await save(false)
          if (saveRes.ret_code === 0) {
            publishMutation.mutate(
              { apiId },
              {
                onSuccess: (response) => {
                  if (response.ret_code === 0) {
                    dtsDevStore.set({
                      showNotify: true
                    })
                  }
                }
              }
            )
          }
        }
      }
    })
  }

  const test = () => {
    // 检测是否有服务集群
    const clusterId = get(apiConfigData, 'service_cluster.id')
    const requestParams = get(apiConfigData, 'api_config.request_params')
    const responseParams = get(apiConfigData, 'api_config.response_params')
    if (!clusterId) {
      dtsDevStore.set({
        showClusterErrorTip: true
      })
      Notify.warning({
        title: '操作提示',
        content: '请先选择服务集群',
        placement: 'bottomRight'
      })
      return
    }
    if (!requestParams || !responseParams) {
      Notify.warning({
        title: '操作提示',
        content: '请配置亲请求参数和返回参数',
        placement: 'bottomRight'
      })
      return
    }

    dtsDevStore.set({ showTestModal: true })
  }
  const stepsData = useMemo(() => getStepsData(regionId, spaceId), [regionId, spaceId])

  const renderGuideMode = () => (
    <CollapseWrapper>
      <Collapse defaultActiveKey={stepsData.map((step) => step.key)}>
        {stepsData.map(({ key, title, desc }, index) => (
          <CollapseItem
            key={key}
            label={
              <>
                <div css={styles.stepTag}>
                  <span css={styles.stepNum}>{index + 1}</span>
                  <span css={styles.stepText}>{title}</span>
                </div>
                <div tw="text-neut-13">{desc}</div>
              </>
            }
          >
            {index === 0 && <SyncDataSource ref={dataSourceRef} disabled={isHistory} />}
            {index === 1 && <FieldSetting disabled={isHistory} />}
            {index === 2 && <FieldOrder ref={orderRef} disabled={isHistory} />}
          </CollapseItem>
        ))}
      </Collapse>
    </CollapseWrapper>
  )

  return (
    <SyncJobWrapper>
      <JobToolBar>
        {!isHistory ? (
          <>
            <Button onClick={() => save(true)} loading={mutation.isLoading}>
              <Icon name="data" type="dark" />
              保存
            </Button>
            <Button onClick={test}>
              <Icon name="q-upCircleFill" />
              测试
            </Button>
            <Button type="primary" onClick={release}>
              <Icon name="export" />
              发布
            </Button>
          </>
        ) : (
          <VerWarp>
            <span className="apiName"> {get(curApi, 'api_name')}</span>
            <span>(版本ID: {get(curApi, 'version_id')})</span>
            <span className="verIcon"> 历史版本</span>
          </VerWarp>
        )}
      </JobToolBar>
      <div tw="flex-1 overflow-hidden">
        <SimpleBar tw="h-full">{renderGuideMode()}</SimpleBar>
      </div>
      {showConfirm && (
        <Confirm
          title="发布注意"
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
          width={400}
          maskClosable={false}
          appendToBody
          draggable
          onCancel={() => setShowConfirm(false)}
          footer={
            <div tw="flex justify-end space-x-2">
              <Button onClick={() => setShowConfirm(false)}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  test()
                  setShowConfirm(false)
                }}
              >
                测试
              </Button>
            </div>
          }
        >
          <div tw=" mt-3">发布 API 前, 请先测试 API, 测试成功后才可发布。</div>
        </Confirm>
      )}
    </SyncJobWrapper>
  )
})

export default SyncJob
