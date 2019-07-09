import { isPlainObject, higher } from './util'
import * as R from 'ramda'
import { AxiosRequestConfig } from '../types'

const hasHeaderName = (normalizedName: string) =>
  R.ifElse(
    R.isEmpty,
    R.pipe(
      R.keys,
      R.any((key: string) => R.equals(R.toUpper(key), R.toUpper(normalizedName)))
    ),
    R.F
  )

export const processHeaders = (headers: any, data: any): any => {
  return R.when(
    R.nAry(2, isPlainObject)(data),
    // higher(isPlainObject, data),
    R.ifElse(
      hasHeaderName('Content-Type'),
      R.clone,
      R.assoc('Content-Type', 'application/json;charset=utf-8')
    )
  )(headers)
}

export const parseHeaders = (headers: string): any => {
  const parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  R.pipe(
    R.split('\r\n'),
    R.forEach(line => {
      let [key, val] = line.split(':')
      key = key.trim().toLowerCase()
      if (!key) {
        return
      }
      if (val) {
        val = val.trim()
      }
      parsed[key] = val
    })
  )(headers)
  return parsed
}

export const flattenHeaders = (config: any): AxiosRequestConfig => {
  const { headers, method } = config
  if (!headers) {
    return config
  }

  const assignedHeaders = R.pipe(
    R.mergeDeepRight(headers.common),
    R.mergeDeepLeft(headers)
  )(headers[method])

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  methodsToDelete.forEach(method => {
    delete assignedHeaders[method]
  })

  return {
    ...config,
    headers: assignedHeaders
  }
}
