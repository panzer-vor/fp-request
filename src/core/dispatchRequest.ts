import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import * as R from 'ramda'
import { flattenHeaders } from '../helpers/headers'
import { transformRequestCore, transformResponseCore } from './transfrom'

const throwIfCancellationRequested = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
  return config
}

export const transformURL = (config: AxiosRequestConfig): AxiosRequestConfig => {
  let { url, params, paramsSerializer, baseUrl } = config
  if (baseUrl && !isAbsoluteURL(url!)) {
    url = combineURL(baseUrl, url)
  }
  return {
    ...config,
    url: buildURL(url!, params, paramsSerializer)
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

