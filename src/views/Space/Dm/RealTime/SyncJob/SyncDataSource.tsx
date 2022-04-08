import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { findKey, get, pick, isEmpty } from 'lodash-es'
import { Form, Icon, Button } from '@QCFE/lego-ui'
import {
  AffixLabel,
  FlexBox,
  Center,
  ArrowLine,
  SelectWithRefresh,
  ConditionParameterField,
  ButtonWithClearField,
} from 'components'
import {
  useStore,
  useQuerySourceTables,
  useQuerySourceTableSchema,
} from 'hooks'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { dataSourceTypes } from '../JobUtils'

const { TextField } = Form

const styles = {
  arrowBox: tw`space-x-2 bg-neut-17 w-[70%] z-10`,
  dashedBox: tw`border border-dashed rounded-md border-neut-13 py-0`,
  dashedSplit: tw`border-neut-13 border-l border-dashed my-1`,
  form: css`
    &.form.is-horizon-layout {
      ${tw`px-3 flex-1 mt-6 mb-3 space-y-2 min-w-[445px]`}
      > .field {
        ${tw`mb-0`}
        > .label {
          ${tw`w-28`}
        }
      }
      .help {
        ${tw`ml-28`}
      }
    }
  `,
  tableSelect: [tw`w-full flex-1`],
}

const Label = styled('div')(() => [
  tw`border border-white px-2 py-1 leading-none rounded-[3px]`,
])

const DashedLine = styled('div')(() => [
  tw`border-neut-13 border-l border-dashed my-1`,
])

type OpType = 'source' | 'target'

type IDB = {
  [k in OpType]: {
    id?: string
    name?: string
    networkId?: string
    tableName?: string
    fields?: string[]
  }
}

interface SyncDataSourceProps {
  onFetchedFields: (tp: OpType, data: Record<string, any>[]) => void
}

const SyncDataSource = observer((props: SyncDataSourceProps) => {
  const { onFetchedFields } = props
  const [visible, setVisible] = useState<boolean | null>(null)
  const sourceForm = useRef(null)
  const op = useRef<OpType>('source')
  const [db, setDB] = useImmer<IDB>({
    source: {},
    target: {},
  })

  const { id: sourceId = '', tableName = '' } = db[op.current]

  const tablesRet = useQuerySourceTables(
    { sourceId },
    { enabled: sourceId !== '' }
  )

  useQuerySourceTableSchema(
    {
      sourceId,
      tableName,
    },
    {
      enabled: sourceId !== '' && tableName !== '',
      onSuccess: (data: any) => {
        const columns = get(data, 'schema.columns') || []
        setDB((draft) => {
          draft[op.current].fields = columns
        })
        onFetchedFields(op.current, columns)
      },
    }
  )

  const {
    workFlowStore: { curJob },
  } = useStore()

  const handleClick = (v: OpType) => {
    op.current = v
    setVisible(true)
  }

  const handleSelectDb = (v: {
    id: string
    name: string
    networkId: string
  }) => {
    setDB((draft) => {
      draft[op.current] = v
    })
  }

  const handleTableChange = (tp: OpType, v: string) => {
    op.current = tp
    setDB((draft) => {
      draft[tp].tableName = v
    })
  }

  const handleClear = (tp: OpType) => {
    setDB((draft) => {
      if (tp === 'source') {
        draft.source = {}
      } else {
        draft.target = {}
      }
    })
    onFetchedFields(tp, [])
  }

  const getSourceName = (type: OpType) =>
    findKey(dataSourceTypes, (v) => v === get(curJob, `${type}_type`))

  const renderCommon = (tp: OpType) => {
    const dbInfo = get(db, tp)
    const hasDbInfo = !isEmpty(dbInfo)
    const tables = (get(tablesRet, 'data.items', []) || []) as string[]
    return (
      <>
        <ButtonWithClearField
          name="source"
          placeholder={
            <>
              <Icon
                name="blockchain"
                size={16}
                color={{ secondary: 'rgba(255,255,255,0.4)' }}
              />
              <span>选择数据来源</span>
            </>
          }
          css={css`
            .help {
              width: 100%;
            }
          `}
          label={<AffixLabel>数据源</AffixLabel>}
          help={hasDbInfo && <div>网络配置名称（ID：{dbInfo.networkId}）</div>}
          value={dbInfo.id}
          onClick={() => handleClick(tp)}
          onClear={() => handleClear(tp)}
        >
          {hasDbInfo && (
            <FlexBox tw="items-center space-x-1">
              <Icon
                name="blockchain"
                size={16}
                color={{ secondary: 'rgba(255,255,255,0.4)' }}
              />
              <span tw="ml-1">{dbInfo.name}</span>
              <span tw="text-neut-8">(ID:{dbInfo.id})</span>
            </FlexBox>
          )}
        </ButtonWithClearField>
        {hasDbInfo && (
          <SelectWithRefresh
            css={styles.tableSelect}
            name="table"
            label={<AffixLabel>数据源表</AffixLabel>}
            options={tables.map((f) => ({
              label: f,
              value: f,
            }))}
            isLoading={tablesRet.isFetching && op.current === tp}
            clearable={false}
            onRefresh={() => {
              // setOp(tp)
              op.current = tp
              tablesRet.refetch()
            }}
            onChange={(v: string) => {
              handleTableChange(tp, v)
            }}
          />
        )}
      </>
    )
  }

  const renderSource = () => {
    const tp: OpType = 'source'
    const hasFields = get(db, 'source.fields', []).length > 0
    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon(tp)}
        {hasFields && (
          <>
            <ConditionParameterField
              name="condition"
              columns={(get(db, 'source.fields') || []).map(
                (c: { name: string; [k: string]: any }) => c.name
              )}
              label={<AffixLabel>条件参数配置</AffixLabel>}
            />
            <TextField
              name="divide"
              label="切分键"
              placeholder="推荐使用表主键，仅支持整型数据切分"
              help="如果通道设置中作业期望最大并发数大于 1 时必须配置此参数"
            />
          </>
        )}
        <div>
          <Button
            onClick={() => {
              if (sourceForm.current) {
                // console.logschemaRet((sourceForm.current as Form)?.getFieldsValue())
              }
            }}
          >
            验证
          </Button>
        </div>
      </Form>
    )
  }

  const renderTarget = () => {
    const tp: OpType = 'target'
    return <Form css={styles.form}>{renderCommon(tp)}</Form>
  }

  return (
    <FlexBox tw="flex-col">
      <Center tw="mb-[-15px]">
        <Center css={styles.arrowBox}>
          <Label>来源: {getSourceName('source')}</Label>
          <ArrowLine />
          <Label>离线-增量</Label>
          <ArrowLine />
          <Label>目的: {getSourceName('target')}</Label>
        </Center>
      </Center>
      <FlexBox css={styles.dashedBox}>
        {renderSource()}
        <DashedLine />
        {renderTarget()}
      </FlexBox>
      <DataSourceSelectModal
        title={`选择${
          op.current === 'source' ? '来源' : '目的'
        }数据源（已选类型为 ${findKey(
          dataSourceTypes,
          (v) => v === get(curJob, `${op.current}_type`)
        )})`}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={(v: any) => {
          setVisible(false)
          if (v) {
            handleSelectDb({
              ...pick(v, ['id', 'name']),
              networkId: get(v, 'last_connection.network_id', ''),
            })
          }
        }}
      />
    </FlexBox>
  )
})

export default SyncDataSource
