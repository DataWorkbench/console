import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Control } from '@QCFE/lego-ui'
import { Alert, Form, Button, Icon } from '@QCFE/qingcloud-portal-ui'
import DbItem from './DbItem'

const { TextField, TextAreaField } = Form

export default class ConfigForm extends Component {
  static propTypes = {
    db: PropTypes.object,
  }

  constructor(prop) {
    super(prop)
    this.state = {
      ip: '',
    }
  }

  render() {
    const { db } = this.props
    const { ip } = this.state
    return (
      <div>
        <Alert
          message="数据源使用需要保证对应的资源组和数据源之间是可以联通的。请参考资 网络解决方案。"
          type="warning"
        />
        <Form layout="vertical">
          <Field>
            <Label>数据源类型</Label>
            <Control>
              <DbItem title={db.name} disp={db.disp} selected />
            </Control>
          </Field>
          <TextField
            label="*数据源名称"
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <TextAreaField
            label="数据源描述"
            placeholder="请填写数据库的描述信息"
          />
          <TextField
            label="*IP 地址"
            defaultValue={ip}
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <TextField
            label="*端口号"
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <TextField
            label="*Database"
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <TextField
            label="*用户名"
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <TextField
            label="*密码"
            placeholder={`输入名称，允许包含字母、数字 及 "_"，长度 2-128`}
          />
          <Field>
            <Label>连通性测试</Label>
            <Control>
              <Button type="outlined">
                <Icon name="sort-ascending" />
                开始测试
              </Button>
            </Control>
          </Field>
        </Form>
      </div>
    )
  }
}
