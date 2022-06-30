import { Form, Icon } from '@QCFE/qingcloud-portal-ui'
import tw, { css, styled } from 'twin.macro'
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import {
  baseTarget$,
  confColumns$,
  target$,
  targetColumns$,
} from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get, isEmpty } from 'lodash-es'
import { AffixLabel, Center, FlexBox, SqlGroupField } from 'components'
import {
  DbType,
  sourceKinds,
  SourceType,
} from 'views/Space/Upcloud/DataSourceList/constant'
import { useQuerySourceTableSchema } from 'hooks'
import BaseTableComponent from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseTableComponent'
import {
  IDataSourceConfigProps,
  ISourceRef,
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { useImmer } from 'use-immer'

const { TextField, SelectField } = Form

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

const styles = {
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

enum WriteMode {
  Insert = 1,
  Replace = 2,
  Update = 3,
}

const getWriteMode = (type?: SourceType) => {
  switch (type) {
    case SourceType.Mysql:
      return [WriteMode.Insert, WriteMode.Replace, WriteMode.Update]
    case SourceType.PostgreSQL:
      return [WriteMode.Insert, WriteMode.Update]
    case SourceType.ClickHouse:
      return [WriteMode.Insert]
    case SourceType.SqlServer:
      return [WriteMode.Insert, WriteMode.Update]
    default:
      return []
  }
}

enum Semantic {
  'AtLeastOnce' = 1,
  'ExactlyOnce' = 2,
}

const getExactly = (types?: SourceType[]) => {
  const sql = new Set(
    sourceKinds.filter((i) => i.type === DbType.Sql).map((i) => i.source_type)
  )
  if (types?.every((i) => sql.has(i))) {
    return [Semantic.ExactlyOnce, Semantic.AtLeastOnce]
  }
  return [Semantic.AtLeastOnce]
}

const BaseTargetConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const { curJob } = props
    const targetForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Record<string, any> | null>({})

    const [showTargetAdvanced, setShowTargetAdvanced] = useState<boolean>(false)

    useLayoutEffect(() => {
      const unSub = baseTarget$.subscribe((e) => {
        setDbInfo(e?.data)
        if (e?.data?.postSql?.length) {
          setShowTargetAdvanced(true)
        }
      })

      return () => {
        unSub.unsubscribe()
      }
    }, [setDbInfo])
    console.log(dbInfo)

    const sourceType = target$.getValue()?.sourceType

    const { refetch } = useQuerySourceTableSchema(
      {
        sourceId: dbInfo?.id!,
        tableName: dbInfo?.tableName!,
      },
      {
        enabled: !!(dbInfo?.id && dbInfo?.tableName),
        onSuccess: (data: any) => {
          const columns = get(data, 'schema.columns') || []
          targetColumns$.next(
            columns.map((i) => ({
              ...i,
              uuid: `target--${i.name}`,
            }))
          )
        },
      },
      'source'
    )

    const handleUpdate = (e: Record<string, any>) => {
      baseTarget$.next({ data: { ...dbInfo, ...e }, sourceType })
      confColumns$.next([])
    }

    const renderCommon = () => {
      return <BaseConfigCommon from="target" />
    }

    console.log(dbInfo?.tableName)
    const hasTable = !isEmpty(dbInfo?.tableName)

    useImperativeHandle(ref, () => {
      return {
        validate: () => {
          if (!targetForm.current) {
            return false
          }
          return targetForm.current?.validateForm()
        },
        getData: () => {
          const target = baseTarget$.getValue()
          if (!target || !target.data) {
            return undefined
          }
          return {
            table: [target.data.tableName],
            write_mode: target.data.writeMode,
            semantic: target.data.semantic,
            batch_size: target.data.batchSize,
            pre_sql: target.data.preSql?.filter((v) => v !== ''),
            post_sql: target.data.postSql?.filter((v) => v !== ''),
          }
        },
        refetchColumn: () => {
          refetch()
        },
      }
    })

    const renderBaseTable = () => {
      return (
        <BaseTableComponent
          from="target"
          sourceType={sourceType?.label}
          sourceId={dbInfo?.id}
          tableName={dbInfo?.tableName}
          onChange={(v) => {
            console.log(v)
            setDbInfo((draft) => {
              draft.tableName = v
            })
          }}
        />
      )
    }

    return (
      <Form css={styles.form} ref={targetForm}>
        {renderCommon()}
        {renderBaseTable()}
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
              ].filter((i) =>
                getWriteMode(curJob?.target_type).includes(i.value)
              )}
              value={dbInfo?.writeMode}
              schemas={[
                {
                  help: '请选择写入模式',
                  status: 'error',
                  rule: { required: true },
                },
              ]}
              validateOnChange
              onChange={(v: WriteMode) => {
                handleUpdate({ writeMode: +v })
              }}
              help={(() => {
                let helpStr = ''
                switch (dbInfo?.writeMode) {
                  case WriteMode.Insert:
                    helpStr =
                      '当主键/唯一性索引冲突时会写不进去冲突的行，以脏数据的形式体现。'
                    break
                  case WriteMode.Replace:
                    helpStr =
                      '没有遇到主键/唯一性索引冲突时，与 insert into 行为一致。冲突时会用新行替换已经指定的字段的语句。'
                    break
                  case WriteMode.Update:
                    helpStr =
                      '没有遇到主键/唯一性索引冲突时，与 insert into 行为一致。冲突时会先删除原有行，再插入新行。即新行会替换原有行的所有字段。'
                    break
                  default:
                    break
                }
                return helpStr
              })()}
            />
            <SelectField
              label={<AffixLabel>写入一致性语义</AffixLabel>}
              name="semantic"
              value={dbInfo?.semantic}
              options={[
                {
                  label: 'exactly-once 正好一次',
                  value: Semantic.ExactlyOnce,
                },
                {
                  label: 'at-least-once 至少一次',
                  value: Semantic.AtLeastOnce,
                },
              ].filter((i) =>
                getExactly([curJob?.source_type, curJob?.target_type]).includes(
                  i.value
                )
              )}
              onChange={(v: Semantic) => {
                handleUpdate({ semantic: +v })
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
              value={dbInfo?.batchSize || ''}
              onChange={(v: string) => {
                handleUpdate({ batchSize: +v })
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
                    handleUpdate({ preSql: v })
                  }}
                  value={dbInfo?.preSql}
                  validateOnChange
                  placeholder="请输入写入数据到目的表前执行的一组标准 SQL 语句"
                  schemas={[
                    {
                      rule: (arr: string[]) => {
                        return (arr || []).every((v) => {
                          if (!v) {
                            return true
                          }
                          if (
                            v.trim() &&
                            v.trim().split(';').filter(Boolean).length > 1
                          ) {
                            return false
                          }
                          return true
                        })
                      },
                      help: '单条语句只能包含一个 SQL 命令',
                      status: 'error',
                    },
                  ]}
                />
                <StyledSqlGroupField
                  className="sql-group-field"
                  name="post_sql"
                  value={dbInfo?.postSql}
                  label="写入后SQL语句组"
                  size={1}
                  validateOnChange
                  onChange={(v: string[]) => {
                    handleUpdate({ postSql: v })
                  }}
                  schemas={[
                    {
                      rule: (arr: string[]) => {
                        return (arr || []).every((v) => {
                          if (!v) {
                            return true
                          }
                          if (
                            v.trim() &&
                            v.trim().split(';').filter(Boolean).length > 1
                          ) {
                            return false
                          }
                          return true
                        })
                      },
                      help: '单条语句只能包含一个 SQL 命令',
                      status: 'error',
                    },
                  ]}
                  placeholder="请输入写入数据到目的表前执行的一组标准 SQL 语句"
                />
              </>
            )}
          </>
        )}
      </Form>
    )
  }
)

export default BaseTargetConfig
