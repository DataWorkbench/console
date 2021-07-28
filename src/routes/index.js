import Home from 'components/Home'
import Create from 'views/Create'
import Overview from 'views/Overview'
import Layout, { SpaceLayout } from 'views/Layout'
import Workspace from 'views/Workspace'
import Dm from 'views/Space/Dm'
import Manage from 'views/Space/Manage'
import Ops from 'views/Space/Ops'
import Upcloud from 'views/Space/Upcloud'

const routes = [
  {
    path: '/:zone/workspace/:space',
    component: SpaceLayout,
    routes: [
      {
        path: '/:zone/workspace/:space/upcloud/:mod?',
        component: Upcloud,
      },
      {
        path: '/:zone/workspace/:space/dm/:mod?',
        component: Dm,
      },
      {
        path: '/:zone/workspace/:space/ops/:mod?',
        component: Ops,
      },
      {
        path: '/:zone/workspace/:space/manage/:mod?',
        component: Manage,
      },
    ],
  },
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
