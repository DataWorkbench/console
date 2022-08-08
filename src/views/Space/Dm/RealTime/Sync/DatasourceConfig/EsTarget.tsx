import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
import { AffixLabel, Center, FlexBox, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/lego-ui'
import { useDescribeDataSource } from 'hooks'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { target$ } from '../common/subjects'

type FieldKeys = 'id' | 'index' | 'type' | 'batchSize' | 'keyDelimiter'

const { TextField, NumberField } = Form
const EsTarget = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceForm = useRef<Form>()
  const [showAdvanced, setShowAdvanced] = useState(false)

  useLayoutEffect(() => {
    const sub = target$
      .pipe(
        map((e) => {
          if (!e) {
            return {}
          }
          return {
            id: get(e, 'data.id'),
            batchSize: get(e, 'data.batch_size'),
            keyDelimiter: get(e, 'data.key_delimiter'),
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

  const { data: sourceDetail } = useDescribeDataSource(dbInfo.id)
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (!sourceForm.current) {
        return false
      }
      return sourceForm.current?.validateForm()
    },
    getData: () => ({
      id: dbInfo?.id,
      batch_size: dbInfo?.batchSize,
      key_delimiter: dbInfo?.keyDelimiter,
      type: dbInfo?.type,
      index: dbInfo?.index
    }),
    refetchColumn: () => {}
  }))

  return (
    <Form css={styles.form} ref={sourceForm}>
      <BaseConfigCommon from="target" />
      {dbInfo?.id && (
        <>
          <TextField
            label={<AffixLabel required>索引</AffixLabel>}
            name="index"
            value={dbInfo?.index}
            onChange={(v) => {
              setDbInfo((draft) => {
                draft.index = v
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
                    <HelpCenterLink
                      hasIcon
                      isIframe={false}
                      href="/manual/integration_job/cfg_slink/elasticsearch/"
                    >
                      ElasticSearch Sink 配置文档
                    </HelpCenterLink>
                  </div>
                ),
                status: 'error'
              }
            ]}
            help={
              <HelpCenterLink
                hasIcon
                isIframe={false}
                href="/manual/integration_job/cfg_slink/elasticsearch/"
              >
                ElasticSearch Sink 配置文档
              </HelpCenterLink>
            }
            placeholder="请输入索引"
          />
          {get(sourceDetail, 'url.elastic_search.version') === '6' && (
            <TextField
              label={<AffixLabel required>类型</AffixLabel>}
              name="type"
              value={dbInfo?.type}
              onChange={(v) => {
                setDbInfo((draft) => {
                  draft.type = v
                })
              }}
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入类型',
                  status: 'error'
                }
              ]}
              placeholder="index 下的 type 名称"
            />
          )}
          <TextField
            label={<AffixLabel required={false}>分隔符号</AffixLabel>}
            name="keyDelimiter"
            value={dbInfo?.keyDelimiter}
            onChange={(v) => {
              setDbInfo((draft) => {
                draft.keyDelimiter = v
              })
            }}
            placeholder={
              /* eslint-disable-next-line no-template-curly-in-string */
              '文档 ID 之间的分隔符号，eg:“${col1}_${col2}” 默认值是下划线。'
            }
            validateOnChange
            // schemas={[
            //   {
            //     rule: { required: true },
            //     help: '请输入分隔符号',
            //     status: 'error',
            //   },
            // ]}
          />
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
              label={<AffixLabel>批量大小</AffixLabel>}
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
              // schemas={[
              //   {
              //     rule: { required: true },
              //     help: '请设置批量大小',
              //     status: 'error',
              //   },
              // ]}
              showButton={false}
            />
          )}
        </>
      )}
    </Form>
  )
})

export default EsTarget
