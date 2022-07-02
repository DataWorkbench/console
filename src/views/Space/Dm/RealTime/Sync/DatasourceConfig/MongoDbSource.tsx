import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import useTableColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useTableColumns'
import { AffixLabel, HelpCenterLink, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'

type FieldKeys = 'id' | 'collectionName'

const MongoDbSource = forwardRef<ISourceRef, IDataSourceConfigProps>(
  (props, ref) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const sourceForm = useRef<Form>()

    const { refetch } = useTableColumns(
      dbInfo?.id,
      dbInfo?.collectionName,
      'source'
    )

    useLayoutEffect(() => {
      const sub = source$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
              collectionName: get(e, 'data.collection_name'),
            }
          })
        )
        .subscribe((e) => setDbInfo(e))

      return () => {
        sub.unsubscribe()
      }
    }, [setDbInfo])

    useImperativeHandle(ref, () => {
      return {
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
          }
        },
        refetchColumn: () => {
          refetch()
        },
      }
    })

    const { data: tableList, refetch: tableRefetch } = useQuerySourceTables(
      {
        sourceId: dbInfo?.id,
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
              multi
              options={
                tableList?.items?.map((i) => ({ label: i, value: i })) ?? []
              }
              value={dbInfo?.collectionName}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.collectionName = e
                })
              }}
              placeholder=""
              validateOnChange
              help={
                <HelpCenterLink isIframe={false} hasIcon href="###">
                  MongoDb Source 配置文档
                </HelpCenterLink>
              }
            />
          </>
        )}
      </Form>
    )
  }
)

export default MongoDbSource
