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
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  return {
    ...config,
    url: buildURL(url!, params, paramsSerializer)
  }
}

const transformResponseData = (res: AxiosResponse) =>
  transformResponseCore(res.data, res.config.transformResponse)

const transformConfig = (config: AxiosRequestConfig) => {
  return R.pipe(
    transformURL,
    transformRequestCore,
    flattenHeaders
  )(config)
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  return R.pipe(
    throwIfCancellationRequested,
    transformConfig,
    config =>
      xhr(config).then(
        res => {
          return {
            ...res,
            data: transformResponseData(res)
          }
        },
        e => {
          if (e && e.response) {
            e.response.data = transformResponseData(e.response)
          }
          return Promise.reject(e)
        }
      )
  )(config)
}
