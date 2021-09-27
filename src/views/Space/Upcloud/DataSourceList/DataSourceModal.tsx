import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import {
  useQuerySourceKind,
  useMutationSource,
  getSourceKey,
  useStore,
} from 'hooks'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'

import DbList from './DbList'
import CreateForm from './CreateForm'

interface DataSourceModalProp {
  onHide?: () => void
}

const DataSourceModal = observer(
  ({ onHide = () => {} }: DataSourceModalProp) => {
    const { regionId, spaceId } =
      useParams<{ regionId: string; spaceId: string }>()
    const {
      dataSourceStore: { op, opSourceList },
    } = useStore()

    const [state, setState] = useImmer({
      step: op === 'update' ? 1 : 0,
      dbIndex: 0,
    })
    const form = useRef()
    const queryClient = useQueryClient()
    const {
      status,
      data: kinds,
      refetch,
    } = useQuerySourceKind(regionId, spaceId)
    const mutation = useMutationSource()

    const handleDbSelect = (i: number) => {
      setState((draft) => {
        draft.step = 1
        draft.dbIndex = i
      })
    }
    const handleSave = () => {
      const formElem = form.current
      if (formElem.validateForm()) {
        const { name, comment, ...rest } = formElem.getFieldsValue()
        const sourcetype: string = get(kinds, `[${state.dbIndex}].name`)
        const params = {
          regionId,
          spaceId,
          name,
          comment,
          sourcetype,
          url: {
            [sourcetype.toLowerCase()]: rest,
          },
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
    const goStep = (i: number) => {
      setState((draft) => {
        draft.step = i
      })
    }
    const curkind =
      op === 'create'
        ? get(kinds, `[${state.dbIndex}]`)
        : kinds?.find((k) => k.name === opSourceList[0]?.sourcetype)
    return (
      <Modal
        onHide={onHide}
        title="新增数据源"
        footer={
          <div tw="flex justify-end space-x-2">
            {state.step === 0 ? (
              <Button onClick={onHide}>取消</Button>
            ) : (
              <>
                <Button className="mr-2" onClick={() => goStep(0)}>
                  上一步
                </Button>
                <Button
                  loading={mutation.isLoading}
                  type="primary"
                  onClick={handleSave}
                >
                  确定
                </Button>
              </>
            )}
          </div>
        }
      >
        <ModalStep step={state.step} stepTexts={['选择数据库', '配置数据库']} />
        <ModalContent>
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
                  return (
                    <>
                      <p>
                        请选择一个数据库，您也可以参考
                        <a href="##" className="text-link">
                          数据库文档
                        </a>
                        进行查看配置
                      </p>
                      <DbList items={kinds} onChange={handleDbSelect} />
                    </>
                  )
                }
                return <CreateForm ref={form} kind={curkind} />
              default:
                return null
            }
          })()}
        </ModalContent>
      </Modal>
    )
  }
)

export default DataSourceModal
