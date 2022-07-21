import { FlexBox } from 'components'
import { css } from 'twin.macro'

interface Props {
  dataStatus: { value: number; name: string; color: string }[]
}
export const StatusCard = ({ dataStatus }: Props) => (
    <FlexBox tw="justify-between pl-[49px] w-[50%]">
      {dataStatus.map((item, index) => (
          <FlexBox key={String(index + 1)} tw="relative">
            <FlexBox
              css={css`
                background: linear-gradient(135deg, ${item.color} 0%, ${item.color}66 100%);
                opacity: 0.1;
                height: 80px;
                width: 80px;
                border-radius: 8px;
              `}
            />
            <FlexBox
              orient="column"
              css={css`
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
              `}
            >
              <div
                css={css`
                  background: ${item.color};
                  width: 24px;
                  height: 2px;
                  margin: 0 auto;
                `}
              />
              <div tw="text-[#939EA9] text-[12px] mt-[15px] mb-[6px]">{item.name}</div>
              <div
                css={css`
                  color: ${item.color};
                  font-size: 20px;
                `}
              >
                {item.value}
              </div>
            </FlexBox>
          </FlexBox>
        ))}
    </FlexBox>
  )

export default StatusCard
