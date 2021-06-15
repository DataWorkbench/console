import Home from 'components/Home'
import Create from 'views/Create'
import Overview from 'views/Overview'
import Layout from 'views/Layout'
import Workspace from 'views/Workspace'

const routes = [
  {
    component: Layout,
    routes: [
      {
        path: '/create/:step?',
        component: Create,
      },
      {
        path: '/overview',
        component: Overview,
      },
      {
        path: '/workspace',
        component: Workspace,
      },
      {
        path: '/',
        component: Home,
      },
      {
        path: '/home',
        component: Home,
      },
    ],
  },
]

export default routes
