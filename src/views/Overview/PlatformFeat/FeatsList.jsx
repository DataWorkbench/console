import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Button } from '@QCFE/qingcloud-portal-ui'

function FeatList({ feats }) {
  return (
    <div className="flex justify-between">
      {feats.map((feat, i) => {
        return (
          <div
            key={feat.title}
            className={clsx(
              'flex-1 border border-neutral-N-2 rounded-sm cursor-pointer hover:border-brand-G4 group',
              { 'mr-4': i < feats.length - 1 }
            )}
          >
            <div className={`feat feat_${i} h-32 bg-neutral-N-1`} />
            <div className="px-3 py-4 leading-5 relative bg-brand-G0 overflow-hidden">
              <div className="absolute left-0 top-0 w-full bottom-0 flex items-center  border-t border-brand-G4  bg-brand-G1 transform transition-transform duration-200 translate-y-full group-hover:translate-y-0">
                <div className="flex  justify-center w-full mx-4">
                  <div className="mr-5">
                    <Button type="default">了解详情</Button>
                  </div>
                  <div>
                    <Button type="primary">开始使用</Button>
                  </div>
                </div>
              </div>
              <div className="font-semibold">{feat.title}</div>
              <div className="text-neutral-N-8 mt-1">{feat.subtitle}</div>
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
