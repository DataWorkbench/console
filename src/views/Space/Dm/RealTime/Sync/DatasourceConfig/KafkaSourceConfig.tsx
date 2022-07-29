import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { Form } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { useImmer } from 'use-immer'
import { AffixLabel, Center, FlexBox, HelpCenterLink } from 'components'
import { Icon } from '@QCFE/lego-ui'
import { kafkaSource$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import useSetRealtimeColumns from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/hooks/useSetRealtimeColumns'

type FieldKeys =
  | 'topic'
  | 'id'
  | 'consumer'
  | 'consumerId'
  | 'charset'
  | 'readType'
  | 'config'
  | 'offset'
  | 'timestamp'

const consumers = {
  'group-offsets': '从 ZK/Kafka borders 中指定的消费组已经提交的 offset 开始消费',
  'earliest-offset': '从最早的偏移量开始（如果可能）',
  'latest-offset': '从最新的偏移量开始（如果可能）',
  timestamp: '从每个分区的指定的时间戳开始',
  'specific-offsets': '从每个分区的指定偏移量开始'
}

const readType = ['text', 'json'].map((i, index) => ({
  label: i,
  value: index + 1
}))

const consumerOptions = Object.keys(consumers).map((i, index) => ({
  label: i,
  value: index + 1
}))

const { TextField, SelectField, RadioGroupField, NumberField, TextAreaField } = Form
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

      label.checkbox input[type='checkbox'] {
        height: 12px !important;
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

const KafkaSourceConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const sourceForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})

    const { refetch } = useSetRealtimeColumns(
      dbInfo?.id,
      dbInfo?.readType === 'text' ? [['message', 'STRING']] : []
    )
    const [showAdvanced, setShowAdvanced] = useState(false)
    useLayoutEffect(() => {
      const sub = kafkaSource$.subscribe((e) => setDbInfo(e))
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
        let config
        try {
          config = JSON.parse(dbInfo?.config)
        } catch (_) {
          config = {}
        }
        return {
          topic: dbInfo.topic,
          mode: dbInfo.consumer,
          group_id: dbInfo.consumerId,
          encoding: dbInfo.charset,
          codec: dbInfo.readType,
          consumer_settings: config,
          offset: dbInfo.offset,
          timestamp: dbInfo.timestamp
        }
      },
      refetchColumn: () => {
        if (dbInfo?.id) {
          refetch()
        }
      }
    }))

    const renderCommon = () => (
      <>
        <BaseConfigCommon from="source" />
      </>
    )
    return (
      <Form css={styles.form} ref={sourceForm}>
        {renderCommon()}
        {dbInfo?.id && (
          <>
            <TextField
              label={<AffixLabel required>Topic</AffixLabel>}
              defaultValue={dbInfo?.topic}
              name="topic"
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.topic = e
                })
              }}
              placeholder="请输入"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: (
                    <div>
                      <span>不能为空, </span>
                      <span tw="text-font-placeholder mr-1">详见</span>
                      <HelpCenterLink hasIcon isIframe={false} href="###">
                        Kafka Source 配置文档
                      </HelpCenterLink>
                    </div>
                  ),
                  status: 'error'
                }
              ]}
              help={
                <HelpCenterLink hasIcon isIframe={false} href="###">
                  Kafka Source 配置文档
                </HelpCenterLink>
              }
            />
            <SelectField
              label={<AffixLabel required>消费模式</AffixLabel>}
              name="consumer"
              value={dbInfo?.consumer}
              options={consumerOptions}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.consumer = e
                })
              }}
              placeholder="请选择消费模式"
              help={
                consumers[dbInfo?.consumer as never] ??
                '从ZK / Kafka brokers 中指定的消费组已经提交的 offset 开始消费'
              }
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择消费模式',
                  status: 'error'
                }
              ]}
            />
            {dbInfo?.consumer === 4 && (
              <NumberField
                label={<AffixLabel required>timestamp</AffixLabel>}
                name="timestamp"
                min={0}
                step={1}
                validateOnChange
                showButton={false}
                value={dbInfo?.timestamp}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.timestamp = e
                  })
                }}
                schemas={[
                  {
                    rule: { required: true },
                    help: '请输入 timestamp',
                    status: 'error'
                  }
                ]}
              />
            )}
            {dbInfo.consumer === 5 && (
              <TextField
                label={<AffixLabel required>offset</AffixLabel>}
                name="offset"
                value={dbInfo?.offset}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.offset = e
                  })
                }}
                placeholder="partition:0,offset:42;partition:1,offset:300;partition:2,offset:30"
                validateOnChange
                schemas={[
                  {
                    rule: { required: true },
                    help: '请输入 offset',
                    status: 'error'
                  }
                ]}
              />
            )}
            <TextField
              label={<AffixLabel required>消费组 ID</AffixLabel>}
              name="consumerId"
              value={dbInfo?.consumerId}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.consumerId = e
                })
              }}
              placeholder="请输入消费组 ID"
              help="请避免该参数与其他消费进程重复"
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请输入消费组 ID',
                  status: 'error'
                }
              ]}
            />
            <RadioGroupField
              name="charset"
              label={<AffixLabel required>字符编码</AffixLabel>}
              options={[
                {
                  label: 'UTF-8',
                  value: 1
                },
                {
                  label: 'GBK',
                  value: 2
                }
              ]}
              value={dbInfo?.charset}
              onChange={(e) => {
                setDbInfo((draft) => {
                  draft.charset = e
                })
              }}
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择字符编码',
                  status: 'error'
                }
              ]}
            />
            <RadioGroupField
              label={<AffixLabel required>读取模式</AffixLabel>}
              options={readType}
              name="readType"
              value={dbInfo?.readType}
              onChange={(e) => {
                kafkaSource$.next({ ...dbInfo, readType: e })
                // setDbInfo((draft) => {
                //   draft.readType = e
                // })
                // console.log(444444, e)
              }}
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: '请选择读取模式',
                  status: 'error'
                }
              ]}
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
              <TextAreaField
                label="消费者配置"
                name="config"
                value={dbInfo?.config}
                onChange={(e) => {
                  setDbInfo((draft) => {
                    draft.config = e
                  })
                }}
                help={
                  <HelpCenterLink hasIcon isIframe={false} href="###">
                    参考文档
                  </HelpCenterLink>
                }
              />
            )}
          </>
        )}
      </Form>
    )
  }
)

export default KafkaSourceConfig
