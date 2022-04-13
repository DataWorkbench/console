import { useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import { findKey, get, pick, isEmpty } from 'lodash-es'
import { Form, Icon } from '@QCFE/lego-ui'
import {
  AffixLabel,
  FlexBox,
  Center,
  ArrowLine,
  SelectWithRefresh,
  ConditionParameterField,
  ButtonWithClearField,
  HelpCenterLink,
  SqlGroupField,
} from 'components'
import {
  useStore,
  useQuerySourceTables,
  useQuerySourceTableSchema,
} from 'hooks'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { dataSourceTypes } from '../job/JobUtils'

const { TextField, SelectField, TextAreaField } = Form

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
          ${tw`w-28 pr-0`}
        }
        .select,
        .input {
          ${tw`w-full`}
        }
        .select-with-refresh {
          ${tw`w-2/3 flex max-w-[376px]`}
          .select {
            ${tw`flex-1`}
          }
        }
      }
      .help {
        ${tw`ml-28`}
      }
    }
  `,
  tableSelect: [
    tw`w-full flex-1`,
    css`
      .help {
        ${tw`w-full`}
      }
    `,
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`],
}

const Label = styled('div')(() => [
  tw`border border-white px-2 py-1 leading-none rounded-[3px]`,
])

const DashedLine = styled('div')(() => [
  tw`border-neut-13 border-l border-dashed my-1`,
])

const StyledSqlGroupField = styled(SqlGroupField)(() => [
  css`
    &.field {
      .label {
        ${tw`self-start pt-2`}
      }
      .textarea {
        ${tw`w-[378px]!`}
      }
    }
  `,
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
  const [showSourceAdvance, setShowSourceAdvance] = useState(false)
  const [showTargetAdvanced, setShowTargetAdvanced] = useState<boolean>(false)
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

  const schemaRet = useQuerySourceTableSchema(
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

  const handleClick = (from: OpType) => {
    op.current = from
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

  const handleTableChange = (from: OpType, v: string) => {
    op.current = from
    setDB((draft) => {
      draft[from].tableName = v
    })
  }

  const handleClear = (from: OpType) => {
    setDB((draft) => {
      if (from === 'source') {
        draft.source = {}
      } else {
        draft.target = {}
      }
    })
    onFetchedFields(from, [])
  }

  const getSourceTypeName = (type: OpType) =>
    findKey(dataSourceTypes, (v) => v === get(curJob, `${type}_type`))

  const getJobTypeName = (type: 0 | 1 | 2 | 3) => {
    const typeNameMap = new Map([
      [0, '离线 - 全量'],
      [1, '离线 - 增量'],
      [2, '实时 - 全量'],
      [3, '实时 - 增量'],
    ])
    return typeNameMap.get(type)
  }

  const renderCommon = (from: OpType) => {
    const dbInfo = db[from]
    const isSelected = !isEmpty(dbInfo)
    const tables = (get(tablesRet, 'data.items', []) || []) as string[]
    return (
      <>
        <ButtonWithClearField
          name="source"
          placeholder="选择数据来源"
          css={css`
            .help {
              width: 100%;
            }
          `}
          label={<AffixLabel>数据源</AffixLabel>}
          help={isSelected && <div>网络配置名称（ID：{dbInfo.networkId}）</div>}
          icon={
            <Icon
              name="blockchain"
              size={16}
              color={{ secondary: 'rgba(255,255,255,0.4)' }}
            />
          }
          value={dbInfo.id}
          clearable={isSelected}
          onClick={() => handleClick(from)}
          onClear={() => handleClear(from)}
        >
          <Center tw="space-x-1">
            <span tw="ml-1">{dbInfo.name}</span>
            <span tw="text-neut-8">(ID:{dbInfo.id})</span>
          </Center>
        </ButtonWithClearField>
        {isSelected && (
          <SelectWithRefresh
            css={styles.tableSelect}
            name="table"
            label={<AffixLabel>数据源表</AffixLabel>}
            options={tables.map((tabName) => ({
              label: tabName,
              value: tabName,
            }))}
            isLoading={tablesRet.isFetching && op.current === from}
            clearable={false}
            onRefresh={() => {
              op.current = from
              tablesRet.refetch()
            }}
            onChange={(v: string) => {
              handleTableChange(from, v)
            }}
            help={
              <HelpCenterLink href="xxx" hasIcon>
                {`${getSourceTypeName(from)} ${
                  from === 'source' ? 'Source' : 'Sink'
                }
                  配置文档`}
              </HelpCenterLink>
            }
          />
        )}
      </>
    )
  }

  const renderSource = () => {
    const from: OpType = 'source'
    const hasTable = !isEmpty(db.source.tableName)
    const isOffLineFull = get(curJob, 'type') === 0
    const isOfflineIncrement = get(curJob, 'type') === 1
    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon(from)}
        {hasTable && isOfflineIncrement && (
          <>
            <ConditionParameterField
              name="condition"
              columns={(get(db, 'source.fields') || []).map(
                (c: { name: string; [k: string]: any }) => c.name
              )}
              label={<AffixLabel>条件参数配置</AffixLabel>}
              loading={op.current === from && schemaRet.isFetching}
              onRefresh={() => {
                schemaRet.refetch()
              }}
            />
            <TextField
              name="divide"
              label="切分键"
              placeholder="推荐使用表主键，仅支持整型数据切分"
              help="如果通道设置中作业期望最大并发数大于 1 时必须配置此参数"
            />
          </>
        )}
        {/* <div>
          <Button
            onClick={() => {
              if (sourceForm.current) {
                // console.logschemaRet((sourceForm.current as Form)?.getFieldsValue())
              }
            }}
          >
            验证
          </Button>
        </div> */}
        {hasTable && isOffLineFull && (
          <>
            <FlexBox>
              <div css={styles.line} />
              <Center
                tw="px-1 cursor-pointer"
                onClick={() => setShowSourceAdvance((prev) => !prev)}
              >
                <Icon
                  name={`chevron-${showSourceAdvance ? 'up' : 'down'}`}
                  type="light"
                />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>
            {showSourceAdvance && (
              <TextAreaField
                label="过滤条件"
                placeholder="where 过滤语句（不要填写 where 关键字）。注：需填写 SQL 合法 where 子句。例：col1>10 and col1<30"
              />
            )}
          </>
        )}
      </Form>
    )
  }

  const renderTarget = () => {
    const from: OpType = 'target'
    const hasTable = !isEmpty(db.target.tableName)
    return (
      <Form css={styles.form}>
        {renderCommon(from)}
        {hasTable && (
          <>
            <SelectField
              label={<AffixLabel>写入模式</AffixLabel>}
              name="mode"
              options={[]}
              help="当主键/唯一性索引冲突时会写不进去冲突的行，以脏数据的形式体现"
            />
            <SelectField
              label={<AffixLabel>写入一致性语义</AffixLabel>}
              name="semantic"
              options={[]}
            />
            <TextField
              label={<AffixLabel>批量写入条数</AffixLabel>}
              name="batch"
              help="范围：1~65535，该值可减少网络交互次数，过大会造成 OOM"
            />
            <FlexBox>
              <div css={styles.line} />
              <Center
                tw="px-1 cursor-pointer"
                onClick={() => setShowTargetAdvanced((prev) => !prev)}
              >
                <Icon
                  name={`chevron-${showTargetAdvanced ? 'up' : 'down'}`}
                  type="light"
                />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>
            {showTargetAdvanced && (
              <>
                <StyledSqlGroupField
                  className="sql-group-field"
                  name="sql"
                  label="写入前SQL语句组"
                  size={2}
                  placeholder="请输入写入数据到目的表前执行的一组标准 SQL 语句"
                />
                <StyledSqlGroupField
                  className="sql-group-field"
                  name="sql"
                  label="写入后SQL语句组"
                  size={1}
                  placeholder="请输入写入数据到目的表前执行的一组标准 SQL 语句"
                />
              </>
            )}
          </>
        )}
      </Form>
    )
  }

  return (
    <FlexBox tw="flex-col">
      <Center tw="mb-[-15px]">
        <Center css={styles.arrowBox}>
          <Label>来源: {getSourceTypeName('source')}</Label>
          <ArrowLine />
          <Label>{curJob && getJobTypeName(curJob.type)}</Label>
          <ArrowLine />
          <Label>目的: {getSourceTypeName('target')}</Label>
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
        sourceType={get(curJob, `${op.current}_type`)!}
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
