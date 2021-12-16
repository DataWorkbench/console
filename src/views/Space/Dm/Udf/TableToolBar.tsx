import { useMemo } from 'react'
import { Button, ToolBar, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'
import { css } from 'twin.macro'
import { pullAllBy } from 'lodash-es'

import { FlexBox, Center, Modal } from 'components'
import { useMutationUdf, useStore } from 'hooks'
import { Table } from 'views/Space/styled'
import { useIsFetching } from 'react-query'
import { toJS } from 'mobx'
import { baseColumns } from './constants'
import { IUdfFilterInterface } from './interfaces'

const { ColumnsSetting } = ToolBar as any

interface ITableToolBarProps {
  defaultColumns: Record<string, any>[]
  setFilter: (_: (_: IUdfFilterInterface) => void) => void
  refetch: () => Promise<any>
}

const TableToolBar = observer((props: ITableToolBarProps) => {
  const {
    dmStore: {
      op,
      setOp,
      udfType,
      udfSelectedRowKeys,
      setUdfColumnSettings,
      udfStorageKey,
      udfSelectedRows,
      setModalData,
      udfFilterRows,
      setUdfFilterRows,
      set,
      // : columnSettings
    },
  } = useStore()

  const mutation = useMutationUdf()
  const isFetching = useIsFetching()

  const { defaultColumns, setFilter, refetch } = props

  const mutateData = () => {
    mutation.mutate(
      {
        op: 'delete',
        udf_ids: udfFilterRows.map((i) => i.udf_id),
      },
      {
        onSuccess: () => {
          const params = {
            udfSelectedRows: pullAllBy(
              toJS(udfSelectedRows),
              toJS(udfFilterRows),
              'udf_id'
            ),
            udfFilterRows: [],
            op: '',
          }
          set(params)
          refetch()
        },
      }
    )
  }

  const deleteText = useMemo(
    () => udfFilterRows.map((i) => `${i.name}(${i.udf_id})`).join('、'),
    [udfFilterRows]
  )
  return (
    <>
      <div tw="mb-3">
        <FlexBox tw="justify-between">
          <Center tw="space-x-2">
            <Button
              type="primary"
              onClick={() => {
                setOp('create')
                setModalData({})
              }}
            >
              <Icon name="if-add" size={16} />
              {`新建 ${udfType} 函数节点`}
            </Button>
            <Button
              disabled={!udfSelectedRowKeys.length}
              onClick={() => {
                setOp('delete')
                setUdfFilterRows(udfSelectedRows)
              }}
            >
              <Icon name="trash" type="light" />
              <span>删除</span>
            </Button>
          </Center>
          <Center tw="space-x-3">
            <InputSearch
              tw="w-64"
              placeholder="请输入关键词进行搜索"
              onPressEnter={(evt) => {
                setFilter((_) => {
                  _.search = String((evt.target as HTMLInputElement).value)
                  _.offset = 0
                })
              }}
              onClear={() => {
                setFilter((_) => {
                  if (_.search) {
                    _.search = ''
                    _.offset = 0
                  }
                })
              }}
            />
            <Button
              type="black"
              loading={!!isFetching}
              tw="px-[5px] border-[#4C5E70]!"
            >
              <Icon
                name="if-refresh"
                tw="text-xl text-white"
                type="light"
                onClick={() => {
                  refetch()
                }}
              />
            </Button>
            <ColumnsSetting
              defaultColumns={defaultColumns}
              storageKey={udfStorageKey}
              onSave={setUdfColumnSettings}
              key={udfStorageKey}
            />
          </Center>
        </FlexBox>
      </div>
      {op === 'delete' && (
        <Modal
          noBorder
          visible
          width={udfSelectedRowKeys.length > 1 ? 600 : 400}
          onCancel={() => setOp('')}
          onOk={mutateData}
          okText="删除"
          okType="danger"
          confirmLoading={mutation.isLoading}
        >
          <FlexBox tw="space-x-3 mb-3">
            <Icon
              name="if-exclamation"
              css={css`
                color: #ffd127;
                font-size: 22px;
                line-height: 24px;
              `}
            />
            <section tw="flex-1">
              <>
                <div tw="font-medium mb-2 text-base">
                  {udfFilterRows.length === 1
                    ? `删除函数节点 ${deleteText} 注意事项`
                    : `删除以下 ${udfFilterRows.length} 个函数注意事项`}
                </div>
                <div className="modal-content-message">
                  {`删除 ${deleteText} 后，相关工作流、任务会出现问题，且该操作无法撤回。确认删除吗？`}
                </div>
              </>
            </section>
          </FlexBox>
          <>
            {udfFilterRows.length > 1 && (
              <Table
                dataSource={toJS(udfFilterRows)}
                rowKey="udf_id"
                columns={baseColumns}
                key="delete-table"
              />
            )}
          </>
        </Modal>
      )}
    </>
  )
})

export default TableToolBar
