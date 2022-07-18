import { render } from 'react-dom'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Auth from 'views/Auth/Auth'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'
import 'tippy.js/dist/tippy.css'
import 'simplebar-react/dist/simplebar.min.css'
import './themes/colors/index.tpl'
import App from './App'
// import 'tippy.js/dist/svg-arrow.css'
// import 'tippy.js/animations/scale-subtle.css'
import 'dayjs/locale/zh-cn'
import './config.tpl'

dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

render(
  <>
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
      <Auth>
        <App />
      </Auth>
    </QueryClientProvider>
  </>,
  document.getElementById('root')
)
