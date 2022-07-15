import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { LegendComponent } from 'echarts/components'
import { useEffect, useState } from 'react'

echarts.use([PieChart, LegendComponent])
interface Props {
  id: string
  title: string
  amount: number
  pieData: { value: number; name: string }[]
}
export const Pie = ({ id, title, amount, pieData }: Props) => {
  const [cuName, setCuName] = useState('')
  const [cuValue, setCuValue] = useState('')
  useEffect(() => {
    const myChart = echarts.init(document.getElementById(id as any) as any)
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1D2B3A',
        borderColor: '#1D2B3A',
        borderRadius: 3,
        formatter(param: any) {
          setCuName(param.name)
          setCuValue(param.value)
          let res = ''
          res += `<div style="background:#1D2B3A;font-size:12px;border-radius:3px">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${param.color}"></span>
                    <span style="color:#fff">${param.name}占比：</span>
                    <span style="color:${param.color}">${param.value}</span>
                  </div>`
          return res
        },
      },
      legend: {
        show: false,
      },
      color: ['#14B8A6', '#b7c8d8', '#0284C7', '#CF3B37', '#A855F7'],
      series: [
        {
          type: 'pie',
          radius: '100%',
          avoidLabelOverlap: true,
          data: pieData,
          label: {
            show: false,
          },
          hoverAnimation: false,
          itemStyle: {
            opacity: 0.4,
          },
          emphasis: {
            itemStyle: {
              opacity: 1,
            },
          },
        },
      ],
    }
    myChart.setOption(option)
  })
  return (
    <div tw="flex mb-[4px]">
      <div id={id} tw="w-[52px] h-[52px]" />
      <div tw="text-[white]">
        <div tw="w-[114px] text-[14px] ml-[16px]">
          {
            // eslint-disable-next-line
            id === 'cu' ? (cuName ? `${title}(${cuName})` : title) : title
          }
        </div>
        <div tw="text-[20px] ml-[16px]">
          {id === 'cu' ? cuValue || amount : amount}
        </div>
      </div>
    </div>
  )
}

export default Pie
