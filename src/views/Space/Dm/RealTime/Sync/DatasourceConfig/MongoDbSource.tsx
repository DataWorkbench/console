import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { camelCase, get, keys } from 'lodash-es'
import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'

type FieldKeys = 'id' | 'collectionName' | 'filter'

const { TextAreaField } = Form
const MongoDbSource = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceForm = useRef<Form>()

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
            filter: get(e, 'data.filter')
          }
        })
      )
      .subscribe((e) => {
        setDbInfo(e)
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
      return {
        id: dbInfo?.id,
        collection_name: dbInfo?.collectionName,
        filter: dbInfo?.filter
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
          <TextAreaField
            name="filter"
            value={dbInfo?.filter || ''}
            onChange={(v: string) => {
              setDbInfo((draft) => {
                draft.filter = v
              })
            }}
            validateOnChange
            label="过滤条件"
            placeholder="请输入过滤条件"
          />
        </>
      )}
    </Form>
  )
})

export default MongoDbSource
