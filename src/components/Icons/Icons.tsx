import 'assets/icons/circle_green.svg'
import 'assets/icons/circle_grey.svg'
import 'assets/icons/icon_service_0.svg'
import 'assets/icons/icon_service_1.svg'
import 'assets/icons/icon_service_2.svg'
import 'assets/icons/icon_service_3.svg'
import 'assets/icons/icon_service_4.svg'
import 'assets/icons/icon_service_5.svg'
import 'assets/icons/screen_failed.svg'
import 'assets/icons/screen_running.svg'
import 'assets/icons/screen_stoped.svg'
import 'assets/icons/screen_success.svg'
import 'assets/icons/screen_waiting.svg'

// function requireAll(r: any) {
//   r.keys().forEach(r)
// }
// requireAll(require.context('assets/icons/', true, /\.svg$/))

interface IconProps {
  name: string
  className?: string
  size?: number
}

const Icons = (props: IconProps) => {
  const { name, className = '', size = 24, ...others } = props
  const wh = {
    width: size,
    height: size,
  }

  return (
    <svg {...wh} {...others} className={className}>
      <use xlinkHref={`#bdicon-${name}`} />
    </svg>
  )
}

export default Icons
