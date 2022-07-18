import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import { AffixLabel, Center, FlexBox, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/lego-ui'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { source$ } from '../common/subjects'
import { useDescribeDataSource } from '../../../../../../hooks'

type FieldKeys = 'id' | 'index' | 'type' | 'batchSize'

const { TextField, NumberField } = Form
const EsSource = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
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
            batchSize: get(e, 'data.batch_size', 1),
            type: get(e, 'data.type'),
            index: get(e, 'data.index')
          }
        })
      )
      .subscribe((e) => setDbInfo(e))
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
      getData: () => ({
          id: dbInfo?.id,
          batchSize: dbInfo?.batchSize,
          type: dbInfo?.type,
          index: dbInfo?.index
        }),
      refetchColumn: () => {}
    }))

  const { data: sourceDetail } = useDescribeDataSource(dbInfo.id)

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
                draft.index = e
              })
            }}
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: (
                  <div>
                    <span>不能为空, </span>
                    <span tw="text-font-placeholder mr-1">详见</span>
                    <HelpCenterLink hasIcon isIframe={false} href="###">
                      ElasticSearch Source 配置文档
                    </HelpCenterLink>
                  </div>
                ),
                status: 'error'
              }
            ]}
            help={
              <HelpCenterLink hasIcon isIframe={false} href="###">
                ElasticSearch Source 配置文档
              </HelpCenterLink>
            }
          />
          {get(sourceDetail, 'url.elastic_search.version') === '6' && (
            <TextField
              label={<AffixLabel required>类型</AffixLabel>}
              name="type"
              value={dbInfo?.type}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.type = e
                })
              }}
              placeholder="ElasticSearch 中的 Index 名"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入索引类型',
                  status: 'error'
                }
              ]}
            />
          )}
          <FlexBox>
            <div css={styles.line} />
            <Center tw="px-1 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
              <Icon name={`chevron-${showAdvanced ? 'up' : 'down'}`} type="light" />
              高级配置
            </Center>
            <div css={styles.line} />
          </FlexBox>

          {showAdvanced && (
            <NumberField
              label={<AffixLabel required>批量大小</AffixLabel>}
              name="batchSize"
              value={dbInfo?.batchSize}
              onChange={(v) => {
                setDbInfo((draft) => {
                  draft.batchSize = v
                })
              }}
              min={1}
              max={65535}
              step={1}
              help="1-65535"
              placeholder="批量大小"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请设置批量大小',
                  status: 'error'
                }
              ]}
              showButton={false}
            />
          )}
        </>
      )}
    </Form>
  )
})

export default EsSource
