import PropTypes from 'prop-types'
import { Button } from '@QCFE/qingcloud-portal-ui'
import Feat0 from 'assets/svgr/bench_feat_0.svg'
import Feat1 from 'assets/svgr/bench_feat_1.svg'
import Feat2 from 'assets/svgr/bench_feat_2.svg'
import { Center } from 'components/Center'

const FeatComps = [Feat0, Feat1, Feat2]

function FeatList({ feats }) {
  return (
    <div tw="flex justify-between space-x-4">
      {feats.map(({ title, subtitle }, i) => {
        return (
          <div
            key={title}
            className="group"
            tw="flex-1 border border-neut-2 rounded-sm cursor-pointer hover:border-green-4"
          >
            {(() => {
              const FeatSVG = FeatComps[i]
              return (
                <Center tw="h-32">
                  <FeatSVG />
                </Center>
              )
            })()}

            {/* <div
              css={[
                tw`bg-no-repeat bg-center h-32 bg-neut-1`,
                {
                  backgroundImage: `url(${itemVars.imgs[i]})`,
                  backgroundSize: itemVars.sizes[i],
                },
              ]}
            /> */}
            <div tw="px-3  h-24 2xl:py-4 py-2 leading-5 relative bg-green-0 overflow-hidden">
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
              <div tw="font-semibold">{title}</div>
              <div tw="text-neut-8 mt-1">{subtitle}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

FeatList.propTypes = {
  feats: PropTypes.array,
}

export default FeatList
