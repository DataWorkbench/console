import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, Alert, Checkbox } from '@QCFE/lego-ui'
import { css } from 'twin.macro'
import infoIcon from 'assets/create-intro.svg'
import step2Icon from 'assets/create-step2.svg'

function Create() {
  const { step } = useParams()
  const history = useHistory()
  if (!step || step === '0') {
    return (
      <div tw="flex flex-1 justify-center bg-neut-2 h-full">
        <div tw="m-3 flex flex-1 rounded-md bg-white pt-9">
          <div
            tw="bg-contain ml-[150px] bg-no-repeat bg-left"
            css={css`
              width: 350px;
              height: 220px;
              background-image: url(${infoIcon});
            `}
          />
          <div tw="w-8/12 m-auto mt-5 pt-9">
            <div tw="font-medium text-xl pb-3 text-neut-19">
              您还未开通「大数据平台」
            </div>
            <div tw="text-xs pb-6 text-neut-8 font-medium">
              大数据平台开发一站式智能开发，帮助传统企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，带动大数据周边产品消费。了解更多
            </div>
            <div>
              <Button
                type="primary"
                tw="text-xs font-medium px-6 h-8 box-border"
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
      <div tw="flex-1 bg-neut-2">
        <div tw="font-medium text-2xl py-7 leading-7 pl-32 bg-white">
          大数据平台
        </div>
        <div tw="flex-1 w-10/12 mx-auto">
          <Alert
            message="购买前建议详细了解 QingCloud 青云的《服务协议》，如违反该协议，QingCloud 青云将有权随时单方采取限制，中止或者终止服务、封号等措施，并不予退订/退款。"
            type="warning"
            tw="mt-5"
          />
          <div tw="mt-5 bg-white  py-7 rounded-sm">
            <div tw="px-16">
              <div tw="flex mb-8">
                <div tw="pr-9 text-sm leading-8">开通产品</div>
                <div>
                  <Button type="outlined">大数据平台</Button>
                </div>
              </div>
              <div tw="flex mb-8">
                <div tw="pr-9 text-sm">开通说明</div>
                <div>
                  完成个人认证且账户余额大于 0
                  元的用户可以直接开通，开通后按实际使用量计费。
                </div>
              </div>
              <div tw="flex mb-8 border-t border-neut-2 pt-5">
                <div tw="pr-9 text-sm">服务协议</div>
                <div>
                  <Checkbox>
                    已阅读并同意
                    <a href="##" tw="text-link">
                      《大数据平台服务条款》
                    </a>
                  </Checkbox>
                </div>
              </div>
            </div>
            <div tw="border-t border-neut-2 pt-6 pl-32 pr-14 flex justify-between items-center">
              <Button type="primary" onClick={() => history.push('/create/2')}>
                确定开通
              </Button>

              <div>
                <a href="##" tw="text-link mr-5">
                  了解计费方式
                </a>
                <a href="##" tw="text-link">
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
      <div tw="flex-1 flex justify-center bg-neut-2 h-full">
        <div tw="m-3 flex flex-1 rounded-md bg-white pt-28">
          <div
            tw="bg-contain bg-no-repeat bg-left"
            css={css`
              width: 160px;
              height: 160px;
              margin-left: 160px;
              background-image: url(${step2Icon});
            `}
          />
          <div tw="w-8/12 mx-auto ">
            <div tw="font-medium text-xl pb-3 text-neut-19">
              产品初始化配置中，请稍等…
            </div>
            <div tw="text-xs pb-6 text-neut-8 font-medium">
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
