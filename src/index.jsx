import React from 'react'
import { render } from 'react-dom'
import App from './App'
import '@QCFE/qingcloud-portal-ui/lib/scss/qingcloud-portal-ui.min.css'
import 'tailwindcss/base.css'
import 'tailwindcss/utilities.css'
import './styles.css'

render(<App />, document.getElementById('root'))
