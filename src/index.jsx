import { render } from 'react-dom'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById('root')
)
