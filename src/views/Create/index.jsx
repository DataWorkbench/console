import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Alert, Checkbox } from '@QCFE/lego-ui'
import styles from './styles.module.scss'

function Create() {
  const { step } = useParams()
  const history = useHistory()
  if (!step || step === '0') {
    return (
      <div className="tw-flex tw-flex-1 tw-justify-center tw-bg-neut-2 tw-h-full">
        <div className="tw-m-3 tw-flex-1 tw-rounded-md tw-bg-white">
          <div
            className={`${styles.infoIcon} tw-w-8/12 tw-m-auto tw-mt-5 tw-pt-9`}
          >
            <div className="tw-font-medium tw-text-xl tw-pb-3 tw-text-neut-19">
              您还未开通「大数据平台」
            </div>
            <div className="tw-text-xs tw-pb-6 tw-text-neut-8 tw-font-medium">
              大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。了解更多
            </div>
            <div>
              <Button
                type="primary"
                className="tw-text-xs tw-ont-medium tw-px-6 tw-h-8 tw-box-border"
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
      <div className="tw-flex-1 tw-bg-neut-2">
        <div className="tw-font-medium tw-text-2xl tw-py-7 tw-leading-7 tw-pl-32 tw-bg-white">
          大数据平台
        </div>
        <div className="tw-flex-1 tw-w-10/12 tw-mx-auto">
          <Alert
            message="购买前建议详细了解 QingCloud 青云的《服务协议》，如违反该协议，QingCloud 青云将有权随时单方采取限制，中止或者终止服务、封号等措施，并不予退订/退款。"
            type="warning"
            className="tw-mt-5"
          />
          <div className="tw-mt-5 tw-bg-white  tw-py-7 tw-rounded-sm">
            <div className="tw-px-16">
              <div className="tw-flex tw-mb-8">
                <div className="tw-pr-9 tw-text-sm tw-leading-8">开通产品</div>
                <div>
                  <Button type="outlined">大数据平台</Button>
                </div>
              </div>
              <div className="tw-flex tw-mb-8">
                <div className="tw-pr-9 tw-text-sm">开通说明</div>
                <div>
                  完成个人认证且账户余额大于 0
                  元的用户可以直接开通，开通后按实际使用量计费。
                </div>
              </div>
              <div className="tw-flex tw-mb-8 tw-border-t tw-border-neut-2 tw-pt-5">
                <div className="tw-pr-9 tw-text-sm">服务协议</div>
                <div>
                  <Checkbox>
                    已阅读并同意
                    <a href="##" className="tw-text-link">
                      《大数据平台服务条款》
                    </a>
                  </Checkbox>
                </div>
              </div>
            </div>
            <div className="tw-border-t tw-border-neut-2 tw-pt-6 tw-pl-32 tw-pr-14 tw-flex tw-justify-between tw-items-center">
              <Button type="primary" onClick={() => history.push('/create/2')}>
                确定开通
              </Button>

              <div>
                <a href="##" className="tw-text-link tw-mr-5">
                  了解计费方式
                </a>
                <a href="##" className="tw-text-link">
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
      <div className="tw-flex-1 tw-flex tw-justify-center tw-bg-neut-2 tw-h-full">
        <div className="tw-m-3 tw-flex-1 tw-rounded-md tw-bg-white">
          <div
            className={`${styles.step2Icon} tw-w-8/12 tw-m-auto tw-mt-28 tw-pt-9`}
          >
            <div className="tw-font-medium tw-text-xl tw-pb-3 tw-text-neut-19">
              产品初始化配置中，请稍等…
            </div>
            <div className="tw-text-xs tw-pb-6 tw-text-neut-8 tw-font-medium">
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
