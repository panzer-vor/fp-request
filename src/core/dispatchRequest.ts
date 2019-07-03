import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import * as R from 'ramda'
import { flattenHeaders } from '../helpers/headers'
import { transformRequestCore, transformResponseCore } from './transfrom'

const throwIfCancellationRequested = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
  return config
}

const transformURL = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const { url, params } = config
  return {
    ...config,
    url: buildURL(url!, params)
  }
}

const transformResponseData = (res: AxiosResponse) => {
  return transformResponseCore(res.data, res.config.transformResponse)
}

const transformConfig = (config: AxiosRequestConfig) => {
  return R.pipe(
    transformURL,
    transformRequestCore,
    flattenHeaders,
  )(config)
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  return R.pipe(
    throwIfCancellationRequested,
    transformConfig,
    config =>
      xhr(config).then(res => {
        return {
          ...res,
          data: transformResponseData(res)
        }
      })
  )(config)
}

