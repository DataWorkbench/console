import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Control, RadioButton, RadioGroup } from '@QCFE/lego-ui'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import Card from 'components/Card'
import styles from './styles.module.scss'

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
          <div className="border-l border-neutral-N-3 mr-2" />
          <RadioGroup name="states" defaultValue="ReadOnly">
            <RadioButton value="ReadOnly">卡片视图</RadioButton>
            <RadioButton value="Write">列表视图</RadioButton>
          </RadioGroup>
        </div>
      </div>
      <div className="flex flex-wrap">
        {dataSource.map((ws) => {
          return (
            <div className={`${styles.workspace} w-1/2`}>
              <Card className="rounded border-neutral-N-6 border-t-4 border-t-brand-G3  text-neutral-N-8">
                <div className="flex justify-between px-4 pt-5 mb-7 ">
                  <div className="flex-1 flex">
                    <div className="w-11 h-11 flex justify-center items-center bg-brand-G1 text-brand-G11 text-base font-medium rounded-sm">
                      {ws.title.substr(0, 1)}
                    </div>
                    <div className="ml-3 text-neutral-N-8">
                      <div className="text-neutral-N-8 flex items-center">
                        <span className="font-medium text-base text-neutral-N-15">
                          {ws.title}
                        </span>
                        <span>（spaceid-ienng87）</span>
                        <span className="py-1 px-3 bg-brand-G0 text-brand-G11 rounded-2xl inline-flex items-center">
                          <Icon
                            name="radio"
                            color={{
                              primary: '#00AA72',
                              secondary: '#DFF7ED',
                            }}
                          />
                          已禁用
                        </span>
                      </div>
                      <div>这是一段很长的关于工作空间的描述信息。</div>
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
                <div className="px-5 py-4 flex justify-center bg-neutral-N-1 border-t">
                  <Button className="mr-4">数据上云</Button>
                  <Button className="mr-4">数据上云</Button>
                  <Button>数据上云</Button>
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
