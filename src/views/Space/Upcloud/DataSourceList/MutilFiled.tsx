import tw, { css, styled } from 'twin.macro'
import { Field, Label, Control, Form, RadioButton } from '@QCFE/lego-ui'
import { useImmer } from 'use-immer'
import { last, filter, uniq } from 'lodash-es'

const { TextField, RadioGroupField, TextAreaField } = Form

const MutilFiledTable = styled('table')(() => [
  tw`w-full border-t border-neut-2 mb-2`,
  css`
    th,
    td {
      ${tw`border-r border-b border-neut-2 px-4 py-3 `}
    }
    th {
      ${tw`border-l`}
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

const MutilField = ({ field }) => {
  const { name, label } = field
  const [state, setState] = useImmer({
    type: 'batch',
    hosts: '',
    ports: '',
    hostIpMap: [],
  })

  let hosts: string | string[] =
    state.hosts === ''
      ? []
      : state.hosts.replace(/\s/g, ' ').replace(/\r\n/g, ' ').split(' ')

  let ports: string | string[] =
    state.ports === ''
      ? []
      : state.ports.replace(/\s/g, ' ').replace(/\n/g, ' ').split(' ')
  hosts = uniq(filter(hosts, (v) => v !== ''))
  ports = uniq(filter(ports, (v) => v !== ''))
  const hostIpMap = hosts.map((host, i) => {
    return {
      host,
      port: ports[i] || last(ports),
    }
  })
  return (
    <Field>
      <Label>
        <span css={[{ color: '#CF3B37' }, tw`mr-1`]}>*</span>
        {label}
      </Label>
      <Control>
        <RadioGroupField
          name={name}
          defaultValue={state.type}
          onChange={(v: string) =>
            setState((draf) => {
              draf.type = v
            })
          }
        >
          <RadioButton value="batch">批量输入</RadioButton>
          <RadioButton value="single">单条输入</RadioButton>
        </RadioGroupField>
        <MutilFiledTable>
          <thead>
            <tr>
              <th tw="w-3/5">Hostname</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {state.type === 'batch' ? (
              <tr>
                <td>
                  <TextAreaFieldWrapper
                    name="hosts_hostname"
                    tw="block"
                    rows={4}
                    value={state.hosts}
                    placeholder={`请输入 hostname，多个 hostname 按 “Enter” 键换行输入。例如：
proxy.mgmt.pitrix.yunify.com
pgpool.mgmt.pitrix.yunify.com `}
                    schemas={[
                      {
                        rule: { required: true },
                        help: '该项不能为空',
                        status: 'error',
                      },
                    ]}
                    onChange={(v: string) => {
                      setState((draft) => {
                        draft.hosts = v
                      })
                    }}
                  />
                </td>
                <td>
                  <TextAreaFieldWrapper
                    name="hosts_ip"
                    tw="block"
                    rows={4}
                    value={state.ports}
                    placeholder={`请输入 IP，多个 IP 按 “Enter” 键换行输入。例如
192.168.2.1
192.168.2.2`}
                    schemas={[
                      {
                        rule: { required: true },
                        help: '该项不能为空',
                        status: 'error',
                      },
                    ]}
                    onChange={(v: string) => {
                      setState((draft) => {
                        draft.ports = v
                      })
                    }}
                  />
                </td>
              </tr>
            ) : (
              (() => {
                return (
                  <>
                    {hostIpMap.map((hostIp, i) => (
                      <tr key={hostIp.host} tw="space-x-1">
                        <td>
                          <FullWidthTextField
                            name={`host_${i}`}
                            defaultValue={hostIp.host}
                          />
                        </td>
                        <td>
                          <FullWidthTextField
                            name={`ip_${i}`}
                            defaultValue={hostIp.port}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                )
              })()
            )}
          </tbody>
        </MutilFiledTable>
      </Control>
    </Field>
  )
}

export default MutilField
