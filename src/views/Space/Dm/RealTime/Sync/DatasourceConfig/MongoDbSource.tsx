import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { camelCase, get, isEmpty, isEqual, keys } from 'lodash-es'
import {
  AffixLabel,
  ConditionParameterField,
  HelpCenterLink,
  SelectWithRefresh,
  TConditionParameterVal
} from 'components'
import { useQuerySourceTables } from 'hooks'
import tw, { css } from 'twin.macro'
import { nanoid } from 'nanoid'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'

type FieldKeys = 'id' | 'collectionName' | 'condition'

const MongoDbSource = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceForm = useRef<Form>()

  const [conditionKey, setCondition] = useState('1')

  useLayoutEffect(() => {
    const sub = source$
      .pipe(
        map((e) => {
          if (!e) {
            return {}
          }
          let condition: any = {
            type: 1
          }

          if (get(e, 'data.condition_type') === 2) {
            condition = {
              type: 2,
              expression: get(e, 'data.express')
            }
          } else {
            const visualization: Record<string, string> = get(e, 'data.visualization', {})
            keys(visualization).forEach((v) => {
              condition[camelCase(v)] = visualization[v]
            })
            condition.type = 1
          }

          return {
            id: get(e, 'data.id'),
            collectionName: get(e, 'data.collection_name'),
            condition
          }
        })
      )
      .subscribe((e) => {
        setDbInfo(e)
        setCondition(nanoid())
      })

    return () => {
      sub.unsubscribe()
    }
  }, [setDbInfo])

  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!sourceForm.current) {
        return false
      }
      return sourceForm.current?.validateForm()
    },
    getData: () => {
      const { condition } = dbInfo
      console.log(
        condition,
        !!condition?.startCondition ||
          !!condition?.startCondition ||
          !!condition?.endCondition ||
          !!condition?.endValue ||
          !!condition?.column
      )
      return {
        id: dbInfo?.id,
        collection_name: dbInfo?.collectionName,
        schema: '',
        condition_type:
          // eslint-disable-next-line no-nested-ternary
          condition?.type === 2
            ? 2
            : !!condition?.startCondition ||
              !!condition?.startCondition ||
              !!condition?.endCondition ||
              !!condition?.endValue ||
              !!condition?.column
            ? 1
            : 0,
        visualization: {
          column: condition?.column,
          start_condition: condition?.startCondition,
          start_value: condition?.startValue,
          end_condition: condition?.endCondition,
          end_value: condition?.endValue
        }
      }
    },
    refetchColumn: () => {}
  }))

  const { data: tableList, refetch: tableRefetch } = useQuerySourceTables(
    {
      sourceId: dbInfo?.id
    },
    { enabled: !!dbInfo?.id }
  )

  return (
    <Form css={styles.form} ref={sourceForm}>
      <BaseConfigCommon from="source" />
      {dbInfo?.id && (
        <>
          <SelectWithRefresh
            label={<AffixLabel required>集合</AffixLabel>}
            name="collectionName"
            onRefresh={tableRefetch}
            // multi
            options={tableList?.items?.map((i) => ({ label: i, value: i })) ?? []}
            value={dbInfo?.collectionName}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.collectionName = e
              })
            }}
            placeholder=""
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: (
                  <div>
                    <span>不能为空, </span>
                    <span tw="text-font-placeholder mr-1">详见</span>
                    <HelpCenterLink
                      hasIcon
                      isIframe={false}
                      href="/manual/integration_job/cfg_source/mongodb/"
                    >
                      MongoDb Source 配置文档
                    </HelpCenterLink>
                  </div>
                ),
                status: 'error'
              }
            ]}
            help={
              <HelpCenterLink
                isIframe={false}
                hasIcon
                href="/manual/integration_job/cfg_source/mongodb/"
              >
                MongoDb Source 配置文档
              </HelpCenterLink>
            }
          />
          <ConditionParameterField
            key={conditionKey}
            name="condition"
            isInput
            // columns={(sourceColumns$.getValue() || []).map((c) => c.name)}
            label={<AffixLabel required={false}>条件参数配置</AffixLabel>}
            helpStr="可在条件参数中填写增量同步条件"
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
                help: '条件参数未正确配置',
                status: 'error',
                rule: (v: TConditionParameterVal) => {
                  let valid = false
                  if (v.type === 2) {
                    valid = !isEmpty(v.expression)
                  } else if (
                    !!v.startCondition ||
                    !!v.endValue ||
                    !!v.startValue ||
                    v.column ||
                    v.endCondition
                  ) {
                    valid =
                      !isEmpty(v.startValue) &&
                      !isEmpty(v.endValue) &&
                      !isEmpty(v.startCondition) &&
                      !isEmpty(v.endCondition) &&
                      !isEmpty(v.column)
                  } else {
                    valid = true
                  }

                  return valid
                }
              }
            ]}
          />
        </>
      )}
    </Form>
  )
})

export default MongoDbSource
