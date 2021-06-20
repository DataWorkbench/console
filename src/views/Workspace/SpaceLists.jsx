import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Button, Input, Control, RadioButton, RadioGroup } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import Card from 'components/Card'
import styles from './styles.module.css'

function getProfileName(str) {
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  const profileName = str.substr(0, 2)
  if (pattern.test(profileName)) {
    return str.substr(0, 1)
  }
  return profileName
}

const SpaceLists = ({ className, dataSource }) => {
  return (
    <div className={className}>
      <div className="flex justify-between mb-5 ">
        <div>
          <Button type="primary" className="font-medium px-5">
            创建工作空间
          </Button>
        </div>
        <div className="flex items-stretch">
          <Control className="has-icons-left mr-2">
            <Icon className="is-left" name="magnifier" />
            <Input type="text" placeholder="请输入工作名称/ID" />
          </Control>
          <Button className="mr-2">
            <Icon name="if-refresh" className="text-xl" />
          </Button>
          <Button className="mr-2">
            <Icon name="if-column" className="text-base" />
          </Button>
          <div className="border-l border-neutral-N3 mr-2" />
          <RadioGroup name="states" defaultValue="ReadOnly">
            <RadioButton value="ReadOnly">卡片视图</RadioButton>
            <RadioButton value="Write">列表视图</RadioButton>
          </RadioGroup>
        </div>
      </div>
      <div className="flex flex-wrap">
        {dataSource.map((ws, i) => {
          return (
            <div key={ws.id} className={`${styles.workspace} w-1/2`}>
              <Card
                className={clsx(
                  styles[`ws_${i % 5}`],
                  'rounded border border-t-4 text-neutral-N8'
                )}
              >
                <div className="flex justify-between px-4 pt-5 mb-7 ">
                  <div className="flex-1 flex">
                    <div
                      className={clsx(
                        'w-11 h-11 flex justify-center items-center text-base font-medium rounded-sm',
                        styles.profile
                      )}
                    >
                      {getProfileName(ws.title)}
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="font-medium text-base text-neutral-N16">
                          {ws.title}
                        </span>
                        <span>（{ws.id}）</span>
                        <span
                          className={clsx(
                            'py-0.5 px-3 rounded-2xl inline-flex items-center',
                            ws.status === 'active'
                              ? styles.st_active
                              : styles.st_forbidden
                          )}
                        >
                          <Icon name="radio" />
                          {ws.status === 'active' ? '活跃' : '已禁用'}
                        </span>
                      </div>
                      <div className="pt-1">{ws.subtitle}</div>
                    </div>
                  </div>
                  <div>
                    <Icon name="more" changeable clickable />
                  </div>
                </div>
                <div className="flex justify-between px-4 mb-3">
                  <div>
                    <span>我的角色：</span>
                    <span>空间所有者</span>
                  </div>
                  <div>
                    <span>空间成员</span>
                  </div>
                </div>
                <div className="flex justify-between px-4 mb-3">
                  <div>
                    <span>开通引擎：</span>
                    <span>共享Flink、QingMR、Deep Learning...查看</span>
                  </div>
                  <div>
                    <span>创建时间：2021-03-17</span>
                  </div>
                </div>
                <div className="px-5 py-4 flex justify-center bg-neutral-N1 border-t border-neutral-N3">
                  <button type="button" className={`${styles.opbtn}`}>
                    数据上云
                  </button>
                  <button type="button" className={`${styles.opbtn}`}>
                    数据上云
                  </button>
                  <button type="button" className={`${styles.opbtn}`}>
                    数据上云
                  </button>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

SpaceLists.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.array,
}

export default SpaceLists
