import { css } from 'twin.macro'
import { Card, CardContent, Icons } from 'components'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { LegendComponent } from 'echarts/components'
import { useEffect } from 'react'

echarts.use([PieChart, LegendComponent])
interface Props {
  iconName: string
  name: string
  amount: number
  id: string
  statusData: { value: number; name: string }[]
}
export const Release = ({ iconName, name, amount, id, statusData }: Props) => {
  useEffect(() => {
    const myChart = echarts.init(document.getElementById(id as any) as any)
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#1D2B3A',
        borderColor: '#1D2B3A',
        borderRadius: 3,
        formatter(param: any) {
          let res = ''
          res += `<div style="background:#1D2B3A;font-size:12px;border-radius:3px">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${param.color}"></span>
                    <span style="color:#fff">${param.name}作业占比：</span>
                    <span style="color:${param.color}">${param.value}</span>
                  </div>`
          return res
        }
      },
      legend: {
        icon: 'circle',
        top: 'middle',
        left: '50%',
        orient: 'vertical',
        itemHeight: 6,
        itemWidth: 6,
        formatter(e: string) {
          const { data } = option.series[0]
          let tarValue: string = ''
          // eslint-disable-next-line no-plusplus
          for (let i: number = 0; i < data.length; i++) {
            if (data[i].name === e) {
              tarValue = String(data[i].value)
            }
          }
          return `{name|${e}} {value|${tarValue}}`
        },
        textStyle: {
          fontSize: 12,
          color: '#939EA9',
          rich: {
            value: {
              color: '#fff',
              fontSize: 16
            }
          }
        }
      },
      color: ['#0284C7', '#F97316', '#14B8A6'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['60%', '100%'],
          center: ['24%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          hoverAnimation: false,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: statusData
        }
      ]
    }
    myChart.setOption(option)
  })
  return (
    <Card
      tw="border border-[#4C5E70] border-solid rounded-[10px] w-[49%]"
      css={css`
        background: linear-gradient(
          68.65deg,
          rgba(76, 93, 112, 0.29) -0.54%,
          rgba(76, 94, 112, 0) 124.29%
        );
      `}
    >
      <CardContent tw="flex pt-[39px] pb-[39px] pl-0">
        <div tw="flex justify-center items-center border-r border-[#4C5E70] pr-[36px] mr-[40px]">
          <div tw="w-[2px] h-[44px] bg-[white] rounded-[6px] mr-[29px]" />
          <div
            tw="w-[64px] h-[64px] rounded-[6px] flex justify-center items-center"
            css={css`
              background: linear-gradient(
                43.53deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(235, 253, 255, 0.1) 91.47%
              );
            `}
          >
            <Icons name={iconName} size={30} type="light" />
          </div>
          <div tw="ml-[21px] min-w-[84px]">
            <div tw="text-white text-[14px] mt-[8px]">{name}</div>
            <div tw="text-white text-[28px]">{amount}</div>
          </div>
        </div>
        <div id={id} tw="w-[100%] h-[90px]" />
      </CardContent>
    </Card>
  )
}

export default Release
