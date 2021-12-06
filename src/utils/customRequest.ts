import axios, { AxiosRequestConfig } from 'axios'
import { isFunction } from 'lodash-es'

const baseConfig: AxiosRequestConfig = {
  method: 'POST',
  timeout: 30000,
}

const client = axios.create(baseConfig)

const formdata = async (
  data: { method?: any; url: string; [params: string]: unknown },
  options: { cancel?: () => {}; [params: string]: unknown } = {}
) => {
  const { method = 'POST', url, headers, params } = data
  const { cancel, ...config } = options
  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    data: params,
    headers,
    ...config,
  }
  if (isFunction(cancel)) {
    axiosConfig.cancelToken = new axios.CancelToken(cancel)
  }

  return client.request(axiosConfig).then((response) => response.data)
}

export default formdata
