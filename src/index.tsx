import { render } from 'react-dom'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'
import 'tippy.js/dist/tippy.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'simplebar/dist/simplebar.min.css'
// import 'tippy.js/dist/svg-arrow.css'
// import 'tippy.js/animations/scale-subtle.css'

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById('root')
)
