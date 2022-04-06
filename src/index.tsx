import { createRoot } from 'react-dom/client'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import GlobalStyles from './styles/GlobalStyle'
import 'tippy.js/dist/tippy.css'
import 'simplebar-react/dist/simplebar.min.css'
// import 'tippy.js/dist/svg-arrow.css'
// import 'tippy.js/animations/scale-subtle.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <>
    <GlobalStyles />
    <App />
  </>
)
