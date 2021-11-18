import 'assets/icons/circle_check.svg'
import 'assets/icons/circle_close.svg'
import 'assets/icons/circle_enable.svg'
import 'assets/icons/circle_disable.svg'
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
import 'assets/icons/direct.svg'

// function requireAll(r: any) {
//   r.keys().forEach(r)
// }
// requireAll(require.context('assets/icons/', true, /\.svg$/))

interface IconProps {
  name: string
  className?: string
  size?: number
  width?: number
  height?: number
}

const Icons = (props: IconProps) => {
  const { name, className = '', size = 24, height, width, ...others } = props
  const wh = {
    width: width || size,
    height: height || size,
  }

  return (
    <svg {...wh} {...others} className={className}>
      <use xlinkHref={`#bdicon-${name}`} />
    </svg>
  )
}

export default Icons
