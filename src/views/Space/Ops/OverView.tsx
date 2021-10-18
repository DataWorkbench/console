import { useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import { Icons } from 'components'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import screen0 from 'assets/screen_0.svg'
import screen1 from 'assets/screen_1.svg'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
])

export const OverView = () => {
  const insRef = useRef<HTMLTableSectionElement>()
  const [chart, setChart] = useState(null)
  useMount(() => {
    if (insRef.current) {
      const mychart = echarts.init(insRef.current, 'dark')
      const option = {
        title: {
          text: '实例完成情况',
          left: '2%',
          top: '2',
          textStyle: { fontSize: 14 },
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          left: '130',
          top: '2',
          data: ['今天', '昨天', '历史平均'],
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true,
        },
        backgroundColor: '#273849',
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: Array.from({ length: 24 }, (v, k) => `${k}:00`),
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#4C5E70',
            },
          },
        },
        series: [
          {
            name: '今天',
            data: [
              2, 3, 5, 8, 10, 12, 14, 11, 13, 15, 16, 18, 20, 22, 20, 21, 23,
              20, 24, 25, 26, 28, 26, 30,
            ],
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 1,
            },
          },
          {
            name: '昨天',
            data: [
              1, 2, 3, 4, 6, 8, 10, 11, 9, 11, 12, 15, 11, 10, 13, 12, 16, 18,
              20, 18, 19, 20, 21, 22,
            ],
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 1,
            },
          },
          {
            name: '历史平均',
            data: [
              3, 6, 7, 4, 8, 10, 8, 6, 9, 10, 12, 10, 11, 13, 15, 16, 17, 13,
              19, 22, 20, 21, 23, 20,
            ],
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 1,
            },
          },
        ],
      }
      mychart.setOption(option)
      setChart(mychart)
    }
  })
  useUnmount(() => {
    if (chart) {
      chart.dispose()
    }
  })
  return (
    <div tw="p-5 text-white">
      <section tw="bg-neut-16 rounded-b text-sm mb-5">
        <div
          tw="h-2 "
          style={{
            background:
              'linear-gradient(90deg, #9CB4FA 0.55%, #94E2D0 19.59%, #8CADC8 42.24%, #F3A784 60.25%, #E49695 81.35%, #7E90E5 99.36%)',
          }}
        />
        <div tw="px-5 pt-6 pb-10">
          <div tw="mb-6 flex items-center">
            <Icon name="dashboard" type="light" />
            资源概览<span tw="text-neut-8">（周期实例）</span>
          </div>
          <div tw="flex justify-between items-center 2xl:w-4/5 mx-auto">
            <div tw="flex relative border border-neut-13 rounded-lg px-8 py-5">
              <div
                tw="absolute h-14 w-1 top-5  left-0 rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #D44E4B 0%, #E89A9B 91.47%)',
                }}
              />
              <Icons name="screen_failed" size={32} />
              <div tw="ml-3 2xl:ml-6">
                <div tw="pb-1">运行失败实例</div>
                <div tw="text-2xl font-mono">24</div>
              </div>
            </div>
            <div tw="flex relative border border-neut-13 rounded-lg px-8 py-5">
              <div
                tw="absolute h-14 w-1 top-5  left-0 rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #D44E4B 0%, #E89A9B 91.47%)',
                }}
              />
              <Icons name="screen_running" size={32} />
              <div tw="ml-3 2xl:ml-6">
                <div tw="pb-1">运行中实例</div>
                <div tw="text-2xl font-mono">12</div>
              </div>
            </div>
            <div tw="flex relative border border-neut-13 rounded-lg px-8 py-5">
              <div
                tw="absolute h-14 w-1 top-5  left-0 rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #229CE9 0%, #79C0F3 91.47%)',
                }}
              />
              <Icons name="screen_success" size={32} />
              <div tw="ml-3 2xl:ml-6">
                <div tw="pb-1">运行成功实例</div>
                <div tw="text-2xl font-mono">36</div>
              </div>
            </div>
            <div tw="flex relative border border-neut-13 rounded-lg px-8 py-5">
              <div
                tw="absolute h-14 w-1 top-5  left-0 rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #934BC5 0%, #C096E0 91.47%)',
                }}
              />
              <Icons name="screen_waiting" size={32} />
              <div tw="ml-3 2xl:ml-6">
                <div tw="pb-1">等资源实例</div>
                <div tw="text-2xl font-mono">26</div>
              </div>
            </div>
            <div tw="flex relative border border-neut-13 rounded-lg px-8 py-5">
              <div
                tw="absolute h-14 w-1 top-5  left-0 rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #939EA9 0%, #B6C2CD 91.47%)',
                }}
              />
              <Icons name="screen_stoped" size={32} />
              <div tw="ml-3 2xl:ml-6">
                <div tw="pb-1">未运行实例</div>
                <div tw="text-2xl font-mono">2</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section tw="bg-neut-16 rounded-b text-sm mb-5 h-72" ref={insRef} />
      <section tw="flex justify-center mb-5">
        <div tw="w-1/2 ">
          <img src={screen0} alt="" tw="mx-auto w-10/12" />
        </div>
        <div tw="w-1/2">
          <img src={screen1} alt="" tw="mx-auto w-10/12" />
        </div>
      </section>
      <section tw="flex justify-center mb-5">
        <div tw="w-1/2 ">
          <img src={screen0} alt="" tw="mx-auto w-10/12" />
        </div>
        <div tw="w-1/2">
          <img src={screen1} alt="" tw="mx-auto w-10/12" />
        </div>
      </section>
    </div>
  )
}

export default OverView
