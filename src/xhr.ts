import { IRequestConfig, IPromise, IResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { keys, forEach, pipe } from 'ramda'

export default function xhr(config: IRequestConfig): IPromise {
  return new Promise((resolve, reject) => {
    const { headers, data = null, url, method = 'get', responseType } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType !== 'text' ? request.response : request.responseText
      const response: IResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      resolve(response)
    }
    pipe(
      keys,
      forEach(v => {
        request.setRequestHeader(v, headers[v])
      })
    )(headers)
    request.send(data)
  })
}
