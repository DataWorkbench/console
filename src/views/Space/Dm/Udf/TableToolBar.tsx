import { Button, ToolBar, Icon, InputSearch } from '@QCFE/qingcloud-portal-ui'
import { observer } from 'mobx-react-lite'

import { FlexBox, Center } from 'components'
import { useMutationUdf, useStore } from 'hooks'
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
      setOp,
      udfType,
      udfSelectedRowKeys,
      setUdfColumnSettings,
      setUdfSelectedRowKeys,
      udfStorageKey,
      // : columnSettings
    },
  } = useStore()

  const mutation = useMutationUdf()

  const { defaultColumns, setFilter, refetch } = props

  return (
    <div tw="mb-3">
      <FlexBox tw="justify-between">
        <Center tw="space-x-3">
          <Button type="primary" onClick={() => setOp('create')}>
            <Icon name="upload" />
            新建{udfType}函数节点
          </Button>
          <Button
            disabled={!udfSelectedRowKeys.length}
            onClick={() =>
              mutation.mutate(
                {
                  op: 'delete',
                  udf_ids: udfSelectedRowKeys,
                },
                {
                  onSuccess: () => {
                    setUdfSelectedRowKeys([])
                    refetch()
                  },
                }
              )
            }
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
              })
            }}
            onClear={() => {
              setFilter((_) => {
                _.search = ''
              })
            }}
          />
          <Button tw="w-8">
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
  )
})

export default TableToolBar
