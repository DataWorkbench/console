import { FlexBox } from 'components/Box'
import { useQueryGeneraView } from 'hooks'
import { useEffect, useState } from 'react'
import { get } from 'lodash-es'
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
  const [devReleaseTotal, setDevReleaseTotal] = useState(0)
  const [gatherReleaseTotal, setGatherReleaseTotal] = useState(0)
  const [devInstanceTotal, setDevInstanceTotal] = useState(0)
  const [gatherInstanceTotal, setGatherInstanceTotal] = useState(0)
  const [cuTotal, setCuTotal] = useState(0)
  const [clusterTotal, setClusterTotal] = useState(0)
  const [devReleaseData, setDevReleaseData] = useState<
    { value: number; name: string }[]
  >([])
  const [gatherReleaseData, setGatherReleaseData] = useState<
    { value: number; name: string }[]
  >([])
  const [devInstanceData, setDevInstanceData] = useState<
    { value: number; name: string; color: string }[]
  >([])
  const [gatherInstanceData, setGatherInstanceData] = useState<
    { value: number; name: string; color: string }[]
  >([])
  const [cuData, setCuData] = useState<{ value: number; name: string }[]>([])
  const [clusterData, setClusterData] = useState<
    { value: number; name: string }[]
  >([])
  const [clusterStatusData, setClusterStatusData] = useState<
    { value: number; name: string; color: string }[]
  >([])

  useEffect(() => {
    if (get(generaViewData, 'overview')) {
      const { overview } = generaViewData
      const {
        stream_job_release: devRelease,
        sync_job_release: gatherRelease,
        stream_job_instance: devInstance,
        sync_job_instance: gatherInstance,
        flink_cluster: calcCluster,
      } = overview
      setDevReleaseTotal(devRelease?.total ?? 0)
      setGatherReleaseTotal(gatherRelease?.total ?? 0)
      setDevInstanceTotal(devInstance?.total ?? 0)
      setGatherInstanceTotal(gatherInstance?.total ?? 0)
      setCuTotal(calcCluster?.cu_total ?? 0)
      setClusterTotal(calcCluster?.cluster_total ?? 0)

      const commonRelease = [
        { name: '调度中' },
        { name: '已暂停' },
        { name: '已完成' },
      ]
      const statusRelease = ['inline', 'offline', 'finished']
      const devReleaseVal = commonRelease.map((item, index) => ({
        ...item,
        value: devRelease[statusRelease[index]],
      }))
      const GatherReleaseVal = commonRelease.map((item, index) => ({
        ...item,
        value: gatherRelease[statusRelease[index]],
      }))
      setDevReleaseData(devReleaseVal)
      setGatherReleaseData(GatherReleaseVal)

      const commonInstance = [
        {
          name: '运行中',
          color: '#3B82F6',
        },
        {
          name: '运行成功',
          color: '#14B8A6',
        },
        {
          name: '准备资源',
          color: '#FFE278',
        },
        {
          name: '已终止',
          color: '#B7C8D8',
        },
        {
          name: '运行超时',
          color: '#F97316',
        },
        {
          name: '运行失败',
          color: '#CF3B37',
        },
        {
          name: '运行重试',
          color: '#A855F7',
        },
      ]
      const statusInstance = [
        'running',
        'succeed',
        'pending',
        'terminated',
        'timeout',
        'failed',
        'retrying',
      ]
      const devInstanceVal = commonInstance.map((item, index) => ({
        ...item,
        value: devInstance[statusInstance[index]],
      }))
      const gatherInstanceVal = commonInstance.map((item, index) => ({
        ...item,
        value: gatherInstance[statusInstance[index]],
      }))
      setDevInstanceData(devInstanceVal)
      setGatherInstanceData(gatherInstanceVal)

      const {
        cu_running: cuRunning,
        cu_stopped: cuStopped,
        cluster_running: running,
        cluster_stopped: stopped,
        cluster_starting: starting,
        cluster_exception: exception,
        cluster_arrears: arrears,
      } = calcCluster
      setCuData([
        { value: cuRunning, name: '活跃' },
        { value: cuStopped, name: '非活跃' },
      ])
      setClusterData([
        { value: running, name: '运行中集群' },
        { value: stopped, name: '停止集群' },
        { value: starting, name: '启动中集群' },
        { value: exception, name: '异常集群' },
        { value: arrears, name: '欠费集群' },
      ])
      setClusterStatusData([
        { value: running, name: '运行中', color: '#14B8A6' },
        { value: starting, name: '启动中', color: '#0284C7' },
        { value: stopped, name: '已停止', color: '#B7C8D8' },
        { value: exception, name: '异常', color: '#CF3B37' },
        { value: arrears, name: '欠费', color: '#A855F7' },
      ])
    }
  }, [generaViewData])

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
            amount={devReleaseTotal}
            id="develop"
            statusData={devReleaseData}
          />
          <Release
            iconName="IotFill"
            name="数据集成作业"
            amount={gatherReleaseTotal}
            id="integrate"
            statusData={gatherReleaseData}
          />
        </FlexBox>
      </FlexBox>
      <FlexBox tw="mt-[20px] mb-[20px] justify-between">
        <Example
          textTitle="数据开发 - 作业实例"
          statusData={devInstanceData}
          total={devInstanceTotal}
        />
        <Example
          textTitle="数据集成 - 作业实例"
          statusData={gatherInstanceData}
          total={gatherInstanceTotal}
        />
      </FlexBox>
      <FlexBox
        orient="column"
        tw="pt-6 pb-6 pl-5 pr-5 gap-5 bg-neut-16 rounded-[4px] h-[172px]"
      >
        <TextTitle>计算集群</TextTitle>
        <FlexBox tw="items-center h-[80px]">
          <FlexBox tw="w-[50%] h-[80px] justify-between items-center">
            <Hexagon />
            <Pie id="cu" title="总 CU 数" amount={cuTotal} pieData={cuData} />
            <Pie
              id="cluster"
              title="计算集群总数"
              amount={clusterTotal}
              pieData={clusterData}
            />
          </FlexBox>
          <div tw="h-[74px] w-[1px] bg-[#4C5E70]" />
          <StatusCard dataStatus={clusterStatusData} />
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default Index
