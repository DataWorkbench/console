import { ForwardedRef, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import {
  IDataSourceConfigProps,
  ISourceRef
} from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/interfaces'
import { Form } from '@QCFE/qingcloud-portal-ui'
import tw, { css } from 'twin.macro'
import BaseConfigCommon from 'views/Space/Dm/RealTime/Sync/DatasourceConfig/BaseConfigCommon'
import { useImmer } from 'use-immer'
import { AffixLabel, HelpCenterLink } from 'components'
import { target$ } from 'views/Space/Dm/RealTime/Sync/common/subjects'
import { get } from 'lodash-es'
import { map } from 'rxjs'

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
    `
  ],
  line: [tw`flex-1 border-t border-neut-13 translate-y-1/2`]
}

const { TextField, TextAreaField } = Form

type FieldKeys = 'id' | 'topic' | 'config'

const KafkaTargetConfig = forwardRef(
  (props: IDataSourceConfigProps, ref: ForwardedRef<ISourceRef>) => {
    const targetForm = useRef<Form>()

    const [dbInfo, setDbInfo] = useImmer<Partial<Record<FieldKeys, any>>>({})

    useLayoutEffect(() => {
      target$
        .pipe(
          map((e) => {
            if (!e) {
              return {}
            }
            return {
              id: get(e, 'data.id'),
              topic: get(e, 'data.topic'),
              config: get(e, 'data.config', `"batch.size": "16384",\n"request.timeout.ms": "30000"`)
            }
          })
        )
        .subscribe((e) => setDbInfo(e))
    }, [setDbInfo])
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (!targetForm.current) {
          return false
        }
        return targetForm.current?.validateForm()
      },
      getData: () => ({
        ...dbInfo
      }),
      refetchColumn: () => {}
    }))

    const renderCommon = () => <BaseConfigCommon from="target" />

    return (
      <Form css={styles.form} ref={targetForm}>
        {renderCommon()}
        {!!dbInfo?.id && (
          <>
            <TextField
              label={<AffixLabel required>Topic</AffixLabel>}
              name="topic"
              defaultValue={dbInfo?.topic}
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
              validateOnChange
              schemas={[
                {
                  rule: { required: true },
                  help: (
                    <div>
                      <span>不能为空, </span>
                      <span tw="text-font-placeholder mr-1">详见</span>
                      <HelpCenterLink hasIcon isIframe={false} href="###">
                        Kafka Sink 配置文档
                      </HelpCenterLink>
                    </div>
                  ),
                  status: 'error'
                }
              ]}
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
          </>
        )}
      </Form>
    )
  }
)

export default KafkaTargetConfig
