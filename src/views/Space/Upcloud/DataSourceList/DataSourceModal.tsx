import { Fragment, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Modal, ModalStep, ModalContent, HelpCenterLink } from 'components'
import { PopConfirm, Icon } from '@QCFE/lego-ui'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import tw from 'twin.macro'
import { useQuerySourceKind, useMutationSource, getSourceKey, useStore } from 'hooks'
import { get, values, omit } from 'lodash-es'
import { useImmer } from 'use-immer'
import { Global, css } from '@emotion/react'
import { toJS } from 'mobx'

import sourceListBg from 'assets/source-list.svg'
import DataSourceForm from './DataSourceForm'
import DbList from './DbList'
import { DbType, sourceKinds } from './constant'

interface DataSourceModalProp {
  onHide?: () => void
}

const dbLabelStyles = {
  wrapper: tw`flex items-center mb-2`,
  icon: tw`bg-green-11 w-1 h-4 mr-2`,
  label: tw`text-neut-15`
}

const DataSourceModal = observer(({ onHide = () => {} }: DataSourceModalProp) => {
  const { regionId, spaceId } = useParams<{ regionId: string; spaceId: string }>()
  const {
    dataSourceStore: {
      op,
      opSourceList,
      // sourceKinds,
      emptyHistories,
      itemHistories,
      clearEmptyHistories
    }
  } = useStore()

  const [state, setState] = useImmer({
    step: ['update', 'view'].includes(op) ? 1 : 0,
    dbName: ''
  })
  const [confirmVisible, setcConfirmVisible] = useState(false)
  const getFormData = useRef<() => any>()
  const queryClient = useQueryClient()
  const { status, data: kinds, refetch } = useQuerySourceKind(regionId, spaceId, op)
  const mutation = useMutationSource()

  const curkind =
    op === 'create'
      ? sourceKinds.find((k) => k.name === state.dbName)
      : sourceKinds.find((k) => k.source_type === opSourceList[0]?.type)
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
          type: curkind.source_type,
          ...data
        }
        if (op === 'update') {
          params.sourceId = opSourceList[0].id
          params.last_connection = toJS(itemHistories[params.sourceId])
        }
        if (op === 'create' && emptyHistories.size) {
          params.last_connection = toJS(Array.from(emptyHistories.values()).at(-1)?.last_connection)
        }

        mutation.mutate(params, {
          onSuccess: () => {
            onHide()
            clearEmptyHistories()
            const queryKey = getSourceKey()
            queryClient.invalidateQueries(queryKey)
          }
        })
      }
    }
  }
  const goStep = (i: number) => {
    setState((draft) => {
      draft.step = i
    })
  }
  const handleFieldValueChange = () => {
    const data = (getFormData as any).current(false)
    if (data) {
      const field = values(omit(data, 'utype')).find((v: string) => v !== '')
      setcConfirmVisible(field && field.length > 0)
    }
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
        onCancel={() => {
          onHide()
          clearEmptyHistories()
        }}
        orient="fullright"
        width={800}
        title={`${opTxt}数据源: ${curkind ? curkind.showname || curkind.name : ''}`}
        maskClosable={false}
        escClosable={false}
        footer={
          <div tw="flex justify-end space-x-2">
            {state.step === 0 ? (
              <Button
                onClick={() => {
                  onHide()
                  clearEmptyHistories()
                }}
              >
                取消
              </Button>
            ) : (
              <>
                {op === 'create' && (
                  <>
                    {confirmVisible ? (
                      <PopConfirm
                        type="warning"
                        content="选择此项，刚刚填写的数据源配置信息将清空，确定选择此项吗？"
                        onOk={() => {
                          goStep(0)
                        }}
                      >
                        <Button className="mr-2" onClick={() => goStep(0)}>
                          上一步
                        </Button>
                      </PopConfirm>
                    ) : (
                      <Button className="mr-2" onClick={() => goStep(0)}>
                        上一步
                      </Button>
                    )}
                  </>
                )}

                {op === 'update' && <Button onClick={onHide}>取消</Button>}

                <Button loading={mutation.isLoading} type="primary" onClick={handleSubmitClick}>
                  {op === 'view' ? '关闭' : opTxt}
                </Button>
              </>
            )}
          </div>
        }
      >
        <ModalStep
          step={state.step}
          stepTexts={['选择数据源', '配置数据源']}
          css={state.step === 1 && tw`bg-white`}
          doneIcon={<Icon name="check" size={20} type="coloured" />}
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
              case 'idle':
              case 'success':
                if (state.step === 0) {
                  const map = new Map(sourceKinds.map((k) => [k.name, k]))
                  const items: Record<DbType, Record<string, any>[]>[] = kinds.reduce(
                    (acc: Record<string, any>, cur: Record<string, any>) => {
                      if (map.has(cur.name)) {
                        acc[map.get(cur.name)!.type].push(map.get(cur.name))
                      }
                      return acc
                    },
                    {
                      [DbType.Sql]: [],
                      [DbType.DW]: [],
                      [DbType.Storage]: [],
                      [DbType.Nosql]: [],
                      [DbType.Mq]: []
                    }
                  )
                  return (
                    <>
                      <p tw="pt-2 pb-3 font-medium">
                        请选择一个数据库，您也可以参考
                        <HelpCenterLink href="/manual/data_up_cloud/add_data/" isIframe={false}>
                          数据库文档
                        </HelpCenterLink>
                        进行查看配置
                      </p>
                      {Object.entries(items).map(([k, v]) => (
                        <Fragment key={k}>
                          <div css={dbLabelStyles.wrapper}>
                            <div css={dbLabelStyles.icon} />
                            <div css={dbLabelStyles.label}>{k}:</div>
                          </div>
                          <DbList current={curkind} items={v as any} onChange={handleDbSelect} />
                        </Fragment>
                      ))}
                    </>
                  )
                }

                return (
                  curkind && (
                    <DataSourceForm
                      op={op}
                      opSourceList={opSourceList}
                      getFormData={getFormData as any}
                      resInfo={curkind}
                      onFieldValueChange={handleFieldValueChange}
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
})

export default DataSourceModal
