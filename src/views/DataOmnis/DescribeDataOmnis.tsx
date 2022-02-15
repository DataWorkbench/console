import { Button } from '@QCFE/lego-ui'
import DataOmnisIcon from 'assets/data_omnis_describe.svg'
import { useHistory } from 'react-router-dom'
import { HelpCenterLink } from 'components'

const DescribeDataOmnis = () => {
  const history = useHistory()
  return (
    <div tw="flex flex-1 justify-center bg-neut-2 h-full">
      <div tw="m-5 flex flex-1 rounded-md bg-white pt-9">
        <div
          tw="ml-[234px] bg-no-repeat bg-contain bg-left w-[350px] h-[220px]"
          css={{
            backgroundImage: `url(${DataOmnisIcon})`,
          }}
        />
        <div tw="w-8/12 m-auto mt-5 ml-[41px] pt-9">
          <div tw="font-medium text-xl pb-3 text-neut-19">
            您还未开通「大数据工作台」
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
          <div>
            <Button
              type="primary"
              tw="text-xs font-medium px-6 h-8 box-border"
              onClick={() => history.push('/activate')}
            >
              申请公测
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DescribeDataOmnis
