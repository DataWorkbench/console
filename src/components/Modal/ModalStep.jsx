import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const propTypes = {
  step: PropTypes.number,
  stepTexts: PropTypes.array,
  sameLine: PropTypes.bool,
  stepClassName: PropTypes.string,
}

const defaultProps = {
  step: 0,
  stepTexts: [],
  sameLine: false,
}

function ModalStep({ step, stepTexts, sameLine, stepClassName }) {
  const textsLen = stepTexts.length
  return (
    <div
      className={clsx(
        `tw-flex tw-h-20 tw-justify-center tw-items-center tw-bg-neut-1 dark:tw-bg-neut-17`
        // textsLen > 2 ? 'tw-px-10' : 'tw-px-16'
      )}
    >
      <div
        className={clsx(
          'tw-flex tw-justify-center tw-items-center',
          stepClassName || 'tw-w-2/3'
        )}
      >
        {stepTexts.map((text, i) => (
          <React.Fragment key={text}>
            <div
              className={clsx(
                'tw-text-center',
                sameLine ? 'tw-flex tw-items-center' : ''
              )}
            >
              <span
                className={clsx(
                  'tw-inline-block tw-w-7 tw-h-7 tw-rounded-full ',
                  step === i
                    ? 'tw-bg-green-11 tw-text-white tw-leading-7'
                    : 'tw-border-2 tw-border-neut-3 dark:tw-border-neut-13 tw-leading-6 dark:tw-text-neut-8'
                )}
              >
                {i + 1}
              </span>
              <div
                className={clsx(
                  'tw-font-medium ',
                  step !== i && 'dark:tw-text-neut-8',
                  sameLine ? 'tw-ml-1' : 'tw-mt-1'
                )}
              >
                {text}
              </div>
            </div>
            {i < textsLen - 1 && (
              <div className="tw-flex-1">
                <div
                  className={clsx(
                    'tw-border-t-2 tw-border-neut-3 dark:tw-border-neut-13 tw-h-6',
                    sameLine ? 'tw-mt-5 tw-mx-2' : ''
                  )}
                >
                  &nbsp;
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

ModalStep.propTypes = propTypes
ModalStep.defaultProps = defaultProps

export default ModalStep
