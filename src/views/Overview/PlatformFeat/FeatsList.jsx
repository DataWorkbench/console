import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Button } from '@QCFE/qingcloud-portal-ui'
import styles from './styles.module.css'

function FeatList({ feats }) {
  return (
    <div className="tw-flex tw-justify-between">
      {feats.map((feat, i) => {
        return (
          <div
            key={feat.title}
            className={clsx(
              'tw-flex-1 tw-border tw-border-neutral-N2 tw-rounded-sm tw-cursor-pointer tw-hover:border-brand-G4 tw-group',
              { 'tw-mr-4': i < feats.length - 1 }
            )}
          >
            <div
              className={clsx(
                styles.feat,
                styles[`feat_${i}`],
                'tw-h-32 tw-bg-neutral-N1'
              )}
            />
            <div className="tw-px-3 tw-py-4 tw-leading-5 tw-relative tw-bg-brand-G0 tw-overflow-hidden">
              <div className="tw-absolute tw-left-0 tw-top-0 tw-w-full tw-bottom-0 tw-flex tw-items-center  tw-border-t tw-border-brand-G4  tw-bg-brand-G1 tw-transform tw-transition-transform tw-duration-200 tw-translate-y-full group-hover:tw-translate-y-0">
                <div className="tw-flex  tw-justify-center tw-w-full tw-mx-4">
                  <div className="tw-mr-5">
                    <Button type="default">了解详情</Button>
                  </div>
                  <div>
                    <Button type="primary">开始使用</Button>
                  </div>
                </div>
              </div>
              <div className="tw-font-semibold">{feat.title}</div>
              <div className="tw-text-neutral-N8 tw-mt-1">{feat.subtitle}</div>
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
