import { Alert, Checkbox, Button } from '@QCFE/lego-ui'
import { useHistory } from 'react-router-dom'
import { TextLink, HelpCenterLink } from 'components'
import { useState } from 'react'
import { activateDataomnis } from 'stores/api'
import DataOmnisLoading from 'assets/data_omnis_loading.svg'

const ActivateDataOmnis = () => {
  const history = useHistory()
  const [checked, setChecked] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleActivateDataOmnis = async () => {
    setLoading(true)

    const ret = await activateDataomnis()
    if (ret.ret_code === 0) {
      history.push('/overview')
    }

    setLoading(false)
  }

  return loading ? (
    <div tw="flex-1 flex justify-start bg-neut-2 h-full">
      <div tw="m-5 flex flex-1 rounded-md bg-white pt-[118px]">
        <div
          tw="bg-contain bg-no-repeat bg-left w-[160px] h-[160px] ml-[347px]"
          css={{
            backgroundImage: `url(${DataOmnisLoading})`,
          }}
        />
        <div tw="w-8/12 mx-auto ml-10 pt-10">
          <div tw="font-medium text-xl pb-3 text-neut-19">
            产品初始化配置中，请稍等…
          </div>
          <div tw="text-xs pb-6 text-neut-8 font-medium max-w-[540px]">
            提供云端一站式智能大数据开发平台，帮助企业专注于数据价值的挖掘和探索，提升客户数据洞察能力。专注于解决业务计算问题，降低数据工程师开发和使用成本，安全稳定。实现数据在云平台各产品之间快速流转，支撑上层业务应用，消除企业数据孤岛，统一调度和计算。
            <HelpCenterLink
              tw="text-green-11! cursor-pointer no-underline"
              href="/intro/introduction/"
            >
              了解更多
            </HelpCenterLink>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div tw="flex-1 bg-neut-2">
      <div tw="font-medium text-2xl py-7 leading-7 pl-32 bg-white">
        大数据工作台
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
                <Button type="outlined" tw="px-5 h-9 bg-green-2! cursor-auto">
                  大数据工作台
                </Button>
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
                <Checkbox
                  tw="text-neut-8!"
                  checked={checked}
                  onChange={(_, value) => {
                    setChecked(value)
                  }}
                >
                  已阅读并同意
                  <TextLink
                    tw="no-underline"
                    href="//www.qingcloud.com/terms#terms"
                    target="_blank"
                    hasIcon={false}
                  >
                    《QingCloud 服务条款》
                  </TextLink>
                  <HelpCenterLink
                    tw="no-underline"
                    href="/protocol/beta_rules/"
                    isIframe={false}
                    hasIcon={false}
                  >
                    《大数据工作台公测规则》
                  </HelpCenterLink>
                </Checkbox>
              </div>
            </div>
          </div>
          <div tw="border-t border-neut-2 pt-6 pl-[152px] pr-14 flex justify-between items-center">
            <Button
              type="primary"
              tw="px-6 transition-all duration-500"
              onClick={handleActivateDataOmnis}
              disabled={!checked}
            >
              申请公测
            </Button>

            <div>
              <HelpCenterLink
                tw="no-underline"
                href="/billing/price/"
                isIframe={false}
              >
                了解计费方式
              </HelpCenterLink>
              {/* <HelpCenterLink tw="no-underline ml-5" href="/" isIframe={false}>
                查看接口文档
              </HelpCenterLink> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivateDataOmnis
