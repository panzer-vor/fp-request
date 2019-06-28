import { IRequestConfig, IPromise, IResponse } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { pipe } from 'ramda'
import { processHeaders } from './helpers/headers'

export function axios(config: IRequestConfig): IPromise {
  return pipe(
    transformConfig,
    config => xhr(config).then(res => transformResponseData(res))
  )(config)
}

function transformConfig(config: IRequestConfig) {
  return pipe(
    transformURL,
    transformHeaders,
    transformRequestData
  )(config)
}

function transformURL(config: IRequestConfig): IRequestConfig {
  const { url, params } = config
  return {
    ...config,
    url: buildURL(url, params)
  }
}

function transformRequestData(config: IRequestConfig): IRequestConfig {
  return {
    ...config,
    data: transformRequest(config.data)
  }
}

function transformHeaders(config: IRequestConfig): IRequestConfig {
  const { headers = {}, data } = config
  return {
    ...config,
    headers: processHeaders(headers, data)
  }
}

function transformResponseData(res: IResponse) {
  return {
    ...res,
    data: transformResponse(res.data)
  }
}

export default axios
