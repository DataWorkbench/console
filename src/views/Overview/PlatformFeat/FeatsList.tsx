import PropTypes from 'prop-types'
import { Button } from '@QCFE/qingcloud-portal-ui'
import Feat0 from 'assets/svgr/bench_feat_0.svg'
import Feat1 from 'assets/svgr/bench_feat_1.svg'
import Feat2 from 'assets/svgr/bench_feat_2.svg'
import { Center } from 'components/Center'
import { css } from 'twin.macro'

const FeatComps = [Feat0, Feat1, Feat2]

function FeatList({ feats }) {
  return (
    <div tw="flex justify-between space-x-4">
      {feats.map(({ title, subtitle }, i) => {
        return (
          <div
            key={title}
            // className="group"
            tw="flex-1 border border-neut-2 rounded-sm"
          >
            {(() => {
              const FeatSVG = FeatComps[i]
              return (
                <Center tw="h-[132px] bg-[#F8FCFF]">
                  <FeatSVG />
                </Center>
              )
            })()}
            <div tw="px-2  h-24 2xl:py-4 py-2 leading-5 relative overflow-hidden">
              <div tw="absolute left-0 top-0 w-full bottom-0 flex items-center  border-t border-green-4  bg-green-1 transform transition-transform duration-200 translate-y-full group-hover:translate-y-0">
                <div tw="flex  justify-center w-full mx-4">
                  <div tw="mr-5">
                    <Button type="default">了解详情</Button>
                  </div>
                  <div>
                    <Button type="primary">开始使用</Button>
                  </div>
                </div>
              </div>
              <div
                css={css`
                  font-weight: 700;
                  font-size: 14px;
                  line-height: 19px;
                  letter-spacing: -0.03em;
                  color: #333333;
                `}
              >
                {title}
              </div>
              <div
                tw="text-neut-8 mt-1 break-all"
                css={css`
                  font-weight: 400;
                  font-size: 12px;
                  line-height: 16px;
                  letter-spacing: -0.03em;
                  color: #666666;
                `}
              >
                {subtitle}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

FeatList.propTypes = {
  feats: PropTypes.array
}

export default FeatList
