import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { useImmer } from 'use-immer'
import { AffixLabel, Center, FlexBox, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/lego-ui'
import { source$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get } from 'lodash-es'
import { map } from 'rxjs'

const { SelectField, TextField, RadioGroupField } = Form
type FieldKeys = 'id' | 'path' | 'fileType' | 'filterRegex' | 'fieldDelimiter' | 'encoding'
const HdfsSource = forwardRef((props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceRef = useRef<Form>()
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
            path: get(e, 'data.path'),
            fileType: get(e, 'data.file_type'),
            filterRegex: get(e, 'data.filter_regex'),
            fieldDelimiter: get(e, 'data.field_delimiter', '\\001'),
            encoding: get(e, 'data.encoding', 1)
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
    getData: () => ({
      encoding: dbInfo?.encoding,
      field_delimiter: dbInfo?.fieldDelimiter,
      file_type: dbInfo?.fileType,
      filter_regex: dbInfo?.filterRegex,
      id: dbInfo?.id,
      path: dbInfo?.path
    }),
    validate: () => {
      if (!sourceRef.current) {
        return false
      }
      return sourceRef.current?.validateForm()
    },
    refetchColumn: () => {}
  }))

  return (
    <Form css={styles.form} ref={sourceRef}>
      <BaseConfigCommon from="source" />
      {dbInfo?.id && (
        <>
          <TextField
            label={<AffixLabel required>文件路径</AffixLabel>}
            name="path"
            value={dbInfo?.path}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.path = e
              })
            }}
            placeholder="请输入文件路径"
            help={
              <HelpCenterLink hasIcon isIframe={false} href="###">
                HDFS Source 配置文档
              </HelpCenterLink>
            }
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: (
                  <div>
                    <span>不能为空, </span>
                    <span tw="text-font-placeholder mr-1">详见</span>
                    <HelpCenterLink hasIcon isIframe={false} href="###">
                      HDFS Source 配置文档
                    </HelpCenterLink>
                  </div>
                ),
                status: 'error'
              }
            ]}
          />
          <SelectField
            label={<AffixLabel required>文件类型</AffixLabel>}
            name="type"
            value={dbInfo?.fileType}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.fileType = e
              })
            }}
            options={
              /**
               * text = 1;
               * orc = 2;
               * parquet = 3;
               */
              [
                { label: 'text', value: 1 },
                { label: 'orc', value: 2 },
                { label: 'parquet', value: 3 }
              ]
            }
            placeholder="请选择文件类型"
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: '请选择文件类型',
                status: 'error'
              },
              {
                rule: (v) => {
                  return !!v
                },
                help: '请选择文件类型',
                status: 'error'
              }
            ]}
          />

          {dbInfo?.fileType === 1 && (
            <>
              <TextField
                label="分隔符"
                name="fieldDelimiter"
                value={dbInfo?.fieldDelimiter}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.fieldDelimiter = e
                  })
                }}
                placeholder="请输入分隔符"
              />
              <RadioGroupField
                name="encoding"
                label="字符编码"
                value={dbInfo?.encoding}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.encoding = e
                  })
                }}
                options={
                  /**
                   * UTF-8 = 1;
                   * GBK = 2;
                   */
                  [
                    { label: 'UTF-8', value: 1 },
                    { label: 'GBK', value: 2 }
                  ]
                }
                placeholder="请选择字符编码"
              />
            </>
          )}
          <FlexBox>
            <div css={styles.line} />
            <Center tw="px-1 cursor-pointer" onClick={() => setShowAdvanced((prev) => !prev)}>
              <Icon name={`chevron-${showAdvanced ? 'up' : 'down'}`} type="light" />
              高级配置
            </Center>
            <div css={styles.line} />
          </FlexBox>
          <TextField
            label={<AffixLabel required={false}>文件正则</AffixLabel>}
            name="reg"
            value={dbInfo?.filterRegex}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.filterRegex = e
              })
            }}
            placeholder="请填写文件正则表达，读取匹配到的文件列表"
            validateOnChange
            // schemas={[
            //   {
            //     rule: { required: true },
            //     help: '请填写文件正则表达，读取匹配到的文件列表',
            //     status: 'error',
            //   },
            // ]}
          />
        </>
      )}
    </Form>
  )
})

export default HdfsSource
