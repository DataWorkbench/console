import React from 'react'
import PropTypes from 'prop-types'
import tw from 'twin.macro'

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
    <div tw="tw-flex tw-h-20 tw-justify-center tw-items-center tw-bg-neut-1 dark:tw-bg-neut-17">
      <div
        css={[
          tw`tw-flex tw-justify-center tw-items-center`,
          stepClassName || tw`tw-w-2/3`,
        ]}
      >
        {stepTexts.map((text, i) => (
          <React.Fragment key={text}>
            <div
              css={[
                tw`tw-text-center`,
                sameLine && tw`tw-flex tw-items-center`,
              ]}
            >
              <span
                css={[
                  tw`tw-inline-block tw-w-7 tw-h-7 tw-rounded-full`,
                  step === i
                    ? tw`tw-bg-green-11 tw-text-white tw-leading-7`
                    : tw`tw-border-2 tw-border-neut-3 dark:tw-border-neut-13 tw-leading-6 dark:tw-text-neut-8`,
                ]}
              >
                {i + 1}
              </span>
              <div
                css={[
                  tw`tw-font-medium`,
                  step !== i && tw`dark:tw-text-neut-8`,
                  sameLine ? tw`tw-ml-1` : tw`tw-mt-1`,
                ]}
              >
                {text}
              </div>
            </div>
            {i < textsLen - 1 && (
              <div tw="tw-flex-1">
                <div
                  css={[
                    tw`tw-border-t-2 tw-border-neut-3 dark:tw-border-neut-13 tw-h-6`,
                    sameLine ? tw`tw-mt-5 tw-mx-2` : '',
                  ]}
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
