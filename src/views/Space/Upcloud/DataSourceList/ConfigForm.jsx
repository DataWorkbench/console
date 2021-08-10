import React, { forwardRef } from 'react'
import { Field, Label, Control } from '@QCFE/lego-ui'
import { Alert, Form, Button, Icon } from '@QCFE/qingcloud-portal-ui'

const { TextField, TextAreaField, PasswordField } = Form

const ConfigForm = forwardRef((props, ref) => {
  return (
    <div>
      <Alert
        message={
          <div>
            数据源使用需要保证对应的资源组和数据源之间是可以联通的。请参考
            <a href="###" className="tw-text-link">
              网络解决方案。
            </a>
          </div>
        }
        type="warning"
        closable
        className="tw-mb-3"
      />
      <Form layout="vertical" ref={ref}>
        <Field>
          <Label>数据源类型</Label>
          <Control className="tw-w-60">
            <div className="tw-rounded-sm tw-border tw-border-green-11 tw-p-2">
              <div className="tw-font-medium tw-flex tw-items-center">
                <Icon name="container" className="tw-mr-1" />
                <span className="tw-text-green-11">连接器模式</span>
              </div>
              <div className="tw-text-neut-8">
                这是一个很长很长很长很长的关于模式的描述信息。
              </div>
            </div>
          </Control>
        </Field>
        <TextField
          name="name"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>数据源名称
            </>
          }
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          validateOnChange
          schemas={[
            {
              rule: (v) => /^(?!_)(?!.*?_$)[a-zA-Z0-9_]{2,128}$/.test(v),
              help: '允许包含字母、数字 及 "_"，长度 2-128',
              status: 'error',
            },
          ]}
        />
        <TextAreaField
          name="desc"
          rows={3}
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1" />
              数据源描述
            </>
          }
          placeholder="请填写数据库的描述信息"
          validateOnChange
          schemas={[
            {
              rule: { maxLength: 300 },
              help: '请填写数据库的描述信息',
              status: 'error',
            },
          ]}
        />
        <TextField
          name="ip"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>IP 地址
            </>
          }
          defaultValue=""
          validateOnChange
          schemas={[
            {
              rule: { required: true },
              help: '请输入ip',
              status: 'error',
            },
            {
              rule: {
                matchRegex:
                  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              },
              help: '请输入 ip，如 1.1.1.1',
              status: 'error',
            },
          ]}
          placeholder="请输入 ip，如 1.1.1.1"
        />
        <TextField
          name="port"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>端口号
            </>
          }
          placeholder="请输入端口号信息"
          validateOnChange
          schemas={[
            {
              rule: {
                required: true,
                matchRegex:
                  /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
              },
              help: '请输入端口号信息',
              status: 'error',
            },
          ]}
        />
        <TextField
          name="db"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>Database
            </>
          }
          placeholder="请输入 database 信息"
          validateOnChange
          schemas={[
            {
              rule: {
                required: true,
                matchRegex: /^[0-9a-zA-Z$_]+$/,
              },
              help: '请输入 database 信息',
              status: 'error',
            },
          ]}
        />
        <TextField
          name="user"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>用户名
            </>
          }
          placeholder="请输入用户名"
          validateOnChange
          schemas={[
            {
              rule: {
                required: true,
                isEmpty: false,
              },
              help: '请输入用户名',
              status: 'error',
            },
          ]}
        />
        <PasswordField
          name="passwd"
          label={
            <>
              <span className="tw-text-red-10 tw-mr-1">*</span>密码
            </>
          }
          autoComplete="off"
          showPrefixIcon
          placeholder="请输入密码"
          validateOnChange
          schemas={[
            {
              rule: {
                required: true,
                isEmpty: false,
              },
              help: '请输入密码',
              status: 'error',
            },
          ]}
        />
        <Field>
          <Label>连通性测试</Label>
          <Control>
            <Button type="outlined">
              <Icon name="changing-over" />
              开始测试
            </Button>
          </Control>
        </Field>
      </Form>
    </div>
  )
})

export default ConfigForm
