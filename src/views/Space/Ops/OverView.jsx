import React, { useRef, useState } from 'react'
import { useMount, useUnmount } from 'react-use'
import { Icon } from '@QCFE/qingcloud-portal-ui'
import MyIcon from 'components/Icon'
import * as echarts from 'echarts'
import screen0 from 'assets/screen_0.svg'
import screen1 from 'assets/screen_1.svg'

function OverView() {
  const insRef = useRef()
  const [chart, setChart] = useState(null)
  useMount(() => {
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
            2, 3, 5, 8, 10, 12, 14, 11, 13, 15, 16, 18, 20, 22, 20, 21, 23, 20,
            24, 25, 26, 28, 26, 30,
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
            1, 2, 3, 4, 6, 8, 10, 11, 9, 11, 12, 15, 11, 10, 13, 12, 16, 18, 20,
            18, 19, 20, 21, 22,
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
            3, 6, 7, 4, 8, 10, 8, 6, 9, 10, 12, 10, 11, 13, 15, 16, 17, 13, 19,
            22, 20, 21, 23, 20,
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
  })
  useUnmount(() => {
    if (chart) {
      chart.dispose()
    }
  })
  return (
    <div className="tw-p-5 tw-text-white">
      <section className="tw-bg-neutral-N16 tw-rounded-b tw-text-sm tw-mb-5">
        <div
          className="tw-h-2 "
          style={{
            background:
              'linear-gradient(90deg, #9CB4FA 0.55%, #94E2D0 19.59%, #8CADC8 42.24%, #F3A784 60.25%, #E49695 81.35%, #7E90E5 99.36%)',
          }}
        />
        <div className="tw-px-5 tw-pt-6 tw-pb-10">
          <div className=" tw-mb-6 tw-flex tw-items-center">
            <Icon name="dashboard" type="light" />
            资源概览<span className="tw-text-neutral-N8">（周期实例）</span>
          </div>
          <div className="tw-flex tw-justify-between tw-items-center tw-w-4/5 tw-mx-auto">
            <div className="tw-flex tw-relative tw-border tw-border-neutral-N13 tw-rounded-lg tw-px-8 tw-py-5">
              <div
                className="tw-absolute tw-h-14 tw-w-1 tw-top-5  tw-left-0 tw-rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #D44E4B 0%, #E89A9B 91.47%)',
                }}
              />
              <MyIcon name="screen_failed" size={32} />
              <div className="tw-ml-6">
                <div className="tw-pb-1">运行失败实例</div>
                <div className="tw-text-2xl tw-font-mono">24</div>
              </div>
            </div>
            <div className="tw-flex tw-relative tw-border tw-border-neutral-N13 tw-rounded-lg tw-px-8 tw-py-5">
              <div
                className="tw-absolute tw-h-14 tw-w-1 tw-top-5  tw-left-0 tw-rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #D44E4B 0%, #E89A9B 91.47%)',
                }}
              />
              <MyIcon name="screen_running" size={32} />
              <div className="tw-ml-6">
                <div className="tw-pb-1">运行中实例</div>
                <div className="tw-text-2xl tw-font-mono">12</div>
              </div>
            </div>
            <div className="tw-flex tw-relative tw-border tw-border-neutral-N13 tw-rounded-lg tw-px-8 tw-py-5">
              <div
                className="tw-absolute tw-h-14 tw-w-1 tw-top-5  tw-left-0 tw-rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #229CE9 0%, #79C0F3 91.47%)',
                }}
              />
              <MyIcon name="screen_success" size={32} />
              <div className="tw-ml-6">
                <div className="tw-pb-1">运行成功实例</div>
                <div className="tw-text-2xl tw-font-mono">36</div>
              </div>
            </div>
            <div className="tw-flex tw-relative tw-border tw-border-neutral-N13 tw-rounded-lg tw-px-8 tw-py-5">
              <div
                className="tw-absolute tw-h-14 tw-w-1 tw-top-5  tw-left-0 tw-rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #934BC5 0%, #C096E0 91.47%)',
                }}
              />
              <MyIcon name="screen_waiting" size={32} />
              <div className="tw-ml-6">
                <div className="tw-pb-1">等资源实例</div>
                <div className="tw-text-2xl tw-font-mono">26</div>
              </div>
            </div>
            <div className="tw-flex tw-relative tw-border tw-border-neutral-N13 tw-rounded-lg tw-px-8 tw-py-5">
              <div
                className="tw-absolute tw-h-14 tw-w-1 tw-top-5  tw-left-0 tw-rounded"
                style={{
                  background:
                    'linear-gradient(43.53deg, #939EA9 0%, #B6C2CD 91.47%)',
                }}
              />
              <MyIcon name="screen_stoped" size={32} />
              <div className="tw-ml-6">
                <div className="tw-pb-1">未运行实例</div>
                <div className="tw-text-2xl tw-font-mono">2</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="tw-bg-neutral-N16 tw-rounded-b tw-text-sm tw-mb-5 tw-h-72"
        ref={insRef}
      />
      <section className="tw-flex tw-justify-center tw-mb-5">
        <div className="tw-w-1/2 ">
          <img src={screen0} alt="" className="tw-mx-auto tw-w-10/12" />
        </div>
        <div className="tw-w-1/2">
          <img src={screen1} alt="" className="tw-mx-auto tw-w-10/12" />
        </div>
      </section>
      <section className="tw-flex tw-justify-center tw-mb-5">
        <div className="tw-w-1/2 ">
          <img src={screen0} alt="" className="tw-mx-auto tw-w-10/12" />
        </div>
        <div className="tw-w-1/2">
          <img src={screen1} alt="" className="tw-mx-auto tw-w-10/12" />
        </div>
      </section>
    </div>
  )
}

export default OverView
