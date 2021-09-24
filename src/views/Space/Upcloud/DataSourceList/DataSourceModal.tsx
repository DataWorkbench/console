import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Modal, { ModalStep, ModalContent } from 'components/Modal'
import { Button, Loading } from '@QCFE/qingcloud-portal-ui'
import { useQueryClient } from 'react-query'
import { useQuerySourceKind, useMutationSource, getSourceKey } from 'hooks'
import { useImmer } from 'use-immer'
import { get } from 'lodash-es'
import DbList from './DbList'
import CreateForm from './CreateForm'

const DataSourceModal = ({ show = false, onHide = () => {} }) => {
  const { regionId, spaceId } =
    useParams<{ regionId: string; spaceId: string }>()

  const [state, setState] = useImmer({
    step: 0,
    dbIndex: 0,
  })
  const form = useRef()
  const queryClient = useQueryClient()
  const { status, data: kinds, refetch } = useQuerySourceKind(regionId, spaceId)
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
  return (
    <Modal
      show={show}
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
        {state.step === 0 && (
          <Loading spinning={status === 'loading'} delay={200}>
            <p>
              请选择一个数据库，您也可以参考
              <a href="##" className="text-link">
                数据库文档
              </a>
              进行查看配置
            </p>
            {status === 'error' && (
              <Button onClick={() => refetch()}>重试</Button>
            )}
            {kinds && <DbList items={kinds} onChange={handleDbSelect} />}
          </Loading>
        )}
        {state.step === 1 && (
          <CreateForm ref={form} db={kinds[state.dbIndex]} />
        )}
      </ModalContent>
    </Modal>
  )
}

export default DataSourceModal
