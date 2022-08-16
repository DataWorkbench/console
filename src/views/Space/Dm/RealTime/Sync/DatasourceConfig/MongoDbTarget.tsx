import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import styles from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/styles'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { Form } from '@QCFE/qingcloud-portal-ui'
import { map } from 'rxjs'
import { get } from 'lodash-es'
// import useTableColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useTableColumns'
import { AffixLabel, Center, FlexBox, HelpCenterLink, SelectWithRefresh } from 'components'
import { useQuerySourceTables } from 'hooks'
import { Control, Field, Icon, InputNumber, Label } from '@QCFE/lego-ui'
import { IDataSourceConfigProps, ISourceRef } from './interfaces'
import { target$ } from '../common/subjects'

type FieldKeys = 'id' | 'collectionName' | 'writeMode' | 'replaceKey' | 'batchSize'

const { SelectField, TextField } = Form

const MongoDbTarget = forwardRef<ISourceRef, IDataSourceConfigProps>((props, ref) => {
  const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})
  const sourceForm = useRef<Form>()

  const [showAdvanced, setShowAdvanced] = useState(false)
  // const { refetch } = useTableColumns(dbInfo?.id, dbInfo?.collectionName, 'target')
  useLayoutEffect(() => {
    const sub = target$
      .pipe(
        map((e) => {
          if (!e) {
            return {}
          }
          return {
            id: get(e, 'data.id'),
            collectionName: get(e, 'data.collection_name'),
            writeMode: get(e, 'data.write_mode', 1),
            replaceKey: get(e, 'data.replace_key'),
            batchSize: get(e, 'data.batch_size', 1)
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
      collection_name: dbInfo?.collectionName,
      write_mode: dbInfo?.writeMode,
      replace_key: dbInfo?.replaceKey,
      batch_size: dbInfo?.batchSize
    }),
    refetchColumn: () => {
      // refetch()
    }
  }))

  const { data: tableList, refetch: tableRefetch } = useQuerySourceTables(
    {
      sourceId: dbInfo?.id
    },
    { enabled: !!dbInfo?.id }
  )

  const dbRef = useRef(dbInfo)
  useEffect(() => {
    dbRef.current = dbInfo
  }, [dbInfo])
  return (
    <Form css={styles.form} ref={sourceForm}>
      <BaseConfigCommon from="target" />
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
                      href="/manual/integration_job/cfg_sink/mongodb/"
                    >
                      MongoDb Slink 配置文档
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
                href="/manual/integration_job/cfg_sink/mongodb/"
              >
                MongoDb Slink 配置文档
              </HelpCenterLink>
            }
          />
          <SelectField
            label={<AffixLabel required>写入模式</AffixLabel>}
            name="writeMode"
            value={dbInfo?.writeMode}
            onChange={(e) => {
              setDbInfo((draft) => {
                draft.writeMode = e
              })
            }}
            options={[
              { label: 'insert 插入', value: 1 },
              { label: 'replace 替换', value: 2 },
              {
                label: 'update 更新插入',
                value: 3
              }
            ]}
            placeholder="请选择写入模式"
            help="当主键/唯一性索引冲突时会写不进去冲突的行，以脏数据的形式体现"
            validateOnChange
            schemas={[
              {
                rule: { required: true },
                help: '请选择写入模式',
                status: 'error'
              },
              {
                rule: (v: number) => {
                  if (dbRef.current?.batchSize > 1 && v !== 1) {
                    return false
                  }
                  return true
                },
                help: '当 batchSize > 1 时不支持 replace 和 update 模式',
                status: 'error'
              }
            ]}
          />
          {(dbInfo?.writeMode === 2 || dbInfo?.writeMode === 3) && (
            <TextField
              label={<AffixLabel required>业务主键</AffixLabel>}
              name="replaceKey"
              value={dbInfo?.replaceKey}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.replaceKey = e
                })
              }}
              placeholder="请输入业务主键"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入业务主键',
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
            <>
              <Field>
                <Label className="label" theme="green">
                  <AffixLabel
                    required={false}
                    theme="green"
                    help="批量写入的条数，该值可减少网络交互次数，过大会造成 OOM"
                  >
                    批量写入
                  </AffixLabel>
                </Label>
                <Control>
                  <InputNumber
                    label={null}
                    name="batchSize"
                    showButton={false}
                    min={1}
                    step={1}
                    value={dbInfo?.batchSize}
                    onChange={(e) => {
                      setDbInfo((draft) => {
                        draft.batchSize = Number(e)
                      })
                    }}
                  />
                  <span tw="leading-7 ml-1.5"> 条 </span>
                </Control>
                <div className="help">1-65535</div>
              </Field>
            </>
          )}
        </>
      )}
    </Form>
  )
})

export default MongoDbTarget
