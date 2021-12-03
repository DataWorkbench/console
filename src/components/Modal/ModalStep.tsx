import { Fragment } from 'react'
import tw from 'twin.macro'

interface ModalStepProps {
  step: number
  stepTexts: string[]
  sameLine?: boolean
  stepClassName?: any
  className?: string
}

const ModalStep = ({
  step = 0,
  stepTexts = [],
  sameLine = false,
  stepClassName,
  className,
}: ModalStepProps) => {
  const textsLen = stepTexts.length
  return (
    <div
      className={className}
      tw="flex h-20 justify-center items-center bg-neut-1 dark:bg-neut-17"
    >
      <div
        css={[tw`flex justify-center items-center`, stepClassName || tw`w-2/3`]}
      >
        {stepTexts.map((text, i) => (
          <Fragment key={text}>
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
                  step !== i ? tw`dark:text-neut-8` : tw`font-medium`,
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
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default ModalStep
