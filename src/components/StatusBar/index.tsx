import tw from 'twin.macro'

export enum StatusBarEnum {
  blue,
  yellow,
  red,
  gray,
  green,
}

const statusStyles = [
  {
    type: StatusBarEnum.blue,
    style: {
      wrapper: tw`bg-info-bg`,
      text: tw`text-info`,
      out: tw`bg-[#C5EAFF]`,
      border: tw`border-[#2FB4FF]`,
      bg: tw`bg-info`,
    },
  },
  {
    type: StatusBarEnum.yellow,
    style: {
      wrapper: tw`bg-warning-bg`,
      text: tw`text-warning`,
      out: tw`bg-[#fff0ba]`,
      border: tw`border-[#ffe278]`,
      bg: tw`bg-warning`,
    },
  },
  {
    type: StatusBarEnum.red,
    style: {
      wrapper: tw`bg-error-bg`,
      text: tw`text-error`,
      out: tw`bg-[#f6dbda]`,
      border: tw`border-[#e0a9a8]`,
      bg: tw`bg-error`,
    },
  },
  {
    type: StatusBarEnum.gray,
    style: {
      wrapper: tw`bg-bgColor-light`,
      text: tw`text-neut-8`,
      out: tw`bg-[#dee7f1]`,
      border: tw`border-[#b7c8d8]`,
      bg: tw`bg-neut-8`,
    },
  },
  {
    type: StatusBarEnum.green,
    style: {
      wrapper: tw`bg-success-bg`,
      text: tw`text-success`,
      out: tw`bg-[#c6f4e4]`,
      border: tw`border-[#47CB9F]`,
      bg: tw`bg-success`,
    },
  },
]

export const StatusBar = ({
  type,
  label,
}: {
  type: StatusBarEnum
  label: string
}) => {
  const styles = statusStyles.find((s) => s.type === type)
  if (!styles) {
    return null
  }

  const { wrapper, text: textStyle, out, border, bg } = styles.style
  return (
    <div
      css={wrapper}
      tw="inline-flex gap-2 leading-5 items-center rounded-full px-1"
    >
      <div css={[out]} tw="w-3 h-3 rounded-full p-0.5 inline-flex items-center">
        <div css={[border, bg]} tw="inline-block w-2 h-2 rounded-full border" />
      </div>
      <span css={textStyle} tw="leading-5">
        {label}
      </span>
    </div>
  )
}

export default StatusBar
