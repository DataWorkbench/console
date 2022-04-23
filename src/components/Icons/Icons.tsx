import tw from 'twin.macro'

function requireAll(r: any) {
  r.keys().forEach(r)
}
requireAll((require as any).context('assets/icons/', true, /\.svg$/))

interface IconProps {
  name: string
  className?: string
  size?: number
  width?: number
  height?: number
  isLegoIcon?: boolean
  type?: 'light' | 'dark'
}

const Icons = (props: IconProps) => {
  const {
    name,
    isLegoIcon = false,
    className = '',
    size = 24,
    height,
    width,
    type,
    ...others
  } = props
  const wh = {
    width: width || size,
    height: height || size,
  }
  const id = isLegoIcon ? `#lego-ui-icon-${name}` : `#bdicon-${name}`

  return (
    <svg
      {...wh}
      {...others}
      className={className}
      css={[
        tw`inline-block`,
        type === 'light' && tw`text-white`,
        type === 'dark' && tw`text-neut-8`,
      ]}
    >
      <use xlinkHref={id} />
    </svg>
  )
}

export default Icons
