import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'
import {
  IDataSourceConfigProps,
  ISourceRef,
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { Form } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { AffixLabel, HelpCenterLink } from 'components'

const styles = {
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
    `,
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`],
}

const { TextField, TextAreaField, RadioGroupField } = Form

type FieldKeys = 'id' | 'topic' | 'config' | 'writeType'

const KafkaTargetConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const targetForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})

    useImperativeHandle(ref, () => {
      return {
        validate: () => {
          if (!targetForm.current) {
            return false
          }
          return targetForm.current?.validateForm()
        },
        getData: () => {
          return {}
        },
        refetchColumn: () => {},
      }
    })

    const renderCommon = () => {
      return <BaseConfigCommon from="target" />
    }

    return (
      <Form css={styles.form} ref={targetForm}>
        {renderCommon()}
        <TextField
          label={<AffixLabel required>Topic</AffixLabel>}
          name="topic"
          value={dbInfo?.topic}
          onChange={(e) => {
            setDbInfo((draft) => {
              draft.topic = e
            })
          }}
          placeholder="请输入 Topic"
          help={
            <HelpCenterLink hasIcon href="###" isIframe={false}>
              Kafka Sink 配置文档
            </HelpCenterLink>
          }
        />
        <TextAreaField
          label={<AffixLabel required={false}>生产者配置</AffixLabel>}
          name="config"
          value={dbInfo?.config}
          onChange={(e) => {
            setDbInfo((draft) => {
              draft.config = e
            })
          }}
          placeholder="请输入"
          help={
            <HelpCenterLink hasIcon isIframe={false} href="###">
              参考文档
            </HelpCenterLink>
          }
        />
        <RadioGroupField
          label={<AffixLabel required>写入模式</AffixLabel>}
          name="writeType"
          value={dbInfo?.writeType}
          options={['text', 'json'].map((i) => ({ label: i, value: i }))}
          onChange={(e) => {
            setDbInfo((draft) => {
              draft.writeType = e
            })
          }}
        />
      </Form>
    )
  }
)

export default KafkaTargetConfig
