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
    <div tw="flex h-20 justify-center items-center bg-neut-1 dark:bg-neut-17">
      <div
        css={[tw`flex justify-center items-center`, stepClassName || tw`w-2/3`]}
      >
        {stepTexts.map((text, i) => (
          <React.Fragment key={text}>
            <div css={[tw`text-center`, sameLine && tw`flex items-center`]}>
              <span
                css={[
                  tw`inline-block w-7 h-7 rounded-full`,
                  step === i
                    ? tw`bg-green-11 text-white leading-7`
                    : tw`border-2 border-neut-3 dark:border-neut-13 leading-6 dark:text-neut-8`,
                ]}
              >
                {i + 1}
              </span>
              <div
                css={[
                  tw`font-medium`,
                  step !== i && tw`dark:text-neut-8`,
                  sameLine ? tw`ml-1` : tw`mt-1`,
                ]}
              >
                {text}
              </div>
            </div>
            {i < textsLen - 1 && (
              <div tw="flex-1">
                <div
                  css={[
                    tw`border-t-2 border-neut-3 dark:border-neut-13 h-6`,
                    sameLine ? tw`mt-5 mx-2` : '',
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
