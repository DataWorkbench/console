import { FlexBox } from 'components/Box'
import { useQueryGeneraView } from 'hooks'
import {
  Release,
  TextTitle,
  Example,
  Pie,
  StatusCard,
  Hexagon,
} from './components'

const Index = () => {
  const { data: generaViewData } = useQueryGeneraView()
  console.log(generaViewData)
  const data1 = [
    { value: 1048, name: '调度中' },
    { value: 735, name: '已暂停' },
    { value: 580, name: '已完成' },
  ]
  const data2 = [
    { value: 10466, name: '调度中' },
    { value: 735, name: '已暂停' },
    { value: 5800, name: '已完成' },
  ]
  const data3 = [
    { value: 1066, name: '活跃' },
    { value: 735, name: '非活跃' },
  ]
  const data4 = [
    { value: 1066, name: '运行中集群' },
    { value: 735, name: '停止集群' },
    { value: 735, name: '启动中集群' },
    { value: 735, name: '异常集群' },
    { value: 735, name: '欠费集群' },
  ]
  const data5 = [
    { value: 1066, name: '运行中', color: '#14B8A6' },
    { value: 735, name: '启动中', color: '#0284C7' },
    { value: 735, name: '已停止', color: '#B7C8D8' },
    { value: 735, name: '异常', color: '#CF3B37' },
    { value: 735, name: '欠费', color: '#A855F7' },
  ]
  const data6 = [
    {
      name: '运行中',
      value: '0',
      color: '#3B82F6',
    },
    {
      name: '运行成功',
      value: '40',
      color: '#14B8A6',
    },
    {
      name: '准备资源',
      value: '2',
      color: '#FFE278',
    },
    {
      name: '已终止',
      value: '5',
      color: '#B7C8D8',
    },
    {
      name: '运行超时',
      value: '1',
      color: '#F97316',
    },
    {
      name: '运行失败',
      value: '1',
      color: '#CF3B37',
    },
    {
      name: '运行重试',
      value: '1',
      color: '#A855F7',
    },
  ]
  return (
    <FlexBox orient="column" tw="p-5 h-full">
      <FlexBox
        orient="column"
        tw="pt-6 pb-6 pl-5 pr-5 gap-5 bg-neut-16 rounded-[4px]"
      >
        <TextTitle>已发布作业</TextTitle>
        <FlexBox tw="justify-between">
          <Release
            iconName="EventFill"
            name="数据开发作业"
            amount={24}
            id="develop"
            statusData={data1}
          />
          <Release
            iconName="IotFill"
            name="数据集成作业"
            amount={32}
            id="integrate"
            statusData={data2}
          />
        </FlexBox>
      </FlexBox>
      <FlexBox tw="mt-[20px] mb-[20px] justify-between">
        <Example
          textTitle="数据开发 - 作业实例"
          statusData={data6}
          total={50}
        />
        <Example textTitle="数据集成 - 作业实例" statusData={data6} total={0} />
      </FlexBox>
      <FlexBox
        orient="column"
        tw="pt-6 pb-6 pl-5 pr-5 gap-5 bg-neut-16 rounded-[4px] h-[172px]"
      >
        <TextTitle>计算集群</TextTitle>
        <FlexBox tw="items-center h-[80px]">
          <FlexBox tw="w-[50%] h-[80px] justify-between items-center">
            <Hexagon />
            <Pie id="cu" title="总 CU 数" amount={78} pieData={data3} />
            <Pie
              id="cluster"
              title="计算集群总数"
              amount={14}
              pieData={data4}
            />
          </FlexBox>
          <div tw="h-[74px] w-[1px] bg-[#4C5E70]" />
          <StatusCard dataStatus={data5} />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default Index
