import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { pipe } from 'ramda'
import { flattenHeaders } from '../helpers/headers'
import { transformRequestCore, transformResponseCore } from './transfrom'

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
  return pipe(
    transformURL,
    transformRequestCore,
    flattenHeaders
  )(config)
}

export default (config: AxiosRequestConfig): AxiosPromise => {
  return pipe(
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
