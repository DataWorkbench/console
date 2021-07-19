import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Control } from '@QCFE/lego-ui'
import { Alert, Form, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import DbItem from './DbItem'

const { TextField, TextAreaField, PasswordField } = Form

const propTypes = {
  db: PropTypes.object,
}

function ConfigForm({ db }, ref) {
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
          <Control>
            <DbItem title={db.name} disp={db.disp} selected />
          </Control>
        </Field>
        <TextField
          name="name"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>数据源名称
            </>
          }
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
        />
        <TextAreaField
          name="desc"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>数据源描述
            </>
          }
          placeholder="请填写数据库的描述信息"
        />
        <TextField
          name="ip"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>IP 地址
            </>
          }
          defaultValue=""
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
        />
        <TextField
          name="port"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>端口号
            </>
          }
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
        />
        <TextField
          name="db"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>Database
            </>
          }
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
        />
        <TextField
          name="user"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>用户名
            </>
          }
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
        />
        <PasswordField
          name="passwd"
          label={
            <>
              <span className="tw-text-red-600 tw-mr-1">*</span>密码
            </>
          }
          autoComplete="off"
          showPrefixIcon
          placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
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
}

ConfigForm.propTypes = propTypes

export default forwardRef(ConfigForm)
