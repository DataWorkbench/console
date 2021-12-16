import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Modal, ModalStep, ModalContent, HelpCenterLink } from 'components'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import tw from 'twin.macro'
import {
  useQuerySourceKind,
  useMutationSource,
  getSourceKey,
  useStore,
} from 'hooks'
import { get } from 'lodash-es'
import { useImmer } from 'use-immer'
import { Global, css } from '@emotion/react'

import sourceListBg from 'assets/source-list.svg'
import DataSourceForm from './DataSourceForm'
import DbList from './DbList'

interface DataSourceModalProp {
  onHide?: () => void
}

const DataSourceModal = observer(
  ({ onHide = () => {} }: DataSourceModalProp) => {
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()
    const {
      dataSourceStore: { op, opSourceList, sourceKinds },
    } = useStore()

    const [state, setState] = useImmer({
      step: ['update', 'view'].includes(op) ? 1 : 0,
      dbName: '',
    })
    const getFormData = useRef<() => any>()
    const queryClient = useQueryClient()
    const {
      status,
      data: kinds,
      refetch,
    } = useQuerySourceKind(regionId, spaceId)
    const mutation = useMutationSource()
    const curkind =
      op === 'create'
        ? sourceKinds.find((k) => k.name === state.dbName)
        : sourceKinds.find(
            (k) => k.source_type === opSourceList[0]?.source_type
          )
    const handleDbSelect = (name: string) => {
      setState((draft) => {
        draft.step = 1
        draft.dbName = name
      })
    }
    const handleSubmitClick = () => {
      if (op === 'view') {
        onHide()
      } else if (getFormData?.current) {
        const data = (getFormData as any).current()
        if (data && curkind?.source_type) {
          const params = {
            op,
            source_type: curkind.source_type,
            ...data,
          }
          if (op === 'update') {
            params.sourceId = opSourceList[0].source_id
          }
          mutation.mutate(params, {
            onSuccess: () => {
              onHide()
              const queryKey = getSourceKey()
              queryClient.invalidateQueries(queryKey)
            },
          })
        }
      }
    }
    const goStep = (i: number) => {
      setState((draft) => {
        draft.step = i
      })
    }
    const opTxt = get({ create: '新增', update: '修改', view: '查看' }, op)
    return (
      <>
        <Global
          styles={css`
            .source-item-bg {
              background-image: url(${String(sourceListBg)});
            }
          `}
        />
        <Modal
          visible
          onCancel={onHide}
          orient="fullright"
          width={800}
          title={`${opTxt}数据源: ${
            curkind ? curkind.showname || curkind.name : ''
          }`}
          footer={
            <div tw="flex justify-end space-x-2">
              {state.step === 0 ? (
                <Button onClick={onHide}>取消</Button>
              ) : (
                <>
                  {op === 'create' && (
                    <Button className="mr-2" onClick={() => goStep(0)}>
                      上一步
                    </Button>
                  )}

                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    onClick={handleSubmitClick}
                  >
                    {op === 'view' ? '关闭' : opTxt}
                  </Button>
                </>
              )}
            </div>
          }
        >
          <ModalStep
            step={state.step}
            stepTexts={['选择数据库', '配置数据库']}
            css={state.step === 1 && tw`bg-white`}
          />
          <ModalContent css={state.step === 1 && tw`px-0 pt-0`}>
            {(() => {
              switch (status) {
                case 'loading':
                  return (
                    <div tw="h-80">
                      <Loading />
                    </div>
                  )
                case 'error':
                  return <Button onClick={() => refetch()}>重试</Button>
                case 'success':
                  if (state.step === 0) {
                    const items = kinds
                      .map(({ name }: { name: string }) =>
                        sourceKinds.find((info) => info.name === name)
                      )
                      .filter((n: any) => n)
                    return (
                      <>
                        <p tw="pt-2 pb-3 font-medium">
                          请选择一个数据库，您也可以参考
                          <HelpCenterLink
                            href="/manual/data_up_cloud/source_data/data_summary/"
                            isIframe={false}
                          >
                            数据库文档
                          </HelpCenterLink>
                          进行查看配置
                        </p>
                        <DbList
                          current={curkind}
                          items={items}
                          onChange={handleDbSelect}
                        />
                      </>
                    )
                  }

                  return (
                    curkind && (
                      <DataSourceForm
                        getFormData={getFormData as any}
                        resInfo={curkind}
                      />
                    )
                  )
                default:
                  return null
              }
            })()}
          </ModalContent>
        </Modal>
      </>
    )
  }
)

export default DataSourceModal
