import { forwardRef, useImperativeHandle } from 'react'
import tw, { css, styled } from 'twin.macro'
import { Field, Label, Control, Form, RadioButton, Icon } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'

const { TextField, RadioGroupField, TextAreaField } = Form

const MutilFiledTable = styled('table')(() => [
  tw`w-full border-t border-neut-2 mb-2`,
  css`
    th,
    td {
      ${tw` border-b border-neut-2 px-4 py-3`}
    }
    th {
      ${tw`border-l border-r`}
    }
    thead {
      ${tw`bg-neut-1 `}
    }
  `,
])

const TextAreaFieldWrapper = styled(TextAreaField)(() => [
  tw`w-full break-words`,
  css`
    .control {
      width: 100%;
    }
  `,
])

const FullWidthTextField = styled(TextField)(() => [
  css`
    .control {
      width: 100%;
    }
  `,
])

const MutilInputField = forwardRef(({ field }, ref) => {
  const [state, setState] = useImmer<{
    type: string
    text: string
    rows: any[]
    inputs: any[]
  }>({
    type: 'batch',
    text: '',
    rows: [],
    inputs: [],
  })

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return state.type === 'single'
        ? state.inputs.filter((v) => v.join(' ') !== ' ')
        : state.text
            .split(/\r?\n/g)
            .filter((v) => v !== '')
            .map((v) => {
              const arr = v.split(/\s+/g)
              const lastVal = arr.pop()
              const restVal = arr.filter((str) => str !== '').join(' ')
              return [restVal, lastVal]
            })
    },
  }))

  const handleSwitch = (type: string) => {
    if (type === 'single') {
      if (state.text) {
        const texts = state.text
          .split(/\r?\n/g)
          .filter((v) => v !== '')
          .map((v) => {
            const arr = v.split(/\s+/g)
            const lastVal = arr.pop()
            const restVal = arr.filter((str) => str !== '').join(' ')
            return [restVal, lastVal]
          })
        setState((draft) => {
          draft.type = type
          draft.rows = texts
          draft.inputs = texts
        })
      } else {
        setState((draft) => {
          draft.type = type
          // if (draft.rows.length === 0) {
          draft.inputs = [['', '']]
          draft.rows = [['', '']]
          // }
        })
      }
    } else {
      setState((draft) => {
        draft.type = type
        draft.rows = draft.inputs
        if (draft.inputs.length > 0) {
          draft.text = draft.inputs
            .filter((v) => v.join(' ') !== ' ')
            .map((v) => v.join(' '))
            .join('\r\n')
        }
      })
    }
  }

  const addRow = () => {
    setState((draft) => {
      draft.rows.push(['', ''])
      draft.inputs.push(['', ''])
    })
  }
  return (
    <Field>
      <Label>
        <span css={[{ color: '#CF3B37' }, tw`mr-1`]}>*</span>
        {field.label}
      </Label>
      <Control>
        <RadioGroupField
          name={`${field.name}_type`}
          value={state.type}
          onChange={(v: string) => handleSwitch(v)}
        >
          <RadioButton value="batch">批量输入</RadioButton>
          <RadioButton value="single">单条输入</RadioButton>
        </RadioGroupField>
        <MutilFiledTable>
          <thead>
            {state.type === 'batch' ? (
              <tr>
                <th>Nodes信息</th>
              </tr>
            ) : (
              <tr>
                <th tw="w-3/5">Host</th>
                <th tw="w-2/5">Port</th>
              </tr>
            )}
          </thead>
          <tbody>
            {state.type === 'batch' ? (
              <tr>
                <td>
                  <TextAreaFieldWrapper
                    name={field.name}
                    defaultValue={state.text}
                    validateOnBlur
                    tw="block"
                    rows={4}
                    placeholder={`请输入nodes, host 和 port 用 “空格 “分开，多个 nodes 按 “Enter” 键换行输入。例如：
proxy.mgmt.pitrix.yunify.com 80
mgmt.pitrix.yunify.com 8080
`}
                    schemas={[
                      {
                        rule: { required: true },
                        help: '该项不能为空',
                        status: 'error',
                      },
                    ]}
                    onChange={(v: string) => {
                      setState((draft) => {
                        draft.text = v
                      })
                    }}
                  />
                </td>
              </tr>
            ) : (
              (() => {
                return (
                  <>
                    {state.rows.map((row, i) => (
                      <tr key={String(i)}>
                        <td>
                          <FullWidthTextField
                            autocomplete="off"
                            name={`node0_${i}`}
                            defaultValue={row[0]}
                            validateOnBlur
                            tw="block"
                            schemas={[
                              {
                                rule: { required: true },
                                help: '该项不能为空',
                                status: 'error',
                              },
                            ]}
                            onChange={(v: string) => {
                              setState((draft) => {
                                draft.inputs[i][0] = v
                              })
                            }}
                          />
                        </td>
                        <td>
                          <FullWidthTextField
                            autocomplete="off"
                            name={`node1_${i}`}
                            defaultValue={row[1]}
                            validateOnBlur
                            tw="block"
                            schemas={[
                              {
                                rule: { required: true },
                                help: '该项不能为空',
                                status: 'error',
                              },
                            ]}
                            onChange={(v: string) => {
                              setState((draft) => {
                                draft.inputs[i][1] = v
                              })
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span
                            tw="inline-flex items-center space-x-1 cursor-pointer hover:text-link"
                            onClick={addRow}
                          >
                            <Icon name="add" />
                            <span tw="leading-5">添加Hosts信息</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                )
              })()
            )}
          </tbody>
        </MutilFiledTable>
      </Control>
    </Field>
  )
})

export default MutilInputField
