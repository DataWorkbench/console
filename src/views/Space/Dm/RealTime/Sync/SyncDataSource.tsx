import {
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  useEffect,
} from 'react'
import { observer } from 'mobx-react-lite'
import tw, { css, styled } from 'twin.macro'
import { useImmer } from 'use-immer'
import {
  findKey,
  get,
  pick,
  isEmpty,
  isEqual,
  trim,
  camelCase,
  keys,
} from 'lodash-es'
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
  TConditionParameterVal,
  PopConfirm,
} from 'components'
import {
  useStore,
  useQuerySourceTables,
  useQuerySourceTableSchema,
} from 'hooks'
import DataSourceSelectModal from 'views/Space/Upcloud/DataSourceList/DataSourceSelectModal'
import { dataSourceTypes, DataSourceType, SyncJobType } from '../Job/JobUtils'

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
        ${tw`ml-28 w-full`}
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

type JobType = 1 | 2 | 3

enum WriteMode {
  Insert = 1,
  Replace = 2,
  Update = 3,
}

enum Semantic {
  'AtLeastOnce' = 1,
  'ExactlyOnce' = 2,
}

interface Column {
  type: string
  name: string
  is_primary_key?: boolean
}

interface ResInfo {
  source: {
    id?: string
    name?: string
    networkId?: string
    columns?: Column[]
    tableName?: string
    condition?: TConditionParameterVal
    splitPk?: string
    where?: string
  }
  target: {
    id?: string
    name?: string
    networkId?: string
    columns?: Column[]
    tableName?: string
    writeMode?: WriteMode
    semantic?: Semantic
    batchSize?: number
    postSql?: string[] | null
    preSql?: string[] | null
  }
}

type SyncResKey = `${Lowercase<DataSourceType>}_${OpType}`

interface SyncDataSourceProps {
  onDbChange?: (tp: OpType, data: ResInfo[keyof ResInfo]) => void
  onSelectTable?: (
    tp: OpType,
    tableName: string,
    data: Record<string, any>[],
    item: Record<string, any>
  ) => void
  conf?: {
    source_id?: string
    target_id?: string
    sync_resource?: Record<SyncResKey, any>
  }
  curJob?: Record<string, any>
}

const SyncDataSource = observer(
  (props: SyncDataSourceProps, ref) => {
    const { onSelectTable, onDbChange, conf, curJob: curJobProp } = props
    const {
      workFlowStore: { curJob: curJobStore },
    } = useStore()
    const curJob = curJobProp ?? curJobStore
    const [visible, setVisible] = useState<boolean | null>(null)
    const [showSourceAdvance, setShowSourceAdvance] = useState(false)
    const [showTargetAdvanced, setShowTargetAdvanced] = useState<boolean>(false)
    const sourceForm = useRef(null)
    const targetForm = useRef(null)
    const op = useRef<OpType>('source')
    const [db, setDB] = useImmer<ResInfo>({
      source: {},
      target: {},
    })

    const [sourceTypeName, targetTypeName] = useMemo(() => {
      const sourceType = curJob?.source_type
      const targetType = curJob?.target_type
      return [
        findKey(dataSourceTypes, (v) => v === sourceType),
        findKey(dataSourceTypes, (v) => v === targetType),
      ]
    }, [curJob])

    const sourceTablesRet = useQuerySourceTables(
      { sourceId: db.source.id! },
      { enabled: !!db.source.id }
    )

    const targetTablesRet = useQuerySourceTables(
      { sourceId: db.target.id! },
      { enabled: !!db.target.id }
    )

    const sourceColumnRet = useQuerySourceTableSchema(
      {
        sourceId: db.source.id!,
        tableName: db.source.tableName!,
      },
      {
        enabled: !!(db.source.id && db.source.tableName),
        onSuccess: (data: any) => {
          const columns = get(data, 'schema.columns') || []
          setDB((draft) => {
            draft.source.columns = columns
          })
          if (onSelectTable) {
            onSelectTable('source', db.source.tableName!, columns, db.source)
          }
        },
      },
      'source'
    )

    const { refetch: targetRefetch } = useQuerySourceTableSchema(
      {
        sourceId: db.target.id!,
        tableName: db.target.tableName!,
      },
      {
        enabled: !!(db.target.id && db.target.tableName),
        onSuccess: (data: any) => {
          const columns = get(data, 'schema.columns') || []
          setDB((draft) => {
            draft.target.columns = columns
          })
          if (onSelectTable) {
            onSelectTable('target', db.target.tableName!, columns, db.target)
          }
        },
      },
      'source'
    )

    useImperativeHandle(ref, () => ({
      refetchColumns: () => {
        if (db.source.id && db.source.tableName) {
          sourceColumnRet.refetch()
        }
        if (db.target.id && db.target.tableName) {
          targetRefetch()
        }
      },
      getResource: () => {
        const srcform = sourceForm.current as any
        const tgtform = targetForm.current as any

        if (srcform?.validateForm() && tgtform?.validateForm()) {
          const sourceKey = `${sourceTypeName!.toLowerCase()}_source`
          const targetKey = `${targetTypeName!.toLowerCase()}_target`
          const { condition } = db.source
          const config = {
            source_id: db.source.id,
            target_id: db.target.id,
            sync_resource: {
              [sourceKey]: {
                table: [db.source.tableName],
                schema: '',
                where: db.source.where,
                split_pk: db.source.splitPk,
                condition_type: condition?.type,
                visualization: {
                  column: condition?.column,
                  start_condition: condition?.startCondition,
                  start_value: condition?.startValue,
                  end_condition: condition?.endCondition,
                  end_value: condition?.endValue,
                },
                express: condition?.expression,
              },
              [targetKey]: {
                table: [db.target.tableName],
                write_mode: db.target.writeMode,
                semantic: db.target.semantic,
                batch_size: db.target.batchSize,
                pre_sql: db.target.preSql?.filter((v) => v !== ''),
                post_sql: db.target.postSql?.filter((v) => v !== ''),
              },
            },
          }

          return config
        }

        return null
      },
      getTypeNames: () => [sourceTypeName, targetTypeName],
    }))

    useEffect(() => {
      if (conf && conf.source_id) {
        const dbSource = get(
          conf,
          `sync_resource.${sourceTypeName!.toLowerCase()}_source`
        )
        const dbTarget = get(
          conf,
          `sync_resource.${targetTypeName!.toLowerCase()}_target`
        )
        const visualization = get<Record<string, string>>(
          dbSource,
          'visualization',
          {}
        )
        const condition: any = {}
        keys(visualization).forEach((v) => {
          condition[camelCase(v)] = visualization[v]
        })
        const newDB = {
          source: {
            id: conf.source_id,
            tableName: get(dbSource, 'table[0]', ''),
            condition,
            where: trim(get(dbSource, 'where', '')),
            splitPk: get(dbSource, 'split_pk', ''),
          },
          target: {
            id: conf.target_id,
            tableName: get(dbTarget, 'table[0]', ''),
            writeMode: get(dbTarget, 'write_mode', ''),
            semantic: get(dbTarget, 'semantic', ''),
            batchSize: get(dbTarget, 'batch_size', ''),
            postSql: get(dbTarget, 'post_sql', []),
            preSql: get(dbTarget, 'pre_sql', []),
          },
        }
        setDB(newDB)
        if (
          newDB.target.postSql?.length > 0 ||
          newDB.target.preSql?.length > 0
        ) {
          setShowTargetAdvanced(true)
        }
        if (newDB.source.where) {
          setShowSourceAdvance(true)
        }
      }
    }, [conf, setDB, sourceTypeName, targetTypeName])

    // console.log(db)

    const handleClick = (from: OpType) => {
      op.current = from
      setVisible(true)
    }

    const handleSelectDb = (v: Partial<ResInfo[OpType]>) => {
      setDB((draft) => {
        draft[op.current] = v
      })

      if (onDbChange) {
        onDbChange(op.current, v)
      }
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
      if (onDbChange) {
        onDbChange(from, {})
      }
    }

    const getJobTypeName = (type: JobType) => {
      const typeNameMap = new Map([
        [1, '离线 - 全量'],
        [2, '离线 - 增量'],
        [3, '实时'],
      ])
      return typeNameMap.get(type)
    }

    const renderCommon = (from: OpType) => {
      const dbInfo = db[from]
      const isSelected = !isEmpty(dbInfo)
      const tablesRet = from === 'source' ? sourceTablesRet : targetTablesRet
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
            help={
              isSelected &&
              dbInfo.networkId && (
                <div>网络配置名称（ID：{dbInfo.networkId}）</div>
              )
            }
            popConfirm={
              <PopConfirm
                type="warning"
                content="移除数据源会清空所数据源表、条件参数配置、字段映射等所有信息，请确认是否移除？"
              />
            }
            icon={
              <Icon
                name="blockchain"
                size={16}
                color={{ secondary: 'rgba(255,255,255,0.4)' }}
              />
            }
            value={dbInfo.id}
            validateOnChange
            clearable={isSelected}
            onClick={() => handleClick(from)}
            onClear={() => handleClear(from)}
            schemas={[
              {
                help: '请选择数据来源',
                status: 'error',
                rule: (v?: string) => !!v,
              },
            ]}
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
              validateOnChange
              value={dbInfo.tableName}
              {...(!tables.length &&
              !(tablesRet.isFetching && op.current === from)
                ? {
                    validateStatus: 'error',
                    validateHelp: (
                      <div>
                        当前数据源不可用，请前往{' '}
                        <HelpCenterLink
                          hasIcon
                          isIframe={false}
                          href="/manual/source_data/add_data/"
                        >
                          数据源管理
                        </HelpCenterLink>{' '}
                        页面配置
                      </div>
                    ),
                  }
                : {})}
              schemas={[
                {
                  help: '请选择数据源表',
                  status: 'error',
                  rule: (v?: string) => !!v,
                },
                // todo:当前数据源不可用，请前往 [数据源管理] 页面配置
              ]}
              help={
                <HelpCenterLink
                  href={`/manual/integration_job/cfg_source/
                    ${from === 'source' ? sourceTypeName : targetTypeName}
                  /`.toLowerCase()}
                  hasIcon
                  isIframe
                >
                  {from === 'source'
                    ? `${sourceTypeName} Source `
                    : `${targetTypeName} Sink `}
                  配置文档
                </HelpCenterLink>
              }
            />
          )}
        </>
      )
    }

    const renderSource = () => {
      const from: OpType = 'source'
      const dbInfo = db[from]
      const hasTable = !isEmpty(dbInfo.tableName)
      const isOffLineFull = get(curJob, 'type') === SyncJobType.OFFLINEFULL
      const isOfflineIncrement =
        get(curJob, 'type') === SyncJobType.OFFLINEINCREMENT
      const schemaRet = sourceColumnRet
      return (
        <Form css={styles.form} ref={sourceForm}>
          {renderCommon(from)}
          {hasTable && isOfflineIncrement && (
            <ConditionParameterField
              name="condition"
              columns={(db.source.columns || []).map((c) => c.name)}
              label={<AffixLabel>条件参数配置</AffixLabel>}
              loading={op.current === from && schemaRet.isFetching}
              onRefresh={() => {
                schemaRet.refetch()
              }}
              value={dbInfo.condition}
              onChange={(v: any) => {
                setDB((draft) => {
                  draft.source.condition = v
                })
              }}
              css={css`
                .help {
                  ${tw`w-full`}
                }
              `}
              validateOnChange={
                dbInfo.condition &&
                !isEqual(dbInfo.condition, { type: 1 }) &&
                !isEqual(dbInfo.condition, { type: 2 })
              }
              schemas={[
                {
                  help: '条件参数未配置',
                  status: 'error',
                  rule: (v: TConditionParameterVal) => {
                    let valid = false
                    if (v.type === 2) {
                      valid = !isEmpty(v.expression)
                    } else {
                      valid =
                        !isEmpty(v.startValue) &&
                        !isEmpty(v.endValue) &&
                        !isEmpty(v.startCondition) &&
                        !isEmpty(v.endCondition) &&
                        !isEmpty(v.column)
                    }

                    return valid
                  },
                },
              ]}
            />
          )}
          {hasTable && (
            <TextField
              name="split_pk"
              label="切分键"
              placeholder="推荐使用表主键，仅支持整型数据切分"
              help="如果通道设置中作业期望最大并行数大于 1 时必须配置此参数"
              value={dbInfo.splitPk || ''}
              onChange={(v: string) => {
                setDB((draft) => {
                  draft[from].splitPk = v
                })
              }}
            />
          )}
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
                  name="where"
                  value={dbInfo.where || ''}
                  onChange={(v: string) => {
                    setDB((draft) => {
                      draft.source.where = v
                    })
                  }}
                  validateOnChange
                  schemas={[
                    {
                      help: '过滤条件不能包含 where',
                      status: 'error',
                      rule: (v: string) => {
                        if (v && v.includes('where ')) {
                          return false
                        }
                        return true
                      },
                    },
                    {
                      help: '不能存在多条过滤条件',
                      status: 'error',
                      rule: (v: string) => {
                        if (
                          v.trim() &&
                          v.trim().split(';').filter(Boolean).length > 1
                        ) {
                          return false
                        }
                        return true
                      },
                    },
                  ]}
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
      const dbInfo = db[from]
      const hasTable = !isEmpty(db.target.tableName)
      return (
        <Form css={styles.form} ref={targetForm}>
          {renderCommon(from)}
          {hasTable && (
            <>
              <SelectField
                label={<AffixLabel>写入模式</AffixLabel>}
                name="write_mode"
                options={[
                  { label: 'insert 插入', value: WriteMode.Insert },
                  { label: 'replace 替换', value: WriteMode.Replace },
                  {
                    label: 'update 更新插入',
                    value: WriteMode.Update,
                  },
                ]}
                value={dbInfo.writeMode}
                schemas={[
                  {
                    help: '请选择写入模式',
                    status: 'error',
                    rule: { required: true },
                  },
                ]}
                validateOnChange
                onChange={(v: WriteMode) => {
                  setDB((draft) => {
                    draft[from].writeMode = +v
                  })
                }}
                help="当主键/唯一性索引冲突时会写不进去冲突的行，以脏数据的形式体现"
              />
              <SelectField
                label={<AffixLabel>写入一致性语义</AffixLabel>}
                name="semantic"
                value={dbInfo.semantic}
                options={[
                  {
                    label: 'exactly-once 正好一次',
                    value: Semantic.ExactlyOnce,
                  },
                  {
                    label: 'at-least-once 至少一次',
                    value: Semantic.AtLeastOnce,
                  },
                ]}
                onChange={(v: Semantic) => {
                  setDB((draft) => {
                    draft[from].semantic = +v
                  })
                }}
                validateOnChange
                schemas={[
                  {
                    help: '请选择写入模式',
                    status: 'error',
                    rule: { required: true },
                  },
                ]}
              />
              <TextField
                label={<AffixLabel>批量写入条数</AffixLabel>}
                name="batchSize"
                help="范围: 1~65535, 该值可减少网络交互次数, 过大会造成 OOM"
                validateOnChange
                css={css`
                  input.input {
                    ${tw`w-28!`}
                  }
                `}
                value={dbInfo.batchSize || ''}
                onChange={(v: string) => {
                  setDB((draft) => {
                    draft[from].batchSize = +v
                  })
                }}
                schemas={[
                  {
                    help: '批量写入条数不能为空',
                    status: 'error',
                    rule: { required: true },
                  },
                  {
                    help: '范围: 1~65535, 批量写入条数不能小于 1',
                    status: 'error',
                    rule: (v: any) =>
                      /^[1-9]+[0-9]*$/.test(`${v}`) && v > 0 && v <= 65535,
                  },
                ]}
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
                    name="pre_sql"
                    label="写入前SQL语句组"
                    size={2}
                    onChange={(v: string[]) => {
                      setDB((draft) => {
                        draft[from].preSql = v
                      })
                    }}
                    value={dbInfo.preSql}
                    placeholder="请输入写入数据到目的表前执行的一组标准 SQL 语句"
                  />
                  <StyledSqlGroupField
                    className="sql-group-field"
                    name="post_sql"
                    value={dbInfo.postSql}
                    label="写入后SQL语句组"
                    size={1}
                    onChange={(v: string[]) => {
                      setDB((draft) => {
                        draft[from].postSql = v
                      })
                    }}
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
            <Label>来源: {sourceTypeName}</Label>
            <ArrowLine />
            <Label>{curJob && getJobTypeName(curJob.type)}</Label>
            <ArrowLine />
            <Label>目的: {targetTypeName}</Label>
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
  },
  { forwardRef: true }
)

export default SyncDataSource
