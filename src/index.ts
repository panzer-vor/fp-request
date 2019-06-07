import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import xhr from './xhr'
import { buildURL } from './helpers/url'
import { transformRequest, transformResponse } from './helpers/data'
import { pipe } from 'ramda'
import { processHeaders } from './helpers/headers'

export function axios (config: AxiosRequestConfig): AxiosPromise {
	return pipe(
		transformConfig,
		(config) => xhr(config).then(res => transformResponseData(res)),
	)(config)
}

function transformConfig(config: AxiosRequestConfig) {
	return pipe(
		transformURL,
		transformHeaders,
		transformRequestData,
	)(config)
}

function transformURL(config: AxiosRequestConfig): AxiosRequestConfig {
	const { url, params } = config
	return {
		...config,
		url: buildURL(url, params),
	}
}

function transformRequestData (config: AxiosRequestConfig): AxiosRequestConfig {
	return {
		...config,
		data: transformRequest(config.data)
	}
}

function transformHeaders (config: AxiosRequestConfig): AxiosRequestConfig {
	const { headers = {}, data } = config
	return processHeaders(headers, data)
}

function transformResponseData (res: AxiosResponse) {
	return {
		...res,
		data: transformResponse(res.data),
	}
}

export default axios