import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const propTypes = {
  step: PropTypes.number,
  stepTexts: PropTypes.array,
}

const defaultProps = {
  step: 0,
  stepTexts: [],
}

function ModalStep({ step, stepTexts }) {
  const textsLen = stepTexts.length
  return (
    <div
      className={clsx(
        `tw-flex tw-h-20 tw-justify-center tw-items-center tw-bg-neutral-N1`,
        textsLen > 2 ? 'tw-px-10' : 'tw-px-16'
      )}
    >
      {stepTexts.map((text, i) => (
        <>
          <div className="tw-text-center">
            <span
              className={clsx(
                'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full ',
                step === i
                  ? 'tw-bg-brand-G11 tw-text-white tw-leading-7'
                  : 'tw-border-2 tw-border-neutral-N3 tw-leading-6'
              )}
            >
              {i + 1}
            </span>
            <div className="tw-font-medium tw-mt-1">{text}</div>
          </div>
          {i < textsLen - 1 && (
            <div className="tw-flex-1">
              <div className="tw-border-t-2 tw-border-neutral-N3 tw-h-6">
                &nbsp;
              </div>
            </div>
          )}
        </>
      ))}
      {/* <div className="tw-text-center">
        <span
          className={clsx(
            'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full ',
            step === 0
              ? 'tw-bg-brand-G11 tw-text-white tw-leading-7'
              : 'tw-border-2 tw-border-neutral-N3 tw-leading-6'
          )}
        >
          1
        </span>
        <div className="tw-font-medium tw-mt-1">填写工作空间信息</div>
      </div>
      <div className="tw-flex-1 tw-max-w-[360px]">
        <div className="tw-border-t-2 tw-border-neutral-N3 tw-h-6">&nbsp;</div>
      </div>
      <div className="tw-text-center">
        <div
          className={clsx(
            'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full',
            step === 1
              ? 'tw-bg-brand-G11 tw-text-white tw-leading-7'
              : 'tw-border-2 tw-border-neutral-N3 tw-leading-6'
          )}
        >
          2
        </div>
        <div className="tw-font-medium tw-mt-1">绑定引擎(选填)</div>
      </div> */}
    </div>
  )
}

ModalStep.propTypes = propTypes
ModalStep.defaultProps = defaultProps

export default ModalStep
