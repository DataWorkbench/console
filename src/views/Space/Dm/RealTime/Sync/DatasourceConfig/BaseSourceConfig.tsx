import { Form, Icon } from '@QCFE/qingcloud-portal-ui'
import { ConditionParameterField, TConditionParameterVal } from 'components/ConditionParameter'
import { AffixLabel } from 'components/AffixLabel'
import tw, { css } from 'twin.macro'
import { get, isEmpty, isEqual } from 'lodash-es'
import { FlexBox } from 'components/Box'
import { Center } from 'components/Center'
import {
  ForwardedRef,
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { SyncJobType } from 'views/Space/Dm/RealTime/Job/JobUtils'
import { useQuerySourceTableSchema } from 'hooks'
import { useImmer } from 'use-immer'
import BaseTableComponent from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseTableComponent'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { baseSource$, clearMapping, source$, sourceColumns$ } from '../common/subjects'
import BaseConfigCommon from './BaseConfigCommon'

const { TextField, TextAreaField } = Form
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
    `
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`]
}

const BaseSourceConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const { curJob } = props
    const sourceForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Record<string, any>>({})

    const [conditionKey, setCondition] = useState('1')
    const [showSourceAdvance, setShowSourceAdvance] = useState(false)
    useLayoutEffect(() => {
      const unSub = baseSource$.subscribe((e) => {
        setDbInfo(() => e?.data)
        setCondition((k) => `${k}1`)
        if (e?.data?.where) {
          setShowSourceAdvance(true)
        }
      })
      return () => {
        unSub.unsubscribe()
      }
    }, [setDbInfo])

    const sourceType = source$.getValue()?.sourceType

    const sourceColumnRet = useQuerySourceTableSchema(
      {
        sourceId: dbInfo?.id!,
        tableName: dbInfo?.tableName!
      },
      {
        enabled: !!(dbInfo?.id && dbInfo?.tableName),
        onSuccess: (data: any) => {
          const columns = get(data, 'schema.columns') || []
          sourceColumns$.next(
            columns.map((i) => ({
              ...i,
              uuid: `source--${i.name}`
            }))
          )
        }
      },
      'source'
    )

    const handleUpdate = (e: Record<string, any>) => {
      const v = { ...dbInfo, ...e }
      setDbInfo(() => v)
    }

    const hasTable = !isEmpty(dbInfo?.tableName)

    const isOfflineIncrement = get(curJob, 'type') === SyncJobType.OFFLINEINCREMENT

    const isOffLineFull = get(curJob, 'type') === SyncJobType.OFFLINEFULL

    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!sourceForm.current) {
          return false
        }
        return sourceForm.current?.validateForm()
      },
      getData: () => {
        if (!dbInfo || !dbInfo.tableName) {
          return undefined
        }
        const { condition } = dbInfo
        return {
          table: [dbInfo.tableName],
          schema: '',
          where: dbInfo.where,
          split_pk: dbInfo.splitPk,
          condition_type: condition?.type,
          visualization: {
            column: condition?.column,
            start_condition: condition?.startCondition,
            start_value: condition?.startValue,
            end_condition: condition?.endCondition,
            end_value: condition?.endValue
          }
        }
      },
      refetchColumn: () => {
        sourceColumnRet.refetch()
      }
    }))
    const renderCommon = () => <BaseConfigCommon from="source" />

    const renderBaseTable = () => (
      <BaseTableComponent
        from="source"
        sourceType={sourceType?.label}
        sourceId={dbInfo?.id}
        tableName={dbInfo?.tableName}
        onChange={(v: string) => {
          // setDbInfo((draft) => {
          //   draft.tableName = v
          // })
          baseSource$.next({ data: { ...dbInfo, tableName: v }, sourceType })
          if (v !== dbInfo.tableName) {
            clearMapping()
          }
        }}
      />
    )

    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon()}
        {renderBaseTable()}
        {hasTable && isOfflineIncrement && (
          <ConditionParameterField
            key={conditionKey}
            name="condition"
            columns={(sourceColumns$.getValue() || []).map((c) => c.name)}
            label={<AffixLabel>条件参数配置</AffixLabel>}
            loading={sourceColumnRet.isFetching}
            helpStr="可在条件参数中填写增量同步条件"
            helpLink={`/manual/integration_job/cfg_source/${sourceType?.name}/#条件参数配置`}
            onRefresh={() => {
              sourceColumnRet.refetch()
            }}
            value={dbInfo?.condition}
            onChange={(v: any) => {
              setDbInfo((draft) => {
                draft.condition = v
              })
            }}
            css={css`
              .help {
                ${tw`w-full`}
              }
            `}
            validateOnChange={
              dbInfo?.condition &&
              !isEqual(dbInfo.condition, { type: 1 }) &&
              !isEqual(dbInfo.condition, { type: 2 })
            }
            schemas={[
              {
                rule: (re: TConditionParameterVal) => {
                  if (re.type === 1) {
                    return true
                  }
                  const v = re.expression
                  if (!v) {
                    return true
                  }
                  if (v?.includes('where ')) {
                    return false
                  }
                  if (v.trim() && v.trim().split(';').filter(Boolean).length > 1) {
                    return false
                  }
                  return true
                },
                help: '条件参数不能包含 where, 且只能包含一个 SQL 命令',
                status: 'error'
              },
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
                }
              }
            ]}
          />
        )}
        {hasTable && (
          <TextField
            name="split_pk"
            label="切分键"
            placeholder="推荐使用表主键，仅支持整型数据切分"
            help="如果通道设置中作业期望最大并行数大于 1 时必须配置此参数"
            value={dbInfo?.splitPk || ''}
            onChange={(v: string) => {
              handleUpdate({ splitPk: v })
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
                <Icon name={`chevron-${showSourceAdvance ? 'up' : 'down'}`} type="light" />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>
            {showSourceAdvance && (
              <TextAreaField
                name="where"
                value={dbInfo?.where || ''}
                onChange={(v: string) => {
                  handleUpdate({ where: v })
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
                    }
                  },
                  {
                    help: '不能存在多条过滤条件',
                    status: 'error',
                    rule: (v: string) => {
                      if (v.trim() && v.trim().split(';').filter(Boolean).length > 1) {
                        return false
                      }
                      return true
                    }
                  }
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
)

export default memo(BaseSourceConfig)
