import { render } from 'react-dom'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'
import 'tippy.js/dist/tippy.css'
import './styles/lego.css'
// import 'tippy.js/themes/light.css'

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById('root')
)
