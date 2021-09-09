import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@QCFE/qingcloud-portal-ui'
import tw from 'twin.macro'
import img0 from 'assets/bench_feat_0.svg'
import img1 from 'assets/bench_feat_1.svg'
import img2 from 'assets/bench_feat_2.svg'

const itemVars = {
  imgs: [img0, img1, img2],
  sizes: ['120px', '100px', '140px'],
}

function FeatList({ feats }) {
  return (
    <div tw="tw-flex tw-justify-between tw-space-x-4">
      {feats.map(({ title, subtitle }, i) => {
        return (
          <div
            key={title}
            className="group"
            tw="tw-flex-1 tw-border tw-border-neut-2 tw-rounded-sm tw-cursor-pointer hover:tw-border-green-4"
          >
            <div
              css={[
                tw`tw-bg-no-repeat tw-bg-center tw-h-32 tw-bg-neut-1`,
                {
                  backgroundImage: `url(${itemVars.imgs[i]})`,
                  backgroundSize: itemVars.sizes[i],
                },
              ]}
            />
            <div tw="tw-px-3  tw-h-24 2xl:tw-py-4 tw-py-2 tw-leading-5 tw-relative tw-bg-green-0 tw-overflow-hidden">
              <div tw="tw-absolute tw-left-0 tw-top-0 tw-w-full tw-bottom-0 tw-flex tw-items-center  tw-border-t tw-border-green-4  tw-bg-green-1 tw-transform tw-transition-transform tw-duration-200 tw-translate-y-full group-hover:tw-translate-y-0">
                <div tw="tw-flex  tw-justify-center tw-w-full tw-mx-4">
                  <div tw="tw-mr-5">
                    <Button type="default">了解详情</Button>
                  </div>
                  <div>
                    <Button type="primary">开始使用</Button>
                  </div>
                </div>
              </div>
              <div tw="tw-font-semibold">{title}</div>
              <div tw="tw-text-neut-8 tw-mt-1">{subtitle}</div>
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
