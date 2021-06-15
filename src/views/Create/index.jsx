import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Alert, Checkbox } from '@QCFE/lego-ui'
import styles from './styles.module.scss'

function Create() {
  const { step } = useParams()
  const history = useHistory()
  if (!step || step === '0') {
    return (
      <div className="flex flex-1 justify-center bg-neutral-N-2 h-full">
        <div className="m-3 flex-1 rounded-md bg-white">
          <div className={`${styles.infoIcon} w-8/12 m-auto mt-5 pt-9`}>
            <div className="font-medium text-xl pb-3 text-text-primary">
              您还未开通「大数据平台」
            </div>
            <div className="text-xs pb-6 text-text-tertiary font-medium">
              大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。了解更多
            </div>
            <div>
              <Button
                type="primary"
                className="text-xs font-medium px-6 h-8 box-border"
                onClick={() => history.push('/create/1')}
              >
                立即开通
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (step === '1') {
    return (
      <div className="flex-1 bg-neutral-N-2">
        <div className="font-medium text-2xl py-7 leading-7 pl-32 bg-white">
          大数据平台
        </div>
        <div className="flex-1 w-10/12 mx-auto">
          <Alert
            message="购买前建议详细了解 QingCloud 青云的《服务协议》，如违反该协议，QingCloud 青云将有权随时单方采取限制，中止或者终止服务、封号等措施，并不予退订/退款。"
            type="warning"
            className="mt-5"
          />
          <div className="mt-5 bg-white  py-7 rounded-sm">
            <div className="px-16">
              <div className="flex mb-8">
                <div className="pr-9 text-sm leading-8">开通产品</div>
                <div>
                  <Button type="outlined">大数据平台</Button>
                </div>
              </div>
              <div className="flex mb-8">
                <div className="pr-9 text-sm">开通说明</div>
                <div>
                  完成个人认证且账户余额大于 0
                  元的用户可以直接开通，开通后按实际使用量计费。
                </div>
              </div>
              <div className="flex mb-8 border-t border-gray-200 pt-5">
                <div className="pr-9 text-sm">服务协议</div>
                <div>
                  <Checkbox>
                    已阅读并同意
                    <a href="##" className="text-link">
                      《大数据平台服务条款》
                    </a>
                  </Checkbox>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 pl-32 pr-14 flex justify-between items-center">
              <Button type="primary" onClick={() => history.push('/create/2')}>
                确定开通
              </Button>

              <div>
                <a href="##" className="text-link mr-5">
                  了解计费方式
                </a>
                <a href="##" className="text-link">
                  查看接口文档
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (step === '2') {
    return (
      <div className="flex-1 flex justify-center bg-neutral-N-2 h-full">
        <div className={` m-3 flex-1 rounded-md bg-white`}>
          <div className={`${styles.step2Icon} w-8/12 m-auto mt-28 pt-9`}>
            <div className="font-medium text-xl pb-3 text-text-primary">
              产品初始化配置中，请稍等…
            </div>
            <div className="text-xs pb-6 text-text-tertiary font-medium">
              大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。了解更多
            </div>
          </div>
        </div>
      </div>
    )
  }
  return <></>
}

export default Create
