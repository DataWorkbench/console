import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import { AffixLabel, Center, FlexBox } from 'components'
import { Icon } from '@QCFE/lego-ui'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'

type FieldKeys = 'id' | 'index' | 'type' | 'batchSize'

const { TextField, NumberField } = Form
const EsSource = forwardRef<ISourceRef, IDataSourceConfigProps>(
  (props, ref) => {
    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
    const sourceForm = useRef<Form>()
    const [showAdvanced, setShowAdvanced] = useState(false)

    useLayoutEffect(() => {
      const sub = source$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
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
          }
        },
        refetchColumn: () => {},
      }
    })

    return (
      <Form css={styles.form} ref={sourceForm}>
        <BaseConfigCommon from="source" />
        {dbInfo?.id && (
          <>
            <TextField
              label={<AffixLabel required>索引</AffixLabel>}
              name="index"
              value={dbInfo?.index}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.index = e.target.value
                })
              }}
            />
            <TextField
              label={<AffixLabel required>类型</AffixLabel>}
              name="type"
              value={dbInfo?.type}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.type = e.target.value
                })
              }}
              placeholder="ElasticSearch 中的 Index 名"
            />
            <TextField
              label={<AffixLabel required>类型</AffixLabel>}
              name="type"
              value={dbInfo?.type}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.type = e.target.value
                })
              }}
              placeholder="ElasticSearch 中的 Index 名"
            />
            <FlexBox>
              <div css={styles.line} />
              <Center
                tw="px-1 cursor-pointer"
                onClick={() => setShowAdvanced((prev) => !prev)}
              >
                <Icon
                  name={`chevron-${showAdvanced ? 'up' : 'down'}`}
                  type="light"
                />
                高级配置
              </Center>
              <div css={styles.line} />
            </FlexBox>

            {showAdvanced && (
              <NumberField
                label={<AffixLabel required>批量大小</AffixLabel>}
                name="batchSize"
                value={dbInfo?.batchSize}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.batchSize = e
                  })
                }}
                placeholder="批量大小"
              />
            )}
          </>
        )}
      </Form>
    )
  }
)

export default EsSource
