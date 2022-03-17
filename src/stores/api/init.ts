import Cookies from 'js-cookie'
import { get } from 'lodash-es'
import { customRequest } from 'utils'

export const describeDataomnis = () => {
  const user = get(window, 'USER.user_id', '')
  const console = get(window, 'USER.console', '')
  const params = {
    action: 'DescribeDataomnis',
    user_id: user,
    console_id: console,
  }

  return customRequest({
    url: '/api/?action=DescribeDataomnis',
    params: `params=${encodeURIComponent(JSON.stringify(params))}`,
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  }).catch(() => null)
}

export const activateDataomnis = () => {
  const user = get(window, 'USER.user_id', '')
  const console = get(window, 'USER.console', '')
  const params = {
    action: 'ActivateDataomnis',
    user_id: user,
    console_id: console,
  }

  return customRequest({
    url: '/api/?action=ActivateDataomnis',
    params: `params=${encodeURIComponent(JSON.stringify(params))}`,
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })
}

export default {}
