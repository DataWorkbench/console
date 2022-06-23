import { render } from 'react-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'
import 'tippy.js/dist/tippy.css'
import 'simplebar-react/dist/simplebar.min.css'
import './themes/colors/index.tpl'
// import 'tippy.js/dist/svg-arrow.css'
// import 'tippy.js/animations/scale-subtle.css'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById('root')
)
