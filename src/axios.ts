import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './default'
import mergeConfig from './core/mergeConfig'
import Cancel, { isCancel } from './cancel/Cancel';
import CancelToken from './cancel/cancelToken';

const createInstance = (config: AxiosRequestConfig): AxiosStatic => {
  const context = new Axios(config)
  const instance = Axios.prototype.request.bind(context)
  extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaults)

axios.create = config => {
  return createInstance(mergeConfig(defaults, config))
}

axios.Cancel = Cancel
axios.CancelToken = CancelToken
axios.isCancel = isCancel

export default axios
