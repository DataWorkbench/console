import { css } from 'twin.macro'
import { Card, CardContent } from 'components'
import { useState } from 'react'
import { TextTitle } from './TextTitle'

interface Props {
  textTitle: string
  statusData: { value: string; name: string; color: string }[]
  total: number
}
export const Example = ({ textTitle, statusData, total }: Props) => {
  const [tabIndex, setTabIndex] = useState('')
  const toPercent = (point) => {
    let percent = Number((point / total) * 100).toFixed(1)
    percent += '%'
    return percent
  }
  return (
    <Card tw="bg-[#273849] rounded-[4px] w-[49%] pt-[24px] pb-[24px] pl-[24px] pr-[40px]">
      <CardContent tw="p-0">
        <TextTitle>{textTitle}</TextTitle>
        <div tw="text-[white] text-[32px] text-right mt-[12px]">
          {total} <span tw="text-[14px]">总实例数</span>
        </div>
        <div tw="w-[100%] h-[12px] mt-[12px] rounded-[6px] overflow-hidden flex">
          {statusData.map((item, index) => (
            <div
              key={String(index + 1)}
              css={css`
                width: ${total === 0 ? '14.3%' : toPercent(item.value)};
                height: 100%;
                background: ${tabIndex === String(index)
                  ? item.color
                  : `${item.color}66`};
                :hover {
                  background: ${item.color};
                }
              `}
              onMouseEnter={() => setTabIndex(String(index))}
              onMouseLeave={() => setTabIndex('')}
            />
          ))}
        </div>
        <div tw="flex justify-between flex-wrap mt-[14px]">
          {statusData.map((item, index) => (
            <div
              key={String(index + 1)}
              onMouseEnter={() => setTabIndex(String(index))}
              onMouseLeave={() => setTabIndex('')}
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 10px 0;
                width: 49%;
                height: 56px;
                padding: 0 16px;
                border: 1px solid
                  ${tabIndex === String(index) ? item.color : '#4c5e70'};
                border-radius: 4px;
                background: linear-gradient(
                  68.65deg,
                  rgba(76, 93, 112, 0.29) -0.54%,
                  rgba(76, 94, 112, 0) 124.29%
                );
                :hover {
                  border: 1px solid ${item.color};
                  span {
                    color: ${item.color};
                  }
                }
              `}
            >
              <div tw="flex items-center">
                <div
                  css={css`
                    width: 12px;
                    height: 12px;
                    background: ${item.color};
                    border: 3px solid #fff;
                    border-radius: 50%;
                    color: ${item.color};
                    margin-right: 8px;
                  `}
                />
                <div tw="text-[#939EA9]">
                  {item.name}：
                  <span
                    css={css`
                      font-size: 16px;
                      color: ${tabIndex === String(index)
                        ? item.color
                        : '#fff'};
                    `}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
              <div tw="text-[#939EA9] w-[79px]">
                占比：
                <span
                  css={css`
                    font-size: 16px;
                    color: ${tabIndex === String(index) ? item.color : '#fff'};
                  `}
                >
                  {total === 0 ? '0.0%' : toPercent(item.value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Example
